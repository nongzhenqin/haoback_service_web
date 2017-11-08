<template>
    <div class="layout">
        <Row class="top-header">
            <Col :xs="2" :sm="4" :md="6" :lg="4">
              <div class="logo">
                <img src="../assets/logo.png" style="height:35px;width:35px;" />
              </div>
            </Col>
            <!-- <Col :xs="20" :sm="16" :md="12" :lg="4"></Col> -->
            <Col :xs="2" :sm="4" :md="6" :lg="20">
              <div class="user-name">
                <Dropdown trigger="click" style="margin-right: 10px; margin-top: 8px;" placement="bottom-end">
                    <a href="javascript:void(0)" style="color: white;">
                        {{userInfo.userName}}
                        <Icon type="arrow-down-b"></Icon>
                    </a>
                    <Dropdown-menu slot="list">
                        <Dropdown-item name="userInfo">
                          <Button type="text" style="width: 100%;">个人中心</Button>
                        </Dropdown-item>
                        <Dropdown-item name="password">
                          <Button type="text" style="width: 100%;" @click="changePassword">重置密码</Button>
                        </Dropdown-item>
                        <Dropdown-item name="logout">
                          <Button type="text" style="width: 100%;" @click="logout">退出</Button>
                        </Dropdown-item>
                    </Dropdown-menu>
                </Dropdown>
              </div>
            </Col>
        </Row>
        <Row type="flex">
            <i-col span="5" class="layout-menu-left">
                <Menu active-name="1" theme="dark" width="auto" accordion @on-select="clickMenu">
                    <!-- <div class="layout-logo-left">XXX系统</div> -->
                    <template v-for="(menu, index) in menus">
                      <template v-if="!menu.children && menu.code == 'home'">
                        <Menu-item :name="menu.url" @click.native="selectMenu(menu.name)">
                          <Icon :type="menu.icon"></Icon>
                          <span class="layout-text">{{menu.name}}</span>
                        </Menu-item>
                      </template>
                      <template v-else-if="!menu.children && menu.code != 'home'">
                        <Menu-item :name="menu.url" @click.native="selectMenu(menu.name)">
                          <Icon :type="menu.icon"></Icon>
                          <span class="layout-text">{{menu.name}}</span>
                        </Menu-item>
                      </template>
                      <Submenu v-if="menu.children" :name="index+1">
                          <template slot="title">
                              <Icon :type="menu.icon"></Icon>
                              {{menu.name}}
                          </template>
                          <Menu-item v-for="(menuChild, indexChild) in menu.children" :name="menuChild.url" :key="index+'-'+indexChild" @click.native="selectMenu(menu.name + ',' + menuChild.name)">{{menuChild.name}}</Menu-item>
                      </Submenu>
                    </template>
                </Menu>
            </i-col>
            <i-col span="19">
                <!-- <div class="layout-header"></div> -->
                <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <template v-for="breadcrumb in breadcrumbs">
                          <Breadcrumb-item href="#">{{breadcrumb}}</Breadcrumb-item>
                        </template>
                        <!-- <Breadcrumb-item href="#">首页</Breadcrumb-item>
                        <Breadcrumb-item href="#">应用中心</Breadcrumb-item>
                        <Breadcrumb-item>某应用</Breadcrumb-item> -->
                    </Breadcrumb>
                </div>
                <div class="layout-content">
                    <div class="layout-content-main">
                      <router-view></router-view>
                    </div>
                </div>
                <div class="layout-copy">
                    2011-2016 &copy; TalkingData
                </div>
            </i-col>
        </Row>

        <Modal
            v-model="modal.modalChangePassword"
            title="修改密码"
            :mask-closable="false"
            :loading="modal.loading"
            @on-ok="handleSubmit('formPassword')"
            @on-cancel="cleanPassword()">
            <Form ref="formPassword" :model="formPassword" :rules="ruleValidate" :label-width="80">
              <Form-item label="旧密码" prop="oldPassword">
                  <Input type="password" v-model="formPassword.oldPassword" placeholder="请输入"></Input>
              </Form-item>
              <Form-item label="新密码" prop="newPassword">
                  <Input type="password" v-model="formPassword.newPassword" placeholder="请输入"></Input>
              </Form-item>
              <Form-item label="确认密码" prop="checkNewPassword">
                  <Input type="password" v-model="formPassword.checkNewPassword" placeholder="请输入"></Input>
              </Form-item>
            </Form>
        </Modal>

        <!-- <Alert v-if="true" type="error" show-icon>错误提示文案</Alert> -->
    </div>
</template>

<script>
import Vue from 'vue'
import Login from '../scripts/login'
import Index from '../scripts/index'

