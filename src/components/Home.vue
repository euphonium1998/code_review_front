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
          <el-dropdown class="dropdown">
            <i class="el-icon-setting" style="margin-right: 20px; font-size: 16px">管理</i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出登录</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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