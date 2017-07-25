<template>
	<div>
		<!-- 查询条件 -->
		<Form ref="form" :model="form" :label-width="90" inline>
			<Form-item label="类目名称" prop="name" style="width: 250px;">
	            <Input v-model="form.name" placeholder="请输入类目名称"></Input>
	        </Form-item>
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
			
			<Form ref="addOrEditForm" :model="addOrEditForm" :rules="addOrEditRule" :label-width="90">
				<Row>
	        		<Col span="12">
	        			<Form-item label="类目编码" prop="code">
				            <Input v-model="addOrEditForm.code" placeholder="请输入类目编码"></Input>
				        </Form-item>
	        		</Col>
	        		<Col span="12">
	        			<Form-item label="类目名称" prop="name">
				            <Input v-model="addOrEditForm.name" placeholder="请输入类目名称"></Input>
				        </Form-item>
	        		</Col>
	        	</Row>
	        	<Row>
	        		<Col span="12">
	        			<Form-item label="父类目编码" prop="rootCode">
				            <Input v-model="addOrEditForm.rootCode" placeholder="请输入父类目编码"></Input>
				        </Form-item>
	        		</Col>
	        		<Col span="12">
	        			<Form-item label="备注" prop="remark">
				            <Input v-model="addOrEditForm.remark" placeholder="请输入备注"></Input>
				        </Form-item>
	        		</Col>
	        	</Row>
	        	<Row>
	        		<Col span="12">
	        			<Form-item label="有效位" prop="deleted">
				            <Select v-model="addOrEditForm.deleted" placeholder="请输入有效位">
				            	<Option value="false">有效</Option>
				            	<Option value="true">删除</Option>
				            </Select>
				        </Form-item>
	        		</Col>
	        	</Row>
			</Form>

	    </Modal>
	</div>
</template>

<script>
import GoodsType from '../../scripts/goodstype'
import Extend from 'extend'


export default {
	data() {
		return {
			form: {
				name: '',
				deleted: ''
			},
			// 分页对象
	      	page: {
	      		total: 0,
	      		pageSize: 10,
	      		pageNo: 1
	      	},
	      	// 模态窗口对象
	      	model: {
	      		show: false,
	      		title: '新增类目',
	      		scrollable: true,
	      		width: 1200,
	      		okText: '提交',
	      		maskClosable: false,
	      		loading: true
	      	},
	      	// 新增或编辑商品表单对象
	      	addOrEditForm: {
	      		id: '',
	      		code: '',
	      		name: '',
	      		rootCode: 'root',
	      		remark: '',
	      		deleted: 'false'
	      	},
	      	addOrEditRule: {
	      		code: [
	                { required: true, message: '类目编码不能为空', trigger: 'blur' }
	            ],
	      		name: [
	                { required: true, message: '类目名称不能为空', trigger: 'blur' }
	            ],
	            rootCode: [
	                { required: true, message: '父类目编码不能为空', trigger: 'blur' }
	            ],
	            remark: [
	                { required: true, message: '备注不能为空', trigger: 'blur' }
	            ],
	            deleted: [
	                { required: true, message: '有效位不能为空', trigger: 'blur' }
	            ]
	      	},
	      	// 列表字段定义
			columns: [
				{title: '类目编码', key: 'code'},
				{title: '类目名称', key: 'name'},
				{title: '备注', key: 'remark'},
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

	created() {
		
	},

	// 模板编译/挂载后
	mounted() {
		this.search('form');
	},

	methods: {
		// 查询分页数据
		search(name){
			this.$refs[name].validate((valid) => {
				if(valid){
					GoodsType.search(Extend(this.form, this.page, {pageNo: this.page.pageNo - 1}), (res) => {
						this.page.total = res.data.totalElements
        				this.page.pageSize = res.data.size
						this.datas = res.data.content
					})
				}else{
					this.$Message.error('表单验证失败!')
				}
			})
		},
		// 分页当前页改变回调
      	pageNoChange (pageNo){
      		this.page.pageNo = pageNo
      		this.search()
      	},
      	// 每页大小变化时
      	pageSizeChange (pageSize){
      		this.page.pageNo = 1
      		this.page.pageSize = pageSize
      		this.search()
      	},
      	// 重置查询条件
      	reset (name) {
        	this.$refs[name].resetFields()
      	},
      	// 新增/编辑
      	showAddOrEditModel (id) {
      		if(typeof id == 'undefined'){
				this.model.title = '新增类目'
				this.addOrEditForm.id = ''
				this.addOrEditForm.code = ''
				this.addOrEditForm.name = ''
				this.addOrEditForm.rootCode = 'root'
				this.addOrEditForm.remark = ''
				this.addOrEditForm.deleted = 'false'
      		}else{
      			this.model.title = '编辑类目'
      			GoodsType.findById(id, (res) => {
      				this.addOrEditForm.id = res.id
					this.addOrEditForm.code = res.code
					this.addOrEditForm.name = res.name
					this.addOrEditForm.rootCode = res.rootCode
					this.addOrEditForm.remark = res.remark
					this.addOrEditForm.deleted = res.deleted + ''
      			})
      		}

      		this.model.show = true;// 显示窗口
      	},
      	ok(name){
      		this.$refs[name].validate((valid) => {
      			// 表单校验成功
		      	if(valid){
		      		GoodsType.saveOrUpdate(this.addOrEditForm, (res) => {
		      			if(res.code == '1'){
							this.$Message.success('保存成功!');
							setTimeout(() => {
				      			this.model.show = false;
				      			this.search('form');// 刷新商品列表
				      		}, 500);
		      			}else{
							this.$Message.error('保存失败!');
							this.model.show = false;
		      			}
		      		})
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

      	},
      	remove(id){
      		GoodsType.delete(id, (res) => {
      			if(res.code == '1'){
      				this.$Message.success('删除成功!');
      				this.search('form');
      			}else{
      				this.$Message.error('删除失败!');
      			}
      		})
      	}
	}
}
</script>