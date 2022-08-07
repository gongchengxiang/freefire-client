import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Dimensions,
    Appearance,
    View,
    Text,
    TouchableOpacity,
    NativeModules,
    Platform,
    Linking,
    BackHandler,
    Keyboard,
} from 'react-native';
import {WebView} from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';
import SystemNavigationBar from 'react-native-system-navigation-bar';

// 是否暗黑模式，暂时不支持暗黑模式
const isDarkMode = Appearance.getColorScheme() === 'dark' && false;
console.log('isDarkMode：', isDarkMode);

// 主页面渲染
class App extends React.Component {
    webview = React.createRef();
    state = {
        advertisementInited: false,
        appInited: false,
        statusBarHeight: 47,
        webviewAutoHeight:
            Dimensions.get('window').height - StatusBar.currentHeight,
    };
    getStatusBarHeight = () => {
        // 状态栏高度
        if (Platform.OS === 'ios') {
            NativeModules.StatusBarManager.getHeight(e => {
                this.setState(() => ({
                    statusBarHeight: e.height || 47,
                }));
            });
        } else {
            this.setState(() => ({
                statusBarHeight: StatusBar.currentHeight,
            }));
        }
    };
    onWebviewLoadEnd = data => {
        console.log('loaded');
        const jsCode = `
            const rnMsg = 'hello, webview!'
            window.ReactNativeWebView.postMessage(rnMsg)
        `;
        this.webview.current.injectJavaScript(jsCode);
    };
    onWebviewLoadError = e => {
        // webview加载失败
    };
    onRenderProcessGone = e => {
        // webview崩溃，适用于Android
    };
    onContentProcessDidTerminate = e => {
        // webview进程终止，适用于ios，和上面那个webview崩溃类似
    };
    onWebviewMessage = e => {
        // webview 中的js执行window.ReactNativeWebView.postMessage(string)时候，这里会接收到string
        console.log('webview-msg:', e.nativeEvent.data);
    };
    onWebviewScroll = e => {
        // webview 滚动时触发
    };
    onShouldStartLoadWithRequest = request => {
        if (
            request.url.startsWith('https://') ||
            request.url.startsWith('http://')
        ) {
            return true;
        } else {
            Linking.openURL(request.url).catch(e => {
                console.log(e);
            });
            return false;
        }
    };
    handleAppInit = () => {
        this.setState(() => ({
            appInited: true,
        }));
    };
    toOtherPage = uri => {
        this.setState(() => ({
            appInited: true,
            webviewUri: uri,
        }));
    };
    postMessageToWebview = message => {
        this.webview.current.postMessage(message);
    };
    handAndroidBackBtn = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => {
                try {
                    this.webview.current.goBack();
                    return true;
                } catch (error) {
                    return false; // 退出
                }
            });
        }
    };
    handWebviewAutoHeight = () => {
        //监听键盘弹出事件
        Keyboard.addListener('keyboardDidShow', e => {
            console.log(e);
            this.setState(() => ({
                webviewAutoHeight:
                    Dimensions.get('window').height -
                    e.endCoordinates.height -
                    StatusBar.currentHeight,
            }));
        });
        //监听键盘隐藏事件
        Keyboard.addListener('keyboardDidHide', e => {
            this.setState(() => ({
                webviewAutoHeight:
                    Dimensions.get('window').height -
                    e.endCoordinates.height -
                    StatusBar.currentHeight,
            }));
        });
    };
    setAndroidNavBarColor = color => {
        return SystemNavigationBar.setNavigationColor(color || 'white');
    };
    setAndroidNavBarDisplayStatus = isShow => {
        if (isShow) {
            return SystemNavigationBar.navigationShow();
        } else {
            return SystemNavigationBar.navigationHide();
        }
    };
    componentDidMount() {
        this.setAndroidNavBarColor('transparent');
        this.getStatusBarHeight();
        this.handAndroidBackBtn();
        this.handWebviewAutoHeight();

        setTimeout(() => {
            SplashScreen.hide();
        }, 1000);
    }
    componentDidUpdate() {
        if (this.state.appInited) {
            this.setAndroidNavBarColor('white');
        }
    }
    render() {
        const {advertisementInited, webviewUri, appInited, webviewAutoHeight} =
            this.state;
        return (
            <View style={styles.appWrap}>
                <StatusBar
                    barStyle="dark-content"
                    translucent={true}
                    backgroundColor="transparent"
                />
                {/* 不显示webview的时候显示view，作为缓冲区 */}
                {!appInited && (
                    <View style={styles.advertisementView}>
                        <TouchableOpacity onPress={this.handleAppInit}>
                            <Text style={{marginBottom: 40}}>
                                缓冲区，用于初始化(广告)
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                this.toOtherPage('https://www.bilibili.com/')
                            }>
                            <Text style={{marginBottom: 40}}>bilibili</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                this.toOtherPage(
                                    'https://vant-contrib.gitee.io/vant/#/zh-CN',
                                )
                            }>
                            <Text style={{marginBottom: 40}}>vant Form</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {/* webview第一时间渲染，缩短渲染时间 */}
                <WebView
                    style={{
                        ...styles.webviewStyle,
                        height: webviewAutoHeight,
                    }}
                    ref={this.webview}
                    source={{
                        uri: webviewUri || 'https://baidu.com',
                    }}
                    originWhitelist={['*', 'file://', 'https://*', 'http://*']}
                    mediaPlaybackRequiresUserAction={false}
                    javaScriptEnabled={true}
                    scalesPageToFit={false}
                    javaScriptCanOpenWindowsAutomatically={true}
                    bounces={false}
                    pullToRefreshEnabled={false}
                    setBuiltInZoomControls={false}
                    setDisplayZoomControls={false}
                    mixedContentMode="always"
                    allowingReadAccessToURL={'file://'}
                    allowUniversalAccessFromFileURLs={true}
                    allowFileAccessFromFileURLS={true}
                    allowsBackForwardNavigationGestures={true} // 此属性可能不能拦截，可能需要自己实现
                    allowFileAccess={true}
                    cacheEnabled={true}
                    saveFormDataDisabled={false}
                    cacheMode={'LOAD_DEFAULT'}
                    sharedCookiesEnabled={true}
                    allowsLinkPreview={false}
                    allowsFullscreenVideo={true}
                    allowsInlineMediaPlayback={true}
                    domStorageEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    dataDetectorTypes="none"
                    geolocationEnabled={true}
                    textZoom={100}
                    autoManageStatusBarEnabled={true}
                    setSupportMultipleWindows={true}
                    menuItems={[]}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    applicationNameForUserAgent={'<freefire>'}
                    overScrollMode={'never'}
                    onLoadEnd={this.onWebviewLoadEnd}
                    onError={this.onWebviewLoadError}
                    onRenderProcessGone={this.onRenderProcessGone}
                    onContentProcessDidTerminate={
                        this.onContentProcessDidTerminate
                    }
                    onShouldStartLoadWithRequest={
                        this.onShouldStartLoadWithRequest
                    }
                    onMessage={this.onWebviewMessage}
                    onScroll={this.onWebviewScroll}
                />
            </View>
        );
    }
}

const {height, width} = Dimensions.get('screen');
console.log(2, height);
console.log(3, Dimensions.get('window').height);
const styles = StyleSheet.create({
    appWrap: {
        width,
        height,
        position: 'relative',
        zIndex: 0,
    },
    advertisementView: {
        width,
        height,
        lineHeight: 60,
        backgroundColor: '#00b8a9',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2,
    },
    webviewStyle: {
        width,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        marginTop: StatusBar.currentHeight,
    },
});

export default App;
