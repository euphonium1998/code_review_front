<template>
  <div ref="container" style="height: 100%;width: 100%; text-align: left"></div>
</template>

<script>

import store from '@/store/index'
import * as monaco from 'monaco-editor'
export default {
  name: "Monaco",
  data() {
    return {
      monacoEditor: { }
    }
  },
  mounted() {
    // 初始化编辑器，确保dom已经渲染，dialog中要写在opened中
    this.monacoEditor = monaco.editor.create(this.$refs.container, {
      value: `/* example */
#include<stdio.h>

int main() {
    printf("hello world\\n");
}`,
      readOnly: false,
      language: 'c',
      theme: 'vs-white'
    });
  },
  methods: {
    changeEditor(editorMsg) { // 更改editor内容
      this.monacoEditor.setValue(editorMsg);
      // this.monacoEditor.getAction('editor.action.formatDocument')._run();
    },
    destroyEditor() { // 销毁编辑器
      this.monacoEditor.dispose();
    },
    getEditorValue() {
      return this.monacoEditor.getValue()
    }
  }
}
</script>

<style scoped>

</style>