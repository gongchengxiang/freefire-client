import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Dimensions,
    Appearance,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import {WebView} from 'react-native-webview';

// 是否暗黑模式，暂时不支持暗黑模式
const isDarkMode = Appearance.getColorScheme() === 'dark' && false;
console.log('isDarkMode：', isDarkMode);
// 状态栏高度
const statusBarHeight = StatusBar.currentHeight;
console.log('statusBarHeight', statusBarHeight);

// 主页面渲染
class App extends React.Component {
    webview = React.createRef();
    state = {
        appInited: false,
    };
    onWebviewLoadEnd = data => {
        console.log('loaded');
        const jsCode = `
            const rnMsg = 'hello, webview!'
            // alert(rnMsg) 
        `;
        this.webview.current.injectJavaScript(jsCode);
        // setTimeout(() => {
        //     this.handleAppInit();
        // }, 5000);
    };
    handleAppInit = () => {
        console.log(1);
        this.setState(() => ({
            appInited: true,
        }));
    };

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
                    onLoadEnd={this.onWebviewLoadEnd}
                    // originWhitelist={['https://*', 'http://*']}
                    // originWhitelist={['*', 'file://', 'https://*', 'http://*']}
                    // javaScriptEnabled={true}
                    // scalesPageToFit={false}
                    // mediaPlaybackRequiresUserAction={false}
                    // javaScriptCanOpenWindowsAutomatically={true}
                    // scrollEnabled={true}
                    // bounces={false}
                    // setBuiltInZoomControls={false}
                    // mixedContentMode="always"
                    // allowingReadAccessToURL={'file://'}
                    // allowUniversalAccessFromFileURLs={true}
                    // allowFileAccessFromFileURLS={true}
                    // allowFileAccess={true}
                    // cacheEnabled={true}
                    // cacheMode={'LOAD_DEFAULT'}
                    // allowsFullscreenVideo={true}
                    // allowsInlineMediaPlayback={true}
                    // domStorageEnabled={true}
                    // thirdPartyCookiesEnabled={true}
                    // textZoom={100}
                    // setSupportMultipleWindows={true}
                    // onShouldStartLoadWithRequest={
                    //     this.onShouldStartLoadWithRequest
                    // }
                    // onNavigationStateChange={this.onNavigationStateChange}
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
    },
});

export default App;
