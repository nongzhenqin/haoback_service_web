<template>
	<div>
		<!-- 查询条件 -->
		<Form ref="form" :model="form" :label-width="90" inline>
	        <Form-item label="有效" prop="deleted">
	            <Select v-model="form.deleted" placeholder="请选择">
	                <Option value="false">有效</Option>
	                <Option value="true">已删除</Option>
	            </Select>
	        </Form-item>
	        <Form-item>
	            <Button type="primary" @click="search('form')" ref="searchBtn">查询</Button>
	            <Button type="ghost" @click="reset('form')" style="margin-left: 8px">重置</Button>
	        </Form-item>
		</Form>

		<Button type="primary" style="margin-bottom: 10px;" @click="showAddOrEditModel()">新增</Button>

		<!-- 表格 -->
		<Table border :columns="columns" :data="datas"></Table>

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
			
			<Form ref="addOrEditForm" :model="addOrEditForm" :rules="addOrEditRule" :label-width="90">
				<Row>
	        		<Col span="12">
	        			<Form-item label="名称" prop="name">
				            <Input v-model="addOrEditForm.name" placeholder="请输入名称"></Input>
				        </Form-item>
	        		</Col>
	        		<Col span="12">
	        			<Form-item label="商品URL" prop="urlLink">
				            <Input v-model="addOrEditForm.urlLink" placeholder="请输入商品URL"></Input>
				        </Form-item>
	        		</Col>
	        	</Row>
	        	<Row>
	        		<Col span="12">
	        			<Form-item label="优惠券URL" prop="urlLinkCoupon">
				            <Input v-model="addOrEditForm.urlLinkCoupon" placeholder="请输入优惠券URL"></Input>
				        </Form-item>
	        		</Col>
	        		<Col span="12">
	        			<Form-item label="有效位" prop="deleted">
				            <Select v-model="addOrEditForm.deleted" placeholder="请输入有效位">
				            	<Option value="false">有效</Option>
				            	<Option value="true">删除</Option>
				            </Select>
				        </Form-item>
	        		</Col>
	        	</Row>
	        	<Row>
	        		<Col span="12">
	        			<Form-item label="淘口令" prop="taoCommand">
				            <Input v-model="addOrEditForm.taoCommand" placeholder="请输入淘口令"></Input>
				        </Form-item>
	        		</Col>
	        	</Row>
	        	<Row>
	        		<Col span="12">
	        			<Form-item label="缩略图" prop="image">
	        				<img :src="addOrEditForm.image" style="width: 720px; height: 200px;" v-if="addOrEditForm.image != null && addOrEditForm.image.length > 0" @click="clickImages" />
							<Button type="dashed" v-if="addOrEditForm.image == null || addOrEditForm.image.length == 0"  style="width: 720px; height: 200px;" @click="clickImages">
				            	<Icon size="50" type="image"></Icon>
				            </Button>
				            <input type="file" ref="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="selectImages">
				        </Form-item>
	        		</Col>
	        	</Row>
			</Form>
	    </Modal>
	</div>
</template>

<script>
import GoodsCarousel from '../../scripts/goodscarousel'

export default {
	data() {
		return {
			form: {
				deleted: ''
			},
			// 模态窗口对象
	      	model: {
	      		show: false,
	      		title: '新增轮播图',
	      		scrollable: true,
	      		width: 1200,
	      		okText: '提交',
	      		maskClosable: false,
	      		loading: true
	      	},
	      	// 新增或编辑商品表单对象
	      	addOrEditForm: {
	      		id: '',
	      		name: '',
	      		urlLink: '',
	      		urlLinkCoupon: '',
	      		taoCommand: '',
	      		deleted: 'false',
	      		image: ''
	      	},
	      	// 表单校验规则
	      	addOrEditRule: {
	      		name: [
	                { required: true, message: '类目名称不能为空', trigger: 'blur' }
	            ],
	            urlLink: [
	                { required: true, message: '父类目编码不能为空', trigger: 'blur' }
	            ],
	            deleted: [
	                { required: true, message: '有效位不能为空', trigger: 'blur' }
	            ],
	            image: [
	                { required: true, message: '图片不能为空', trigger: 'blur' }
	            ],
	            taoCommand: [
	                { required: true, message: '淘口令不能为空', trigger: 'blur' }
	            ]
	      	},
			// 列表字段定义
			columns: [
				{title: '名称', key: 'name'},
				{title: '图片文件名', key: 'fileId'},
				{title: '商品URL', key: 'urlLink'},
				{title: '优惠券URL', key: 'urlLinkCoupon'},
				{title: '淘口令', key: 'taoCommand'},
				{title: '状态', key: 'deleted', 
					render: (h, params) => {
	      				return params.row.deleted ? '已删除' : '有效';
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
			                            this.showAddOrEditModel(params.row.id)
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

	// 模板编译/挂载后
	mounted() {
		this.search('form');
	},

	methods: {
		// 查询
		search(name){
			this.$refs[name].validate((valid) => {
				if(valid){
					GoodsCarousel.search(this.form, (res) => {
						this.datas = res.data
					})
				}else{
					this.$Message.error('表单验证失败!')
				}
			})
		},

		// 重置查询条件
		reset(name){
			this.$refs[name].resetFields()
		},

		ok(name){
			this.$refs[name].validate((valid) => {
	      	// 表单校验成功
	      	if(valid){
	      		GoodsCarousel.saveOrUpdate(this.addOrEditForm, (res) => {
	      			if(res.code == '1'){
	      				this.$Message.success('提交成功!');
	      				setTimeout(() => {
			      			this.model.show = false;
			      			this.search('form');// 刷新商品列表
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

		cancel(){
			this.$Message.info('点击了取消');
      	},

      	// 打开模态窗口
		showAddOrEditModel(id){
			if(typeof id == 'undefined'){
				this.model.title = '新增轮播图'
				this.addOrEditForm.id = ''
				this.addOrEditForm.name = ''
				this.addOrEditForm.urlLink = ''
				this.addOrEditForm.urlLinkCoupon = ''
				this.addOrEditForm.taoCommand = ''
				this.addOrEditForm.image = ''
				this.addOrEditForm.deleted = 'false'
      		}else{
      			this.model.title = '编辑轮播图'
   				GoodsCarousel.findById(id, (res) => {
   					this.addOrEditForm.id = res.id
					this.addOrEditForm.name = res.name
					this.addOrEditForm.urlLink = res.urlLink
					this.addOrEditForm.urlLinkCoupon = res.urlLinkCoupon
					this.addOrEditForm.taoCommand = res.taoCommand
					this.addOrEditForm.image = '/wohuitiao_service/upload/' + res.fileId + '.jpg'
					this.addOrEditForm.deleted = res.deleted + ''
   				})
      		}

      		this.model.show = true;// 显示窗口
		},
		// 点击选择图片
        clickImages () {
      	  this.$refs.uploads.click();
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
  			this.addOrEditForm.image = e.target.result
		}
		reader.readAsDataURL(file)
      },

      // 逻辑删除商品
      remove (id) {
        GoodsCarousel.delete(id, (res) => {
        	this.$Message.success('删除成功!');
        	this.search('form');// 刷新商品列表
        });
      }
	}
}
</script>