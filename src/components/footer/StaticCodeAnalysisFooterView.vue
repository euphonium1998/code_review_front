<template>
  <div>
    <el-row>

      <el-col :span="12">
        <div>
          <el-upload
              class="upload-demo"
              :action="fileUploadUrl"
              :limit="1"
              :on-preview="handlePreview"
              :on-success="handleSuccess"
              :before-upload="handleBeforeUpload"
              :on-error="handleError"
              list-type="picture">
            <el-tooltip effect="dark" content="目前仅支持上传.c文件" placement="top">
              <el-button @click="uploadFile">点击上传</el-button>
            </el-tooltip>
            <!--                  <div slot="tip" class="el-upload__tip">只能上传.c文件</div>-->
          </el-upload>
        </div>
      </el-col>

      <el-col :span="12">
        <div>
          <el-button icon="el-icon-reading" @click="codeReview">进行代码审查</el-button>
        </div>
      </el-col>

      <el-dialog
          class="rt-input"
          title="代码审查结果"
          :visible.sync="codeReviewDialogVisible"
          width="70%"
          :before-close="handleClose">
<!--        <div v-for="msg in codeReviewMsgList" style="text-align: left; padding-left: 10%">-->
<!--          {{msg}}-->
<!--        </div>-->
        <el-input
            id="test111"
            placeholder="代码审查结果"
            type="textarea"
            :autosize="{ minRows: 10}"
            v-model="codeReviewMsg"
            :disabled="true">
        </el-input>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="codeReviewDialogVisible = false">确 定</el-button>
              </span>
      </el-dialog>

    </el-row>
  </div>
</template>

<script>
import {BASE_URL} from "@/const";
import axios from "axios";
import store from "@/store";

export default {
  name: "StaticCodeAnalysisFooterView",
  data() {
    return {
      fileUploadUrl: BASE_URL + 'file/upload',
      codeReviewDialogVisible: false,
      codeReviewMsgList: ['正在进行代码审核，请稍等...'],
      codeReviewMsg: '',
    }
  },
  components: {

  },
  methods: {
    handlePreview(file) {
      console.log(file);

    },
    handleSuccess(response, file, fileList) {
      console.log(response);
      console.log(file);
      let editorContent = response.content
      //todo
      this.$emit('setMonacoValue', editorContent)
      // this.$refs.monaco.changeEditor(editorContent)
    },
    uploadFile() {
      // let editorContent = 'test'
      // store.commit(SET_EDITOR_CONTENT, editorContent)
      // this.$refs.monaco.changeEditor()
    },
    handleBeforeUpload(file) {
      if (file.name.slice(-2) !== '.c') {
        this.$alert('目前仅支持上传.c文件')
        return false
      }
    },
    handleError(err, file, fileList) {
      this.$alert(err)
    },
    codeReview() {
      this.$emit('getMonacoValue')
      let editorValue = store.state.editorContent
      console.log(editorValue);
      // let editorValue = this.$refs.monaco.getEditorValue()
      // console.log(editorValue);

      // 以下这段代码填入axios调用后端
      let data = {
        code: editorValue
      }
      axios.post(BASE_URL + '/file/codeReview',data)
          // axios({
          //   method: 'post',
          //   url: 'http://localhost:16666/file/codeReview',
          //   headers: {
          //     'Content-Type': 'application/json'
          //   },
          //   data: data
          // })
          .then(res => {
            console.log(res.data);
            this.codeReviewMsg = res.data
            // let strList = str.split(/\n|\r\n/g,)
            // console.log(strList)
            // this.codeReviewMsgList = strList
          })

      this.codeReviewDialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
  }
}
</script>

<style scoped>

.el-textarea.is-disabled /deep/ .el-textarea__inner {
  color: red;
}

/*#test111 /deep/ {*/
/*  color: red;*/
/*}*/
</style>