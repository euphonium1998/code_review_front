<template>
  <div>
    <el-row>
      <el-col :span="5">
        <div>
          <el-button icon="el-icon-upload2" @click="uploadQuestion">新增题目</el-button>
        </div>
      </el-col>

      <el-col :span="5">
        <div>
          <el-button icon="el-icon-edit" @click="describeQuestion">当前题目描述</el-button>
        </div>
      </el-col>

      <el-col :span="5">
        <div>
          <el-button icon="el-icon-s-order" @click="viewQuestionList">选择题目</el-button>
        </div>
      </el-col>

      <el-col :span="4">
        <div>
          <el-button icon="el-icon-circle-check" @click="onlineJudge">提交</el-button>
        </div>
      </el-col>

      <el-col :span="5">
        <div>
          <el-button icon="el-icon-view" @click="getOJResult">查看结果</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="新题目" :visible.sync="uploadVisible">
      <el-form :label-position="labelPosition" :model="newQuestionForm" label-width="80px">

        <el-row>
          <el-col :span="16">
            <el-form-item label="题目名称">
              <el-input v-model="newQuestionForm.name"
                        maxlength="20"
                        show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="题目描述">
              <el-input v-model="newQuestionForm.questionDescription"
                        type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="输入描述">
              <el-input v-model="newQuestionForm.inputDescription"
                        type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="输出描述">
              <el-input v-model="newQuestionForm.outputDescription"
                        type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="示例输入">
              <el-input type="textarea" v-model="newQuestionForm.sampleInput"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="示例输出">
              <el-input type="textarea" v-model="newQuestionForm.sampleOutput"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-for="(example, index) in newQuestionForm.testExamples"
                      :label="'测试案例' + index"
                      :key="example.key">
          <el-row>
            <el-col :span="2">
              输入
            </el-col>
            <el-col :span="8">
              <el-input type="textarea" v-model="example.input"></el-input>
            </el-col>
            <el-col :span="2">
              输出
            </el-col>
            <el-col :span="8">
              <el-input type="textarea" v-model="example.output"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button @click.prevent="removeExample(example)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">上传</el-button>
          <el-button @click="addTestExample">新增测试案例</el-button>
          <el-button @click="uploadVisible=false">取消</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <el-dialog title="题目列表" :visible.sync="questionListVisible">

    </el-dialog>

    <el-dialog title="提交结果" :visible.sync="resVisible">

    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "OnlineJudgementFooterView",
  data() {
    return {
      uploadVisible: false,
      questionListVisible: false,
      resVisible: false,
      test: 'test hh',
      labelPosition: 'right',
      newQuestionForm: {
        name: '',
        questionDescription: '',
        inputDescription: '',
        outputDescription: '',
        sampleInput: '',
        sampleOutput: '',
        testExamples: [{
          input: '',
          output: ''
        }]
      },
      questionForm: {
        id: -1,
        name: '',
        questionDescription: '',
        inputDescription: '',
        outputDescription: '',
        sampleInput: '',
        sampleOutput: '',
      },
    }
  },
  methods: {

    uploadQuestion() {
      this.uploadVisible = true
      let info = sessionStorage.getItem('user_info')
      console.log(info);
      console.log(store.state.editorContent);
      console.log(store.state.userInfo.name);
    },

    viewQuestionList() {
      this.questionListVisible = true
    },

    onlineJudge() {

    },

    getOJResult() {
      this.resVisible = true
    },

    describeQuestion() {

    },
    onSubmit() {
      console.log(this.newQuestionForm);
      this.$confirm('是否确定上传新题目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        //todo
        /*
        submit to database
         */
        this.$message({
          type: 'success',
          message: '上传成功'
        });
        this.clearNewQuestionForm()
        this.uploadVisible =false
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        this.uploadVisible =false
      });
    },
    addTestExample() {
      this.newQuestionForm.testExamples.push({
        input: '',
        output: '',
        key: Date.now()
      })
    },
    clearNewQuestionForm() {
      this.newQuestionForm.name = ''
      this.newQuestionForm.testExamples = [{
        input: '',
        output: ''}]
      this.newQuestionForm.questionDescription = ''
      this.newQuestionForm.inputDescription = ''
      this.newQuestionForm.outputDescription = ''
      this.newQuestionForm.sampleOutput = ''
      this.newQuestionForm.sampleInput = ''
    },
    removeExample(example) {
      let index = this.newQuestionForm.testExamples.indexOf(example)
      if (index !== -1) {
        this.newQuestionForm.testExamples.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>

</style>