<template>
<Modal
    v-model="modal.modalChangePassword"
    title="修改密码"
    :mask-closable="false"
    :loading="modal.loading"
    @on-ok="handleSubmit('formPassword')">
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
      <!-- <Form-item>
          <Button type="primary" @click="handleSubmit('formPassword')">提交</Button>
          <Button type="ghost" @click="handleReset('formPassword')" style="margin-left: 8px">重置</Button>
      </Form-item> -->
    </Form>
</Modal>
</template>

<script>
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
      	modal: {
          modalChangePassword: false,
          loading: true
        },
        formPassword: {
          oldPassword: '',
          newPassword: '',
          checkNewPassword: ''
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

    methods: {
    	changePassword(){
	        this.modal.modalChangePassword = true;
	      },

	      handleSubmit (name) {
	          this.$refs[name].validate((valid) => {
	              if (valid) {
	                  this.$Message.success('提交成功!');
	              } else {
	                  // this.$Message.error('表单验证失败!');
	                  this.modal.loading = false;
	              }
	          })
	      }
    }
}
</script>