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
	            <Button type="primary" @click="handleSubmit('form')">查询</Button>
	            <Button type="ghost" @click="handleReset('form')" style="margin-left: 8px">重置</Button>
	        </Form-item>
		</Form>
		<!-- 表格 -->
		<Table border :columns="pageDatas" :data="data6"></Table>
		<!-- 分页 -->
		<Page :total="100" show-sizer show-elevator show-total style="float: right; padding-top: 10px;"></Page>
    </div>
</template>

<script>
import goods from '../../scripts/goods'

export default {
    data() {
      return {
      	form: {
      		name: '',
      		beginDate: '',
      		endDate: '',
      		validind: ''
      	},
      	page: {

      	},
      	pageDatas: [
                    {
                        title: '姓名',
                        key: 'name',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.name)
                            ]);
                        }
                    },
                    {
                        title: '年龄',
                        key: 'age'
                    },
                    {
                        title: '地址',
                        key: 'address'
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data6: [
                    {
                        name: '王小明',
                        age: 18,
                        address: '北京市朝阳区芍药居'
                    },
                    {
                        name: '张小刚',
                        age: 25,
                        address: '北京市海淀区西二旗'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道'
                    }
                ]
      }
    },

    methods: {
      show (index) {
        this.$Modal.info({
            title: '用户信息',
            content: `姓名：${this.data6[index].name}<br>年龄：${this.data6[index].age}<br>地址：${this.data6[index].address}`
        })
      },
      remove (index) {
        this.data6.splice(index, 1);
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.$Message.success('提交成功!');
                goods.findGoodsList({pageNo: 0, pageSize: 1, name: this.form.name}, (res) => {
                	console.log(res)
                });
            } else {
                this.$Message.error('表单验证失败!');
            }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      }
    }
}

</script>

<style scoped>
    
</style>