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
} from 'react-native';
import {WebView} from 'react-native-webview';

// 是否暗黑模式，暂时不支持暗黑模式
const isDarkMode = Appearance.getColorScheme() === 'dark' && false;
console.log('isDarkMode：', isDarkMode);

// 主页面渲染
class App extends React.Component {
    webview = React.createRef();
    state = {
        appInited: false,
        statusBarHeight: 47,
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
    componentDidMount() {
        this.getStatusBarHeight();
        this.handAndroidBackBtn();
    }
    render() {
        const {webappUrl, appInited} = this.state;
        return (
            <View style={styles.appWrap}>
                <StatusBar
                    barStyle="dark-content"
                    translucent={true}
                    backgroundColor="transparent"
                />

                {/* 不显示webview的时候显示view，作为缓冲区 */}
                {!appInited && (
                    <View style={styles.indexView}>
                        <TouchableOpacity onPress={this.handleAppInit}>
                            <Text>缓冲区，用于初始化显示内容</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* webview第一时间渲染，缩短渲染时间 */}
                <WebView
                    style={styles.webviewStyle}
                    ref={this.webview}
                    source={{
                        uri: 'https://baidu.com',
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

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
    appWrap: {
        width,
        height,
        position: 'relative',
        zIndex: 0,
    },
    indexView: {
        width,
        height,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2,
    },
    webviewStyle: {
        width,
        height,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        marginTop: StatusBar.currentHeight,
    },
});

export default App;
