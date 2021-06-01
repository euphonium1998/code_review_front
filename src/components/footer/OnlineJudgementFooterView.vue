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

    <!--    upload dialog-->
    <el-dialog title="新题目"  :visible.sync="uploadVisible">
      <el-form :label-position="labelPosition"
               :model="newQuestionForm"
               :rules="newFormRules"
               ref="newQuestionForm"
               label-width="80px">

        <el-row>
          <el-col :span="16">
            <el-form-item label="题目名称" prop="name">
              <el-input v-model="newQuestionForm.name"
                        maxlength="20"
                        show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="题目描述" prop="questionDescription">
              <el-input v-model="newQuestionForm.questionDescription"
                        type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="输入描述" prop="inputDescription">
              <el-input v-model="newQuestionForm.inputDescription"
                        type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="输出描述" prop="outputDescription">
              <el-input v-model="newQuestionForm.outputDescription"
                        type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="示例输入" prop="sampleInput">
              <el-input type="textarea" v-model="newQuestionForm.sampleInput"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="示例输出" prop="sampleOutput">
              <el-input type="textarea" v-model="newQuestionForm.sampleOutput"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-for="(example, index) in newQuestionForm.samples"
                      :label="'测试案例' + index"
                      :key="index">
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
          <el-button type="primary" @click="insertOneQuestion('newQuestionForm')">上传</el-button>
          <el-button @click="addTestExample">新增测试案例</el-button>
          <el-button @click="uploadVisible=false">取消</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <!--description of this question    -->
    <el-dialog title="当前题目描述" :visible.sync="descriptionVisible">
      <el-form label-position="right" :model="questionForm" label-width="80px">

        <el-form-item label="作者">
          <el-row>
            <el-col :span="12">
              <el-input disabled v-model="questionForm.provider"></el-input>
            </el-col>

          </el-row>
        </el-form-item>

        <el-row>
          <el-col :span="16">
            <el-form-item label="题目名称">
              <el-input v-model="questionForm.name"
                        disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="题目描述">
              <el-input v-model="questionForm.questionDescription"
                        type="textarea"
                        disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="输入描述">
              <el-input v-model="questionForm.inputDescription"
                        type="textarea"
                        disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="输出描述">
              <el-input v-model="questionForm.outputDescription"
                        type="textarea"
                        disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="示例输入">
              <el-input type="textarea" v-model="questionForm.sampleInput"
                        disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="示例输出">
              <el-input type="textarea" v-model="questionForm.sampleOutput"
                        disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button @click="descriptionVisible=false" type="primary">关闭</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <!--    question list dialog -->
    <el-dialog title="题目列表" :visible.sync="questionListVisible">
      <el-form :model="questionList">
        <el-form-item>
          <el-row>
            <el-col :span="4">
              序号
            </el-col>
            <el-col :span="16">
              题目名称
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item v-for="(question, index) in questionList.questions"
                      :key="index">
          <el-row>
            <el-col :span="4">
              {{question.id}}
            </el-col>
            <el-col :span="16">
              {{question.name}}
            </el-col>
            <el-col :span="4">
              <el-button @click.prevent="chooseQuestionId(question)">选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>
          <el-button type="primary" @click="getQuestionList">刷新题目列表</el-button>
        <el-form-item>
          <el-col>

          </el-col>
        </el-form-item>

      </el-form>
    </el-dialog>

    <!--   result -->
    <el-dialog title="提交结果" :visible.sync="resVisible">
      <el-form :model="onlineJudgeRes" :v-loading="onlineJudgeRes.isLoading">
        <el-form-item>
          <el-row>
            <el-col :span="16" style="font-size: 17px; text-align:left">
              题目名称： {{onlineJudgeRes.name}}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row style="font-size: 17px; text-align:left">
            <el-col :span="8">
              时间： {{onlineJudgeRes.runtime}}ms
            </el-col>
            <el-col :span="8">
              内存： {{onlineJudgeRes.memoryUsage}}MB
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="24">
              <el-input class="to-red" type="textarea" disabled v-model="onlineJudgeRes.compileMsg"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-show="!onlineJudgeRes.isCompileErr && !onlineJudgeRes.isPass">
          <el-row>
            <el-col :span="2">
              输入
            </el-col>
            <el-col :span="6">
              <el-input class="to-red" type="textarea" disabled v-model="onlineJudgeRes.input"
                        style="color: red"></el-input>
            </el-col>
            <el-col :span="2">
              预期输出
            </el-col>
            <el-col :span="6">
              <el-input class="to-red" type="textarea" disabled v-model="onlineJudgeRes.predictedOutput"></el-input>
            </el-col>
            <el-col :span="2">
              实际输出
            </el-col>
            <el-col :span="6">
              <el-input class="to-red" type="textarea" disabled v-model="onlineJudgeRes.realOutput"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store/index";
