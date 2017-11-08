import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview';
import routes from './routes'
import Login from '../scripts/login'

// 引入路由
Vue.use(Router)

// 创建路由
const router = new Router({
  routes
})

export default router;

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    // 拦截路由跳转时是否已登录
    if(to.path != '/login'){// 登录页面不拦截
    	Login.isLogin((res) => {
        if(res.code == '0'){
          next({path: '/login'})
        }else{
          next()
        }
      })
    }else{
    	next()
    }
});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
});