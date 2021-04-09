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
          <el-button type="primary" @click="onSubmit">上传</el-button>
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
              <el-input disabled v-model="questionForm.writer"></el-input>
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

      </el-form>
    </el-dialog>

    <!--   result -->
    <el-dialog title="提交结果" :visible.sync="resVisible">
      <el-form :model="onlineJudgeRes">
        <el-form-item v-show="!onlineJudgeRes.isSubmit">
          <el-row>
            <el-col style="font-size: 17px">
              您还未提交题目, 请先提交题目
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-show="onlineJudgeRes.isSubmit">
          <el-row>
            <el-col :span="16" style="font-size: 17px; text-align:left">
              题目名称： {{onlineJudgeRes.name}}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-show="onlineJudgeRes.isSubmit">
          <el-row style="font-size: 17px; text-align:left">
            <el-col :span="8">
              时间： {{onlineJudgeRes.runtime}}
            </el-col>
            <el-col :span="8">
              内存： {{onlineJudgeRes.memoryUsage}}
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-show="onlineJudgeRes.isCompileErr">
          <el-row>
            <el-col :span="24">
              <el-input class="to-red" type="textarea" disabled v-model="onlineJudgeRes.compileErr"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-show="onlineJudgeRes.isSubmit && !onlineJudgeRes.isCompileErr && !onlineJudgeRes.isPass">
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
        <el-form-item v-show="onlineJudgeRes.isPass">
          <el-row>
            <el-col style="font-size: 17px">
              恭喜您，通过本道题的测试
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
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
      descriptionVisible: false,
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
        writer: 'Euphonium',
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
        name: 'test hh test',
        isSubmit: true,
        isPass: false,
        isCompileErr: false,
        memoryUsage: 'N/A',
        runtime: 'N/A',
        //这只是测试
        input: '1 2 3',
        predictedOutput: '1 2 3',
        realOutput: '3 2 1',
        compileErr: 'compile err',
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
      this.descriptionVisible = true
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
          message: '已取消上传'
        });
        this.uploadVisible =false
      });
    },
    addTestExample() {
      this.newQuestionForm.testExamples.push({
        input: '',
        output: '',
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
    },
    chooseQuestionId(q) {
      //todo
      /*
      更新当前题目
      */
      this.$confirm('是否确定选择该题目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        //todo
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
        isSubmit: false,
        isPass: false,
        isCompileErr: false,
        memoryUsage: 'N/A',
        runtime: 'N/A',
        input: '',
        predictedOutput: '',
        realOutput: '',
        compileErr: '',
      }
    },
  },
  mounted() {
    //todo
    /*
    加载默认问题
     */
    this.questionForm.writer = 'test'

    //todo
    /*
    初始化题目列表
     */
    this.questionList.questions.push({
      id: 0,
      name: 'test',
    })
    this.questionList.questions.push({
      id: -1,
      name: 'test',
    })
    this.questionList.questions.push({
      id: 2,
      name: 'test',
    })
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