import axios from "axios";
import {BASE_URL, SQL_ERROR, SUCCESS} from "@/const";

export default {
  name: "OnlineJudgementFooterView",
  data() {
    return {
      newQuestionFormValidator: true,
      uploadVisible: false,
      questionListVisible: false,
      resVisible: false,
      descriptionVisible: false,
      test: 'test hh',
      labelPosition: 'right',
      newQuestionForm: {
        name: '',
        account: '',
        questionDescription: '',
        inputDescription: '',
        outputDescription: '',
        sampleInput: '',
        sampleOutput: '',
        samples: [{
          input: '',
          output: ''
        }]
      },
      questionForm: {
        id: -1,
        provider: 'Euphonium',
        name: 'hello',
        questionDescription: 'print hello world',
        inputDescription: 'bilibili',
        outputDescription: 'acfun',
        sampleInput: '1 2 3',
        sampleOutput: '4 5 6',
      },
      questionList: {
        questions: []
      },
      onlineJudgeRes: {
        id: -1,
        name: '',
        isPass: false,
        isLoading: false,
        isCompileErr: false,
        memoryUsage: 'N/A',
        runtime: 'N/A',
        input: '',
        predictedOutput: '',
        realOutput: '',
        compileMsg: '',
      },
      newFormRules: {
        name: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
        ],
        questionDescription: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
        ],
        inputDescription: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
        ],
        outputDescription: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
        ],
        sampleInput: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
        ],
        sampleOutput: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
        ],
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
      this.$emit('getMonacoValue')
      let editorValue = store.state.editorContent
      let data = {
        qid: this.questionForm.id,
        code: editorValue
      }
      this.onlineJudgeRes.isLoading = true
      axios.post(BASE_URL + '/question/oj', data)
          .then(res => {
            this.onlineJudgeRes.isLoading = false
            console.log(res.data)
            this.onlineJudgeRes.name = res.data.name
            this.onlineJudgeRes.compileMsg = res.data.status
            if (res.data.status === 'wrong output') {
              this.onlineJudgeRes.isPass = false
              this.onlineJudgeRes.isCompileErr = false
              this.onlineJudgeRes.input = res.data.input
              this.onlineJudgeRes.realOutput = res.data.realOutput
              this.onlineJudgeRes.predictedOutput = res.data.expectedOutput
              this.onlineJudgeRes.runtime = 'N/A'
              this.onlineJudgeRes.memoryUsage = 'N/A'
            } else if (res.data.status === 'Accepted') {
              this.onlineJudgeRes.isPass = true
              this.onlineJudgeRes.isCompileErr = false
              this.onlineJudgeRes.runtime = (res.data.runTime / 1000000).toFixed(2)
              this.onlineJudgeRes.memoryUsage = (res.data.memory / (1024 * 1024 * 8)).toFixed(2)
            } else {
              this.onlineJudgeRes.isPass = false
              this.onlineJudgeRes.isCompileErr = true
              this.onlineJudgeRes.runtime = 'N/A'
              this.onlineJudgeRes.memoryUsage = 'N/A'
            }
            this.OJFinishedNotify()
          }).catch(err => {
            this.$alert(err)
      })
    },

    getOJResult() {
      this.resVisible = true
    },

    describeQuestion() {
      this.descriptionVisible = true
    },
    insertOneQuestion(formName) {
      // console.log(this.newQuestionForm);
      this.$confirm('是否确定上传新题目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        /*
        submit to database
         */
        console.log(this.submitForm(formName));
        if (!this.newQuestionFormValidator) {
          return
        }
        if (!this.checkSampleCnt()) {
          this.$message({
            type: 'error',
            message: '测试案例至少两个'
          })
          return
        }

        console.log(store.state.userInfo)
        this.newQuestionForm.account = store.state.userInfo.account

        axios.post(BASE_URL + '/question/insertOneQuestion', this.newQuestionForm)
            .then(res => {
              console.log(res.data);
              if (res.data.status === SUCCESS) {
                this.$message({
                  type: 'success',
                  message: '上传成功'
                });
              } else if (res.data.status === SQL_ERROR) {
                this.$message({
                  type: 'error',
                  message: 'SQL ERROR'
                });
              } else {
                this.$message({
                  type: 'error',
                  message: 'UNKNOWN ERROR'
                });
              }
            }).catch(err => {
              this.$alert(err);
            })
        this.clearNewQuestionForm()
        this.uploadVisible = false
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上传'
        });
        this.uploadVisible =false
      });
    },
    addTestExample() {
      this.newQuestionForm.samples.push({
        input: '',
        output: '',
      })
    },
    clearNewQuestionForm() {
      this.newQuestionForm.name = ''
      this.newQuestionForm.samples = [{
        input: '',
        output: ''}]
      this.newQuestionForm.questionDescription = ''
      this.newQuestionForm.inputDescription = ''
      this.newQuestionForm.outputDescription = ''
      this.newQuestionForm.sampleOutput = ''
      this.newQuestionForm.sampleInput = ''
    },
    removeExample(example) {
      let index = this.newQuestionForm.samples.indexOf(example)
      if (index !== -1) {
        this.newQuestionForm.samples.splice(index, 1)
      }
    },
    chooseQuestionId(q) {
      /*
      更新当前题目
      */
      this.$confirm('是否确定选择该题目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.getOneQuestion(q.id)
        /*
        换题请求
         */
        //清空提交结果
        this.clearSubmitResult()
        this.$message({
          type: 'success',
          message: '已更换题目'
        });
        this.questionListVisible =false
      }).catch(() => {

      });
      console.log(q);
    },
    clearSubmitResult() {
      this.onlineJudgeRes = {
        id: -1,
        name: '',
        isLoading: false,
        isPass: false,
        isCompileErr: false,
        memoryUsage: 'N/A',
        runtime: 'N/A',
        input: '',
        predictedOutput: '',
        realOutput: '',
        compileMsg: '',
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid, object) => {
        if (valid) {
          // this.$alert('submit!')
          this.newQuestionFormValidator = true
        } else {
          this.$message({
            type: 'error',
            message: '请按表单格式填写'
          })
          this.newQuestionFormValidator = false
        }
      });
      // console.log(flag);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    checkSampleCnt() {
      return this.newQuestionForm.samples.length > 1
    },
    getOneQuestion(id) {
      axios.get(BASE_URL + '/question/getQuestion', {
        params: {
          id: id
        }
      }).then(res => {
        this.questionForm = {
          id: res.data.id,
          provider: res.data.accountName,
          name: res.data.name,
          questionDescription: res.data.questionDescription,
          inputDescription: res.data.inputDescription,
          outputDescription: res.data.outputDescription,
          sampleInput: res.data.sampleInput,
          sampleOutput: res.data.sampleOutput,
        }
      }).catch(err => {
        this.$alert(err)
      })
    },
    getQuestionList() {
      this.questionList.questions = []
      axios.get(BASE_URL + '/question/getQuestionList').then(res => {
        res.data.forEach(item => {
          this.questionList.questions.push({
            id: item.id,
            name: item.name
          })
        })
      }).catch(err =>{
        this.$alert(err)
      })
    },
    OJFinishedNotify() {
      this.$notify({
        title: '成功',
        message: '请点击右下角按钮查看结果',
        type: 'success'
      })
    }
  },
  mounted() {
    //todo
    /*
    加载默认问题
     */
    this.getOneQuestion(1)

    //todo
    /*
    初始化题目列表
     */
    this.getQuestionList()
  }
}
</script>

<style scoped>

.to-red >>> .el-textarea__inner {
  color: red;
}
/*.rt-input /deep/ .el-textarea__inner {*/
/*  color: red;*/
/*}*/

</style>