<template>
  <div class="wrapper">
    <div class="wrapper-container" style="margin:0 auto;width: 300px;margin-top: 60px;text-align: center;">
      <div class="ivu-col ivu-col-span-24">
        <div class="wrapper-content ivu-article">
          <article>
            <h1>请登录</h1>
            <Form ref="formInline" :model="formInline" :rules="ruleInline">
                <Form-item prop="userName">
                    <Input type="text" v-model="formInline.userName" placeholder="用户名">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                <Form-item prop="password">
                    <Input type="password" v-model="formInline.password" placeholder="密码">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                <Form-item>
                    <div class="ivu-form-item-error-tip">{{info.msg}}</div>
                </Form-item>
                <Form-item>
                    <Button type="primary" @click="login('formInline')">登录</Button>
                </Form-item>
            </Form>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Login from '../scripts/login'

export default {
  data () {
        return {
            formInline: {
                userName: '',
                password: ''
            },
            info: {
              msg: ''
            },
            ruleInline: {
                userName: [
                    { required: true, message: '请填写用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请填写密码', trigger: 'blur' },
                    { type: 'string', min: 3, message: '密码长度不能小于3位', trigger: 'blur' }
                ]
            }
        }
    },

    beforeCreate() {
      // 访问登录页面时，判断是否已登录，如果已登录则跳转到首页
      Login.isLogin((res) => {
        if(res.code == '1'){
          this.$router.push({path: '/index'})
        }
      });
    },

    methods: {
        login(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                      let _this = this;
                      Vue.http.post('/wohuitiao_service/j_spring_security_check', 
                                    this.formInline).then((res) => {
                        if(!res.data.code || res.data.code == '0'){
                          _this.info.msg = res.data.msg || '登录失败';
                        }else if(res.data.code == '1'){
                          _this.$router.push({path: '/index'})
                        }
                      }, () => {
                        _this.info.msg = '登录失败';
                      })
                } else {
                    this.$Message.error('验证失败!');
                }
            })
        }
    }
}
</script>