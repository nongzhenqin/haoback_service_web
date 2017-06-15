/**
 * 商品模块
 */
import Vue from 'vue'

let goods = {}

/**
 * 获取商品列表
 */
goods.findGoodsList = (params, callback) => {
	Vue.http.get('/haoback_service/goods_service/page', {params: params}).then((res) => {
	    let data = res.body.datas.data;
        !!callback && callback(data);
	})
}

export default goods