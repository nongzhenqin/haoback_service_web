// 路由映射配置
const Login = r => require.ensure([], () => r(require('@/components/Login.vue')), 'login'),
	  Index = r => require.ensure([], () => r(require('@/components/Index.vue')), 'index'),
	  Home = r => require.ensure([], () => r(require('@/components/Home.vue')), 'home'),
	  User = r => require.ensure([], () => r(require('@/components/admin/User.vue')), 'user'),
	  Goods = r => require.ensure([], () => r(require('@/components/goods/Goods.vue')), 'goods'),
	  GoodsType = r => require.ensure([], () => r(require('@/components/goods/GoodsType.vue')), 'goodstype');
module.exports = [
	// 入口
	{
		path: '/',
		redirect: '/index'
	},
	//后台管理入口
	{
		path: '/index',
		component: Index,
		children: [
            { path: '', component: Home, name: '主页'},
            { path: '/index/home', component: Home, name: '主页内容'},
            { path: '/index/user', component: User, name: '用户管理'},
            { path: '/index/goods', component: Goods, name: '商品管理'},
            { path: '/index/goodstype', component: GoodsType, name: '商品类型'}
        ]
	},
	{
		name: '登录',
		path: '/login',
		component: Login,
		meta: {
	      tabIndex: "0",
	      titleCode: "0001",
	      titleName: "登录"
	    }
	}
];