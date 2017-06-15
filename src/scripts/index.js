/**
 * 首页
 */
import Vue from 'vue'
import iView from 'iview';

let index = {};

/**
 * 判断是否已登录
 */
index.getMenus = (callback) => {
	Vue.http.get('/haoback_service/menus').then((res) => {
        let data = res.data.datas;
        !!callback && callback(data);
      })
}

/**
 * 修改密码
 */
index.changePassword = (param, callback) => {
	Vue.http.post('/haoback_service/sys/user/change_password', param).then((res) => {
	    let data = res.data.datas;
        !!callback && callback(data);
	  })
}

export default index