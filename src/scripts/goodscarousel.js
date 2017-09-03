/**
 * 轮播图
 */

import Vue from 'vue'

let goodscarousel = {}

// 查询
goodscarousel.search = (param, callback) => {
	Vue.http.get('/haoback_service/carousel/search', {params: param}).then((res) => {
		let data = res.data.datas
        !!callback && callback(data)
	})
}

// 通过ID查找轮播图
goodscarousel.findById = (id, callback) => {
	Vue.http.get('/haoback_service/carousel/findById', {params: {id: id}}).then((res) => {
		let data = res.data.datas.data
        !!callback && callback(data)
	})
}

// 新增或更新类目
goodscarousel.saveOrUpdate = (param, callback) => {
	Vue.http.post('/haoback_service/carousel/saveOrUpdate', param).then((res) => {
		let data = res.data.datas
        !!callback && callback(data)
	})
}

// 删除类目
goodscarousel.delete = (id, callback) => {
	Vue.http.post('/haoback_service/carousel/delete', {id: id}).then((res) => {
		let data = res.data.datas
        !!callback && callback(data)
	})
}

export default goodscarousel