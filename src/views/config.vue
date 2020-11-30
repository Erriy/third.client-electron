
<template>
    <div ref="container" class='editor-fullscreen'></div>
</template>

<script>
import * as monaco from "monaco-editor";

export default{
    mounted() {
        var editor = monaco.editor.create(this.$refs.container, {
            value: [
                'function x() {',
                '\tconsole.log("Hello world!");',
                '}'
            ].join('\n'),
            language: 'javascript',
            minimap:{
                enabled:false
            },
            theme: 'vs-dark',
            selectOnLineNumbers: true,
            roundedSelection: false,
            cursorStyle: 'line', // 光标样式
            automaticLayout: false, // 自动布局
            glyphMargin: true, // 字形边缘
            useTabStops: false,
            fontSize: 12, // 字体大小
            autoIndent: false //自动布局
        });
    }
}
</script>

<style>
.editor-fullscreen {
    position: fixed !important;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100% !important;
    z-index: 1000;
}
</style>