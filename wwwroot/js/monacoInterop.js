
var require = { paths: { vs: '_content/BlazorMonaco/lib/monaco-editor/min/vs' } };

import * as module from "./model.js";

let languageId = module.languageId;
let languageConfig = module.languageConfiguration;
let monarch = module.Monarch;
let func = module.provideCompletionItems;
let assemblies = null;

const monacoInterop = {};
monacoInterop.editors = {};

monacoInterop.setCmd = (elementId,code) => {
    //const editor = monacoInterop.editors[elementId];
    //editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function () {
    //    console.log('Ctrl + S 保存')
    //})

    // 动态监听代码的改变，双向数据绑定
    //editor.onDidChangeModelContent();
    let editor = monaco.editor.create(document.getElementById(elementId), {
        value: code,
        language: languageId,
        theme: "vs-dark",
        wrappingIndent: "indent",
        wordWrap: "wordWrapColumn",//自动换行
        "semanticHighlighting.enabled": true,//启动语义高亮
    });
    monacoInterop.editors[elementId] = editor;
    console.log(elementId);
    monacoInterop.setMonarchTokensProvider();
    monacoInterop.setLanguageConfiguration();
    monacoInterop.registerCompletionItemProvider();
    monacoInterop.setTheme();
    //monacoInterop.setTokensColor(elementId);
}


monacoInterop.initialize = (elementId, initialCode, language) => {
    require.config({ paths: { 'vs': 'monaco-editor/min/vs' } });
    
};

//注册词法分析
monacoInterop.setMonarchTokensProvider = () => monaco.languages.setMonarchTokensProvider(languageId, {
	defaultToken: monarch.defaultToken,
	tokenPostfix: monarch.tokenPostfix,
	brackets: monarch.brackets,
	keywords: monarch.keywords,
	namespaceFollows: monarch.namespaceFollows,
	parenFollows: monarch.parenFollows,
	operators: monarch.operators,
	symbols: monarch.symbols,
	// escape sequences
	escapes: monarch.escapes,
    // The main tokenizer for our languages
    tokenizer: monarch.tokenizer,
})

// 注册语言配置
monacoInterop.setLanguageConfiguration = () => monaco.languages.setLanguageConfiguration('csharp', {
    comments: languageConfig.comments,
    brackets: languageConfig.brackets,
    autoClosingPairs: languageConfig.autoClosingPairs,
    surroundingPairs: languageConfig.surroundingPairs,
    indentationRules: languageConfig.indentationRules,
});

// 注册自动完成提供程序
monacoInterop.registerCompletionItemProvider = () => monaco.languages.registerCompletionItemProvider(languageId, {
    triggerCharacters: [".", " "],
    provideCompletionItems: func,
})


monacoInterop.registerDocumentSemanticTokensProvider = () =>
monaco.languages.registerDocumentSemanticTokensProvider(languageId, {
    getLegend: function () { return legend; },
    provideDocumentSemanticTokens: () => { },
})






//设置主题颜色
monacoInterop.setTheme = () => {
    monaco.editor.defineTheme("myTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: 'keyword', foreground: 'ab1f9e', fontStyle: 'bold' },
            { token: 'string', foreground: '2f810f' },
            { token: 'number', foreground: '2f810f' },
            { token: 'comment', foreground: '5e5e5e', fontStyle: 'italic' },
            { token: 'number.float', foreground: 'ab1f9e' },
        ],
        colors: {
            'editor.background': '#1e1e1e',
            'editor.foreground': '#d4d4d4',
            'editor.lineHighlightBackground': '#2d2d2d',
            'editorLineNumber.foreground': '#d4d4d4',
            'editor.selectionBackground': '#3e3e3e',
            'editor.wordHighlightBackground': '#303030',
            'editorCursor.foreground': '#d4d4d4',
        },
        encodedTokensColors: ['#ab1f9e', '#2f810f', '#b5cea8', '#5e5e5e', '#ab1f9e'],
    });
    monaco.editor.setTheme("myTheme");
}


//鼠标悬停
monacoInterop.provideHover =() => monaco.languages.registerHoverProvider(languageId, {
    provideHover: function (model, postion) {
        return {
            range: new monaco.Range(
                1,
                1,
                model.getLineCount(),
                model.getLineMaxColumn(model.getLineCount())
            ),
            contents: [
                { value: "**SOURCE**" },
                {
                    value:
                        "1111",
                },
            ],
        };
    }
});


monacoInterop.getCode = (elementId) => monacoInterop.editors[elementId].getValue();

monacoInterop.setCode = (elementId, code) => monacoInterop.editors[elementId].setValue(code);

monacoInterop.setMarkers = (elementId, markers) => {
    const editor = monacoInterop.editors[elementId];
    const model = editor.getModel();
    monaco.editor.setModelMarkers(model, null, markers);
};

//快速修复
monacoInterop.quickFix = () => {
    monaco.languages.registerCodeActionProvider
}





//monaco.languages.registerCompletionItemProvider(languageId, {
//    provideCompletionItems: function (model, position) {
//        let textUnitPosition = model.getValueInRange({
//            startLineNumber: position.lineNumber,
//            startColumn: 1,
//            endLineNumber: position.lineNumber,
//            endColumn: position.column
//        });
//        let match = textUnitPosition.match(/(\S+)$/);
//        if (!match) return [];
//        let suggestions = [];
//        return {
//            // SQL关键字（本地文件）、token代码补全
//            suggestions: createDependencyProposals(range, editor, word)
//        };
//    }
//});

//monacoInterop.setTokensColor = (elementId) => {
//    monaco.languages.registerCompletionItemProvider('csharp', {
//        provideCompletionItems: function (model, position) {
//            var suggestions = [];
//            var range = {
//                startLineNumber: position.lineNumber,
//                endLineNumber: position.lineNumber,
//                startColumn: 1,
//                endColumn: position.column
//            };
//            var textUntilPosition = model.getValueInRange(range);
//            if (/\bmyKeyword$/i.test(textUntilPosition)) {
//                suggestions.push({
//                    label: 'myKeyword',
//                    kind: monaco.languages.CompletionItemKind.Keyword,
//                    insertText: 'myKeyword'
//                });
//            }
//            return {
//                suggestions: suggestions
//            };
//        }
//    });
//}


window.monacoInterop = monacoInterop;