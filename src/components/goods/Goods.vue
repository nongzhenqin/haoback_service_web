<template>
	<div>
		<!-- 查询条件 -->
		<Form ref="form" :model="form" :label-width="80" inline>
			<Form-item label="商品名称" prop="name" style="width: 200px;">
	            <Input v-model="form.name" placeholder="请输入商品名称"></Input>
	        </Form-item>
	        <Form-item label="添加日期">
	            <Row>
	                <Col span="11">
	                    <Form-item prop="beginDate">
	                        <Date-picker type="date" placeholder="开始日期" v-model="form.beginDate"></Date-picker>
	                    </Form-item>
	                </Col>
	                <Col span="2" style="text-align: center">-</Col>
	                <Col span="11">
	                    <Form-item prop="endDate">
	                        <Date-picker type="date" placeholder="结束日期" v-model="form.endDate"></Date-picker>
	                    </Form-item>
	                </Col>
	            </Row>
	        </Form-item>
	        <Form-item label="有效" prop="validind">
	            <Select v-model="form.validind" placeholder="请选择">
	                <Option value="0">是</Option>
	                <Option value="1">否</Option>
	            </Select>
	        </Form-item>
	        <Form-item>
	            <Button type="primary" @click="handleSubmit('form')" ref="searchBtn">查询</Button>
	            <Button type="ghost" @click="handleReset('form')" style="margin-left: 8px">重置</Button>
	        </Form-item>
		</Form>
		<Button type="primary" style="margin-bottom: 10px;" @click="showAddOrEditGoodsModel()">新增</Button>
		<!-- 表格 -->
		<Table border :columns="columns" :data="datas"></Table>
		<!-- 分页 -->
		<Page :total="page.total" :current="page.pageNo" :page-size="page.pageSize" show-sizer show-elevator show-total style="float: right; padding-top: 10px;" @on-change="pageNoChange" @on-page-size-change="pageSizeChange"></Page>

		<!-- 新增或编辑模态窗口 -->
		<Modal
	        v-model="model.show"
	        :title="model.title"
	        :width="model.width"
	        :ok-text="model.okText"
	        :scrollable="model.scrollable"
	        :mask-closable="model.maskClosable"
	        :loading="model.loading"
	        @on-ok="ok('addOrEditForm')"
	        @on-cancel="cancel">
	        <Form ref="addOrEditForm" :model="addOrEditForm" :rules="addOrEditRule" :label-width="80">
	        	<Row>
	        		<Col span="12">
	        			<Form-item label="商品名称" prop="name">
				            <Input v-model="addOrEditForm.name" placeholder="请输入商品名称"></Input>
				        </Form-item>
	        		</Col>
	        		<Col span="12">
	        			<Form-item label="简介" prop="info">
				            <Input v-model="addOrEditForm.info" placeholder="请输入简介"></Input>
				        </Form-item>
	        		</Col>
	        	</Row>

	        	<Row>
	        		<Col span="12">
	        			<Form-item label="品牌" prop="brand">
				            <Input v-model="addOrEditForm.brand" placeholder="请输入品牌"></Input>
				        </Form-item>
	        		</Col>
	        		<Col span="12">
	        			<Form-item label="型号" prop="models">
				            <Input v-model="addOrEditForm.models" placeholder="请输入型号"></Input>
				        </Form-item>
	        		</Col>
	        	</Row>

	        	<Row>
	        		<Col span="12">
	        			<Form-item label="价格(元)" prop="price">
				            <Input v-model="addOrEditForm.price" placeholder="请输入价格(元)"></Input>
				        </Form-item>
	        		</Col>
	        		<Col span="12">
				        <Form-item label="类目" prop="goodsTypeId">
				            <Select v-model="addOrEditForm.goodsTypeId" placeholder="请输入类目">
				            	<template v-for="goodsType in model.goodsTypeSelect">
				            		<Option :value="goodsType.id">{{goodsType.name}}</Option>
				            	</template>
				            </Select>
				        </Form-item>
	        		</Col>
	        	</Row>

	        	<Row>
	        		<Col span="12">
	        			<Form-item label="销量" prop="salesNum">
				            <Input v-model="addOrEditForm.salesNum" placeholder="请输入销量"></Input>
				        </Form-item>
	        		</Col>
	        		<Col span="12">
	        			<Form-item label="状态" prop="status">
				            <Select v-model="addOrEditForm.status" placeholder="请输入状态">
				            	<Option value="1">上架</Option>
				            	<Option value="0">下架</Option>
				            </Select>
				        </Form-item>
	        		</Col>
	        	</Row>

	        	<Row>
	        		<Col span="12">
	        			<Form-item label="排序权重" prop="sort">
				            <Input v-model="addOrEditForm.sort" placeholder="请输入排序权重，从0开始，数值越大越靠前，如果权重值一致则按ID从小到大排序"></Input>
				        </Form-item>
	        		</Col>
	        		<Col span="12">
		        		<Form-item label="有效" prop="deleted">
				            <Select v-model="addOrEditForm.deleted" placeholder="请输入">
				            	<Option value="false">有效</Option>
				            	<Option value="true">无效</Option>
				            </Select>
				        </Form-item>
			        </Col>
	        	</Row>

	        	<Row>
	        		<Col span="12">
	        			<Form-item label="商品URL" prop="urlLink">
				            <Input v-model="addOrEditForm.urlLink" placeholder="请输入淘宝URL"></Input>
				        </Form-item>
	        		</Col>
	        		<Col span="12">
	        			<Form-item label="优惠券URL" prop="urlLinkCoupon">
				            <Input v-model="addOrEditForm.urlLinkCoupon" placeholder="请输入优惠券URL，当同时存在商品URL和优惠券URL时，默认用优惠券URL打开"></Input>
				        </Form-item>
	        		</Col>
	        	</Row>

	        	<Row>
	        		<Col span="12">
	        			<Form-item label="天猫商家" prop="isTmall">
				            <Select v-model="addOrEditForm.isTmall" placeholder="请选择">
				            	<Option value="0">否</Option>
				            	<Option value="1">是</Option>
				            </Select>
				        </Form-item>
	        		</Col>
	        	</Row>

	        	<Row>
	        		<Col span="12">
	        			<Form-item label="缩略图" prop="image">
	        				<img :src="addOrEditForm.image" style="width: 218px; height: 218px;" v-if="addOrEditForm.image != null && addOrEditForm.image.length > 0" @click="clickImages" />
							<Button type="dashed" v-if="addOrEditForm.image == null || addOrEditForm.image.length == 0"  style="width: 218px; height: 218px;" @click="clickImages">
				            	<Icon size="50" type="image"></Icon>
				            </Button>
				            <input type="file" ref="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="selectImages">
				        </Form-item>
	        		</Col>
	        		<Col span="12">
	        			<Form-item label="裁剪图片">
		        			<vueCropper
		        			  style="height: 505px;width: 505px;"
							  ref="cropper"
							  :img="cropper.img"
							  :canScale="cropper.canScale"
							  :autoCrop="cropper.autoCrop"
							  :autoCropWidth="cropper.autoCropWidth"
							  :autoCropHeight="cropper.autoCropHeight"
							  :outputSize="cropper.outputSize"
							  :outputType="cropper.outputType">
							  </vueCropper>
							  <Button type="info" style="margin-top: 10px;" @click="getImages('base64')">拾取图片</Button>
						  </Form-item>
	        		</Col>
	        	</Row>
	        </Form>
	    </Modal>
    </div>
