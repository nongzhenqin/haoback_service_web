<template>
    <div>
    	<Row>
	        <Col span="24">欢迎使用优利管理平台系统</Col>
	    </Row>
      <Row>
        <Button type="primary" style="margin-bottom: 10px;" @click="downloadImage()">下载淘宝商品图片</Button>
        <Col span="24">
          <Form ref="adForm" :model="adForm" :label-width="80" inline>
            <Form-item label="发送数量" prop="type" style="width: 260px;">
              <Input v-model="adForm.sendTotal" placeholder="请输入发送数量，必填"></Input>
            </Form-item>
          </Form>
          <Button type="primary" style="margin-bottom: 10px;" @click="sendAd()">发送营销邮件</Button>
          <br/>
          <Form ref="form" :model="form" :label-width="80" inline>
            <Form-item label="商品类目" prop="type" style="width: 260px;">
              <Input v-model="form.type" placeholder="请输入商品类目，必填"></Input>
            </Form-item>
            <Form-item label="操作类型" prop="operate" style="width: 260px;">
              <Select v-model="form.operate" placeholder="请选择">
                  <Option value="all">所有</Option>
                  <Option value="equals">等于</Option>
                  <Option value="like">模糊</Option>
              </Select>
            </Form-item>
          </Form>
          <Button type="primary" style="margin-bottom: 10px;" @click="getGoods()">从淘宝联盟选品库拉取所有商品</Button>
        </Col>
      </Row>
    </div>
</template>

<script>
import Vue from 'vue'
import Home from '../scripts/home'

export default {
    data() {
      return {
        adForm: {
          sendTotal: 100
        },
      	form: {
          type: '',
          operate: ''
        }
      }
    },

    methods: {
      downloadImage(){
        Home.downloadImage((res) => {
          this.$Notice.info({
              title: '下载淘宝商品图片',
              desc: res.msg,
              duration: 0
          });
        });
      },
      // 发送广告
      sendAd(){
        if(this.adForm.sendTotal == '' || this.adForm.sendTotal <= 0){
          this.$Message.error('请填写发送数量!')
          return
        }

        Home.sendAd(this.adForm, (res) => {
          this.$Notice.info({
              title: '营销邮件发送结果！',
              desc: res.msg,
              duration: 0
          });
        });
      },

      // 拉取商品
      getGoods(){
        if(this.form.type == '' || this.form.operate == ''){
          this.$Message.error('表单验证失败!')
          return
        }

        if(this.form.type.indexOf(',') > -1 && this.form.operate != 'equals'){
          this.$Message.error('多个选品库时操作类型必须为等于!')
          return
        }

        // 如果是多个选品库时没有以,结尾，则自动加上,
        if(this.form.type.indexOf(',') > -1){
          if(this.form.type.slice(-','.length) != ','){
            this.form.type += ','
          }
        }
        
        Home.getGoods(this.form, (res) => {
          this.$Notice.info({
              title: res.code == '1' ? '从淘宝联盟选品库拉取商品成功！！！' : '从淘宝联盟选品库拉取商品失败！！！',
              desc: res.msg,
              duration: 0
          });
        })
      }
    }
}

</script>

<style scoped>
    
</style>