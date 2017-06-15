/**
 * 登录
 */
import Vue from 'vue'
import iView from 'iview';

let login = {};

/**
 * 判断是否已登录
 */
login.isLogin = (callback) => {
	Vue.http.get('/haoback_service/is_login').then((res) => {
        let data = res.data.datas;
        !!callback && callback(data);
      })
}

export default login