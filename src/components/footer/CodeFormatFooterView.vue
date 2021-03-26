<template>
  <div>
    <el-row>

      <el-col :span="8">
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

      <el-col :span="8">
        <div>
          <el-button icon="el-icon-s-check" @click="codeFormat">代码风格优化</el-button>
        </div>
      </el-col>

      <el-col :span="8">
        <div>
          <el-button icon="el-icon-download" @click="codeDownload" :disabled="downloadButtonDisabled">下载代码</el-button>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import {BASE_URL, C_COMPILE_ERROR, SUCCESS} from "@/const";
import axios from "axios";
import store from "@/store";

export default {
  name: "CodeFormatFooterView",
  data() {
    return {
      fileUploadUrl: BASE_URL + 'file/upload',
      downloadButtonDisabled: true
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
    codeFormat() {
      this.$emit('getMonacoValue')
      let editorValue = store.state.editorContent

      // 以下这段代码填入axios调用后端
      let data = {
        code: editorValue
      }
      axios.post(BASE_URL + '/file/codeFormat',data)
          .then(res => {
            console.log(res.data);
            if (res.data.status === C_COMPILE_ERROR) {
              this.$alert('请上传可编译通过代码')
            } else if(res.data.status === SUCCESS) {
              this.downloadButtonDisabled = false
              this.$notify({
                title: '成功',
                message: '代码已完成优化，可点击下载优化后代码',
                type: 'success'
              });
              this.$emit('setMonacoValue', res.data.code)
            } else {
              this.$alert('error status!')
            }
          })
    },
    codeDownload() {
      window.location = BASE_URL + "file/download"
    },
  }
}
</script>

<style scoped>

</style>