</template>

<script>
import goods from '../../scripts/goods'
import dateUtils from '../../scripts/common/date'
import vueCropper from 'vue-cropper';	// 图片插件

export default {
    data() {
      const validatePrice = (rule, value, callback) => {
      	if(!value){
      		callback(new Error('价格不能为空'));
      	}

      	let temp = Number(value);
      	if(!temp){
      		callback(new Error('请输入数字'));
      	}

      	if(temp <= 0){
      		callback(new Error('请输入大于0的数字'));
      	}

      	let subNum = value.split('.');
      	if(subNum.length == 2 && subNum[1].length > 2){
      		callback(new Error('仅能保留两位小数'));
      	}

      	callback();
      };

      return {
      	// 图片裁剪插件对象
      	cropper: {
      		isUse: false,// 是否使用此插件，因为此插件截取后图片变模糊，所有设置开关
      		img: '',
      		outputSize: 1,
      		outputType: 'jpeg',
      		canScale: true,
      		autoCrop: true,
      		// 只有自动截图开启 宽度高度才生效
			autoCropWidth: 218,
			autoCropHeight: 218
      	},
      	// 模态窗口对象
      	model: {
      		show: false,
      		title: '新增商品',
      		scrollable: true,
      		width: 1200,
      		okText: '提交',
      		maskClosable: false,
      		loading: true,
      		goodsTypeSelect: []
      	},
      	// 新增或编辑商品表单对象
      	addOrEditForm: {
      		id: '',
      		name: '',
      		info: '',
      		brand: '',
      		models: '',
      		price: '',
      		goodsTypeId: '',
      		salesNum: '',
      		status: '1',
      		sort: '',
      		deleted: '',
      		image: '',
      		urlLink: '',
      		urlLinkCoupon: '',
      		isTmall: ''
      	},
      	addOrEditRule: {
      		name: [
                { required: true, message: '商品名称不能为空', trigger: 'blur' }
            ],
            // info: [
            //     { required: true, message: '简介不能为空', trigger: 'blur' }
            // ],
            // brand: [
            //     { required: true, message: '品牌不能为空', trigger: 'blur' }
            // ],
            // models: [
            //     { required: true, message: '型号不能为空', trigger: 'blur' }
            // ],
            price: [
                { required: true, message: '价格不能为空', trigger: 'blur' },
                { validator: validatePrice, trigger: 'blur' }
            ],
            goodsTypeId: [
                { required: true, message: '类目不能为空', trigger: 'change' }
            ],
            salesNum: [
                { required: true, message: '销量不能为空', trigger: 'blur' }
            ],
            status: [
                { required: true, message: '状态不能为空', trigger: 'change' }
            ],
            sort: [
                { required: true, message: '排序权重不能为空', trigger: 'blur' }
            ],
            deleted: [
                { required: true, message: '有效状态不能为空', trigger: 'blur' }
            ],
            urlLink: [
                { required: true, message: 'URL不能为空', trigger: 'blur' }
            ]
      	},
      	// 查询条件对象
      	form: {
      		name: '',
      		beginDate: '',
      		endDate: '',
      		validind: '0'
      	},
      	// 分页对象
      	page: {
      		total: 0,
      		pageSize: 10,
      		pageNo: 1
      	},
      	// 列定义对象
      	columns: [
      		{title: '商品名称', key: 'name'},
      		{title: '品牌', key: 'brand'},
      		{title: '简介', key: 'info'},
      		{title: '型号', key: 'models', width: 100},
      		{title: '价格', key: 'price', width: 70},
      		{title: '销量', key: 'salesNum', width: 70},
      		{title: '状态', key: 'status',
      			width: 70,
      			render: (h, params) => {
      				return params.row.status == '1' ? '上架' : '下架';
      			}
      		},
      		{title: '添加时间', key: 'addTime',
      			render: (h, params) => {
      				return dateUtils.formatDate(params.row.addTime, 'yyyy-MM-dd hh:mm:ss');
      			}
      		},
      		{
		        title: '操作',
		        key: 'action',
		        width: 150,
		        align: 'center',
		        render: (h, params) => {
		            return h('div', [
		                h('Button', {
		                    props: {
		                        type: 'primary',
		                        size: 'small'
		                    },
		                    style: {
		                        marginRight: '5px'
		                    },
		                    on: {
		                        click: () => {
		                            this.showAddOrEditGoodsModel(params.row.id)
		                        }
		                    }
		                }, '编辑'),
		                h('Button', {
		                    props: {
		                        type: 'error',
		                        size: 'small'
		                    },
		                    on: {
		                        click: () => {
		                            this.remove(params.row.id)
		                        }
		                    }
		                }, '删除')
		            ]);
		        }
		    }
      	],
      	// 列表数据对象
      	datas: []
      }
    },

    created(){
    	// this.handleSubmit('form');

    	// 初始化新增/编辑商品弹窗中的类目
    	goods.findGoodsType((res) => {
    		let select = [];
    		for(let i=0,len=res.length; i<len; i++){
    			let data = {};
    			data.id = res[i].id + '';
    			data.name = res[i].name;
    			select.push(data);
    		}
    		this.model.goodsTypeSelect = select;
    	});
    },

    // 模板编译/挂载后
    mounted() {
    	this.handleSubmit('form');
    },

    methods: {
      // 逻辑删除商品
      remove (goodsId) {
        goods.delete(goodsId, (res) => {
        	this.$Message.success('删除成功!');
        	this.handleSubmit('form');// 刷新商品列表
        });
      },
      // 拾取图片
      getImages (type) {
      	// 输出
		if (type === 'blob') {
			this.$refs.cropper.getCropBlob((data) => {
				this.addOrEditForm.image = data;
			})
		} else {
			this.$refs.cropper.getCropDate((data) => {
				this.addOrEditForm.image = data;
			})
		}
      },
      // 选择图片
      selectImages (e) {
		var file = e.target.files[0]
		if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
			 this.$Message.error('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
			 return false
		 }
		var reader = new FileReader()
		reader.onload = (e) => {
			if(this.cropper.isUse){
      			this.cropper.img = e.target.result
      		}else{
      			this.addOrEditForm.image = e.target.result
      		}
		}
		reader.readAsDataURL(file)
      },
      // 点击选择图片
      clickImages () {
      	this.$refs.uploads.click();
      },
      // 查询动作
      search (params){
      	goods.findGoodsList(params, (res) => {
        	this.page.total = res.totalElements
        	this.page.pageSize = res.size
        	this.datas = res.content;
        });
      },
      // 分页当前页改变回调
      pageNoChange (pageNo){
      	this.page.pageNo = pageNo;
      	this.search({pageNo: pageNo, pageSize: this.page.pageSize, name: this.form.name, beginDate: dateUtils.formatDate(this.form.beginDate, 'yyyy-MM-dd'), endDate: dateUtils.formatDate(this.form.endDate, 'yyyy-MM-dd'), validind: this.form.validind});
      },
      // 每页大小变化时
      pageSizeChange (pageSize){
      	this.page.pageNo = 1;
      	this.page.pageSize = pageSize
      	this.search({pageNo: this.page.pageNo, pageSize: pageSize, name: this.form.name, beginDate: dateUtils.formatDate(this.form.beginDate, 'yyyy-MM-dd'), endDate: dateUtils.formatDate(this.form.endDate, 'yyyy-MM-dd'), validind: this.form.validind});
      },
      // 查询提交
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
            	this.datas = [];
                // this.$Message.success('提交成功!');
                this.search({pageNo: this.page.pageNo, pageSize: this.page.pageSize, name: this.form.name, beginDate: dateUtils.formatDate(this.form.beginDate, 'yyyy-MM-dd'), endDate: dateUtils.formatDate(this.form.endDate, 'yyyy-MM-dd'), validind: this.form.validind});
            } else {
                this.$Message.error('表单验证失败!');
            }
        })
      },
      // 重置查询条件
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      // 新增/编辑商品
      showAddOrEditGoodsModel (goodsId) {
      	if(typeof goodsId == 'undefined'){
      		this.model.title = '新增商品'
      		this.addOrEditForm.id = '';
      		this.addOrEditForm.name = '';
			this.addOrEditForm.info = '';
	      	this.addOrEditForm.brand = '';
	      	this.addOrEditForm.models = '';
	      	this.addOrEditForm.price = '';
	      	this.addOrEditForm.goodsTypeId = '';
	      	this.addOrEditForm.salesNum = '';
	      	this.addOrEditForm.status = '1';
	      	this.addOrEditForm.sort = '';
	      	this.addOrEditForm.deleted = 'false';
	      	this.addOrEditForm.image = '';
	      	this.addOrEditForm.urlLink = '';
	      	this.addOrEditForm.urlLinkCoupon = '';
	      	this.addOrEditForm.isTmall = '0';
	      	this.cropper.img = '';

	      	this.model.show = true;// 显示窗口
      	}else{
      		this.model.title = '编辑商品'
      		goods.findById(goodsId, (res) => {
      			console.log(res)
      			this.addOrEditForm.id = res.id;
	      		this.addOrEditForm.name = res.name;
				this.addOrEditForm.info = res.info;
		      	this.addOrEditForm.brand = res.brand;
		      	this.addOrEditForm.models = res.models;
		      	this.addOrEditForm.price = res.price + '';
		      	this.addOrEditForm.goodsTypeId = res.goodsTypeId + '';
		      	this.addOrEditForm.salesNum = res.salesNum + '';
		      	this.addOrEditForm.status = res.status;
		      	this.addOrEditForm.sort = res.sort + '';
		      	this.addOrEditForm.deleted = res.deleted + '';
		      	this.addOrEditForm.urlLink = res.urlLink;
		      	this.addOrEditForm.urlLinkCoupon = res.urlLinkCoupon;
	      		this.addOrEditForm.isTmall = res.isTmall ? '1' : '0';
		      	this.addOrEditForm.image = '/haoback_service/upload/' + res.fileId + '.jpg';

		      	this.model.show = true;// 显示窗口
      		});
      	}
      },
      ok (name) {
	      this.$refs[name].validate((valid) => {
	      	// 表单校验成功
	      	if(valid){
	      		goods.save(this.addOrEditForm, (res) => {
	      			if(res.code == '1'){
	      				this.$Message.success('提交成功!');
	      				setTimeout(() => {
			      			this.model.show = false;
			      			this.handleSubmit('form');// 刷新商品列表
			      		}, 500);
	      			}
	      		});
	      	}else{
	      		this.$Message.error('表单验证失败!');
	      		this.model.loading = false;
	      		setTimeout(() => {
	      			this.model.loading = true;
	      		}, 50);
	      	}
	      })
	  },
	  cancel () {
	      this.$Message.info('点击了取消');
	  }
    },
    components: {
    	vueCropper
    }
}

</script>

<style scoped>
    
</style>