<template>
  <div class="login-container">
    <el-form ref="form" :model="user" label-width="40px" class="login-page">
      <h3 class="title">系统登录</h3>
      <el-form-item label="账号">
        <el-input v-model="user.account" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="user.password" clearable show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" class="login-button" type="primary" @click="onSubmit" icon="el-icon-check">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import axios from "axios";
import {SET_USER_INFO} from "@/store/mutation-types";
import store from '@/store/index'
import {BASE_URL} from "@/const";
export default {
  name: "login",
  data() {
    return {
      user: {
        account: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit() {
      // console.log('submit!');
      let data = {"account": this.user.account, "password": this.user.password}
      // console.log(data);
      axios.post(BASE_URL + 'login',data)
      .then(res => {
        console.log(res);
        if ( /*登录失败*/ res.data.status === 1) {
          console.log("账号或密码错误");
          this.user.account = ''
          this.user.password = ''
          this.$message('账号或密码错误')
        } else {
          console.log("跳转到home");
          /*
          cookie保存账号信息，由于代码未调通不使用

          let millisecond = new Date().getTime();
          let expiresTime = new Date(millisecond + 60 * 1000 * 15);
          this.$cookies.set('user_info', res.data, expiresTime)
           */
          sessionStorage.setItem('user_info', JSON.stringify(res.data))
          console.log(sessionStorage.getItem('user_info'));
          store.commit(SET_USER_INFO, res.data)
          this.$message('登录成功')
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login-button {
  margin: auto;
  position: fixed;
  left: 45%;
}
</style>