export default {
    data(){

      const validateNewPassword = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请输入密码'));
          } else {
              if (this.formPassword.checkNewPassword !== '') {
                  // 对第二个密码框单独验证
                  this.$refs.formPassword.validateField('checkNewPassword');
              }
              callback();
          }
      };

      const validateCheckNewPassword = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请再次输入密码'));
          } else if (value !== this.formPassword.newPassword) {
              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };

      return {
        breadcrumbs: ['主页'],
        routers: {
          '/index': ['主页'],
          '/index/home': ['主页'],
          '/index/user': ['系统管理', '用户管理'],
          '/index/goods': ['商品管理'],
          '/index/goodstype': ['商品类型'],
          '/index/carousel': ['轮播图管理']
        },
        modal: {
          modalChangePassword: false,
          loading: true
        },
        formPassword: {
          oldPassword: '',
          newPassword: '',
          checkNewPassword: ''
        },
        menus: [],
        userInfo: {
          userName: '',
          id: ''
        },
        ruleValidate: {
          oldPassword: [
              { required: true, message: '旧密码不能为空', trigger: 'blur' }
          ],
          newPassword: [
              { required: true, validator: validateNewPassword, trigger: 'blur' }
          ],
          checkNewPassword: [
              { required: true, validator: validateCheckNewPassword, trigger: 'blur' }
          ]
        }
      }
    },

    beforeCreate() {
      // 访问登录页面时，判断是否已登录，如果已登录则跳转到首页
      // Login.isLogin((res) => {
      //   if(res.code == '0'){
      //     this.$router.push({path: '/login'})
      //   }else{
          // 获取菜单
          Index.getMenus((data) => {
            this.userInfo.userName = data.userName;
            this.userInfo.id = data.id;
            this.menus = data.data;
          });
      //   }
      // });
    },

    created(){
      // 刷新时，防止位置信息条显示不准确
      this.breadcrumbs = this.routers[this.$router.currentRoute.path];
    },

    methods: {
      // 点击菜单时改变位置信息
      selectMenu(obj){
        this.breadcrumbs = obj.split(',');
      },
      // 登出
      logout(type){
        let _this = this;
        Vue.http.get('/wohuitiao_service/j_spring_security_logout').then(() => {
          _this.$router.push({path: '/login'})
        })
      },

      // 点击菜单路由跳转
      clickMenu(url){
        this.$router.push({path: url})
      },

      // 修改密码，弹出框
      changePassword(){
        this.modal.modalChangePassword = true;
        // this.$router.push({path: '/index/changepassword'})
      },

      // 每次关闭窗口后清除密码数据
      cleanPassword(){
        this.formPassword.oldPassword = '';
        this.formPassword.newPassword = '';
        this.formPassword.checkNewPassword = '';
      },

      // 修改密码提交
      handleSubmit (name) {
          this.modal.loading = true;
          this.$refs[name].validate((valid) => {
              if (valid) {
                  // this.$Message.success('提交成功!');
                  Index.changePassword(this.formPassword, (data) => {
                      if(data.code == '0'){
                        this.$Message.error('参数有误');
                        setTimeout(()=>{
                          this.modal.loading = false;
                          setTimeout(()=>{
                            this.modal.loading = true;
                          }, 50);
                        }, 1500);
                      }else if(data.code == '2'){
                        this.$Message.error('旧密码错误');
                        setTimeout(()=>{
                          this.modal.loading = false;
                          setTimeout(()=>{
                            this.modal.loading = true;
                          }, 50);
                        }, 1500);
                      }else if(data.code == '1'){
                        this.cleanPassword();
                        this.modal.modalChangePassword = false;
                        this.$Message.success({content:'密码修改成功，5秒后请重新登录！', duration: 5});
                        setTimeout(()=>{
                          this.$Modal.remove();
                        }, 500);
                        setTimeout(()=>{
                          this.logout();
                        }, 5000);
                        // this.modal.modalChangePassword = false;
                        // this.formPassword = {};
                        // console.log(this.$Modal);
                        // setTimeout(()=>{
                        //   this.modal.loading = false;
                        //   setTimeout(()=>{
                        //     this.$Modal.remove();
                        //   }, 500);
                        // }, 500);
                      }
                  });
              } else {
                  this.$Message.error('表单验证失败!');
                  setTimeout(()=>{
                    this.modal.loading = false;
                    setTimeout(()=>{
                      this.modal.loading = true;
                    }, 50);
                  }, 1500);
              }
          })
      }
    }
}
</script>

<style scoped>
    .layout{
        border: 0px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 85vh;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .top-header {
      height: 35px !important;
      background-color: #464c5b;
    }
    .logo {
      padding-left: 12px;
      height: 35px;
      width: 35px;
    }
    .user-name {
      color: white;
      text-align: right;
      height: 35px;
    }
</style>