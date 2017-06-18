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

/**
 * 获取商品分类
 */
goods.findGoodsType = (callback) => {
	Vue.http.get('/haoback_service/goods/goods_type').then((res) => {
	    let data = res.body.datas.data;
        !!callback && callback(data);
	})
}

/**
 * 保存商品信息
 */
goods.save = (params, callback) => {
	Vue.http.post('/haoback_service/goods_service/save', params).then((res) => {
	    let data = res.body.datas;
        !!callback && callback(data);
	})
}

/**
 * 通过id查询商品信息
 */
goods.findById = (goodsId, callback) => {
	Vue.http.get('/haoback_service/goods_service/details/' + goodsId).then((res) => {
	    let data = res.body.datas.data;
        !!callback && callback(data);
	})
}

/**
 * 通过id删除商品
 */
goods.delete = (goodsId, callback) => {
	Vue.http.post('/haoback_service/goods_service/delete', {goodsId: goodsId}).then((res) => {
	    let data = res.body.datas;
        !!callback && callback(data);
	})
}

export default goods