/**
 * 商品类型
 */

import Vue from 'vue'

let goodstype = {}

// 分页查询类目
goodstype.search = (param, callback) => {
	Vue.http.get('/haoback_service/goods_type/page', {params: param}).then((res) => {
		let data = res.data.datas
        !!callback && callback(data)
	})
}

// 查询类目详情
goodstype.findById = (id, callback) => {
	Vue.http.get('/haoback_service/goods_type/details', {params: {id: id}}).then((res) => {
		let data = res.data.datas.data
        !!callback && callback(data)
	})
}

// 新增或更新类目
goodstype.saveOrUpdate = (param, callback) => {
	Vue.http.post('/haoback_service/goods_type/saveOrUpdate', param).then((res) => {
		let data = res.data.datas
        !!callback && callback(data)
	})
}

// 删除类目
goodstype.delete = (id, callback) => {
	Vue.http.post('/haoback_service/goods_type/delete', {id: id}).then((res) => {
		let data = res.data.datas
        !!callback && callback(data)
	})
}

export default goodstype