<template>
  <div>
    <el-container style="height: 1000px; border: 1px solid #eee" id="container">
      <el-aside width="10%" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-s-home"></i>功能</template>
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="jumpToStaticCodeAnalysis">静态代码分析</el-menu-item>
              <el-menu-item index="1-2" @click="jumpToCodeFormat">代码风格优化</el-menu-item>
              <el-menu-item index="1-3" @click="jumpToOnlineJudgement">在线判题系统</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>
          <span>代码审查系统</span>
          <el-dropdown class="dropdown" @command="handleCommand">
            <i class="el-icon-setting" style="margin-right: 20px; font-size: 16px">{{getAccountName()}}</i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              <el-dropdown-item command="modifyPassword">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dialog title="修改密码" :visible.sync="modifyPasswordVisible" width="50%" :before-close="handleClose">
            <el-form ref="form" :model="password" label-width="120px">
              <el-form-item label="输入旧密码">
                <el-input v-model="password.oldPassword" clearable show-password></el-input>
              </el-form-item>
              <el-form-item label="输入新密码">
                <el-input v-model="password.newPassword" clearable show-password></el-input>
              </el-form-item>
              <el-form-item label="再次输入新密码">
                <el-input v-model="password.newPassword2" clearable show-password></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="modifyPasswordVisible = false">取 消</el-button>
              <el-button type="primary" @click=modifyPassword>确 定</el-button>
            </span>
          </el-dialog>
        </el-header>

        <el-main>
<!--          <router-view class="main" name="main"/>-->

          <Monaco ref="monaco"></Monaco>
        </el-main>

        <el-footer>
          <router-view
              class="footer"
              name="footer"
              @getMonacoValue="getMonacoValue"
              @setMonacoValue="setMonacoValue"
          />
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import store from '@/store/index'
import Monaco from "@/components/Monaco";
import {BASE_URL} from "@/const";
import {SET_EDITOR_CONTENT} from "@/store/mutation-types";
import {SET_USER_INFO} from "../store/mutation-types";

window.onload = function() {
  document.getElementById("container").style.height = (screen.height - 250).toString() + "px";
};

export default {
  name: "Home",
  data() {

    return {
      fileUploadUrl: BASE_URL + 'file/upload',
      codeReviewDialogVisible: false,
      codeReviewMsgList: ['正在进行代码审核，请稍等...'],
      modifyPasswordVisible: false,
      password: {
        oldPassword: '',
        newPassword: '',
        newPassword2: '',
      }
    }
  },
  components: {
    Monaco
  },
  methods: {
    jumpToStaticCodeAnalysis() {
      this.$router.push('/home/static-code-analysis')
    },
    jumpToCodeFormat() {
      this.$router.push('/home/code-format')
    },
    jumpToOnlineJudgement() {
      this.$router.push('/home/online-judgement')
    },
    getMonacoValue() {
      let editorValue = this.$refs.monaco.getEditorValue()
      store.commit(SET_EDITOR_CONTENT, editorValue)
    },
    setMonacoValue(value) {
      this.$refs.monaco.changeEditor(value)
    },
    getAccountName() {
      return store.state.userInfo.name
    },
    logout() {
      this.$confirm('确定退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        sessionStorage.removeItem('user_info')
        this.$router.push('/login')
      }).catch(() => {
        //nothing to do
      })
    },
    modifyPassword() {
      // console.log('modify');
      if (this.password.oldPassword !== store.state.userInfo.password) {
        this.$notify({
          title: '警告',
          message: '输入旧密码错误',
          type: 'warning'
        });
        this.clearPassword()
      } else if (this.password.newPassword !== this.password.newPassword2) {
        this.$notify({
          title: '警告',
          message: '输入密码前后不一致',
          type: 'warning'
        });
        this.clearPassword()
      } else {
        let account = store.state.userInfo.account
        let data = {"account": account, "password": this.password.newPassword}
        axios.post(BASE_URL + 'modifyPassword', data)
          .then(res => {
            if (res.data.status === 1) {
              this.$message('数据库错误，修改密码失败')
            } else {
              sessionStorage.setItem('user_info', JSON.stringify(res.data))
              store.commit(SET_USER_INFO, res.data)
              this.$message('修改密码成功!')
            }
          })
        this.clearPassword()
        this.modifyPasswordVisible = false
      }

    },
    handleCommand(command) {
      if (command === 'logout') {
        this.logout()
      } else if (command === 'modifyPassword') {
        this.modifyPasswordVisible = true
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    clearPassword() {
      this.password.oldPassword = ''
      this.password.newPassword = ''
      this.password.newPassword2 = ''
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.dropdown {
  position: absolute;
  left: 95%
}

.el-footer {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}


</style>