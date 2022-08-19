package com.freefire;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.zackratos.ultimatebarx.ultimatebarx.java.UltimateBarX;

import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
// import android.os.Build;
// import android.view.View;
// import android.view.Window;
// import android.view.WindowManager;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 启动屏
        SplashScreen.show(this, true);

        // 设置底部导航栏样式
        // 下面注释的影响键盘响应，android bug
        // 同样问题链接：https://www.jianshu.com/p/dc4cc4341e36 和 http://cn.voidcc.com/question/p-tfxewkni-boh.html 等等
        // 网上流传的方法 AndroidBug5497Workaround，似乎不能用
        // 总结：设置 FLAG_LAYOUT_NO_LIMITS 全屏后，adjustResize不起作用，软键盘 不能把页面撑上去，下面的input就看不到了

        // getWindow().clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        // getWindow().clearFlags(
        //     WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
        // );

        // getWindow().setFlags(
        //     WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
        //     WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
        // );

        // if (Build.VERSION.SDK_INT >= 19 && Build.VERSION.SDK_INT < 21) {
        //     WindowManager.LayoutParams winParams = getWindow().getAttributes();
        //     int bit = WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS | WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION;
        //     winParams.flags |= bit;
        //     getWindow().setAttributes(winParams);
        // }
        // if (Build.VERSION.SDK_INT >= 19) {
        //     int visibility = View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN;
        //     visibility = visibility | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        //     getWindow().getDecorView().setSystemUiVisibility(visibility);
        // }
        // if (Build.VERSION.SDK_INT >= 21) {
        //     getWindow().setNavigationBarColor(0); // 0是颜色，react-native的processColor可以将颜色转为数字
        // }
        // 因为上述备注的bug，采用一个android插件来实现底部导航栏透明且不占布局位置
        UltimateBarX.statusBar(this).fitWindow(false).colorRes(0).apply();
        UltimateBarX.navigationBar(this).fitWindow(false).light(true).colorRes(0).apply();

        // created
        super.onCreate(savedInstanceState);

        // other

    }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "freefire";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }
}
