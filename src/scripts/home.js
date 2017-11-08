/**
 * 登录
 */
import Vue from 'vue'
import iView from 'iview';

let home = {};

/**
 * 发送邮件广告
 */
home.sendAd = (params, callback) => {
	Vue.http.post('/wohuitiao_service/mail/sendAd', params).then((res) => {
        let data = res.data.datas;
        !!callback && callback(data);
      })
}

/**
 * 从淘宝联盟选品库拉取商品
 */
home.getGoods = (params, callback) => {
	Vue.http.post('/wohuitiao_service/goods_service/getGoods', params).then((res) => {
        let data = res.data.datas;
        !!callback && callback(data);
      })
}

/**
 * 下载淘宝商品图片
 */
home.downloadImage = (callback) => {
	Vue.http.get('/wohuitiao_service/goods_service/downloadImage').then((res) => {
        let data = res.data.datas;
        !!callback && callback(data);
      })
}

export default home