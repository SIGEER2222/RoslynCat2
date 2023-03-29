//����
async function sendRequest(type, request) {
    let endPoint;
    switch (type) {
        case 'complete': endPoint = '/completion/complete'; break;
        case 'signature': endPoint = '/completion/signature'; break;
        case 'hover': endPoint = '/completion/hover'; break;
        case 'codeCheck': endPoint = '/completion/codeCheck'; break;
    }
    return await axios.post(endPoint, JSON.stringify(request))
}

// ʵ���Զ�����߼�

export async function provideCompletionItems(model, position) {

    const word = model.getWordUntilPosition(position);
    const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
    };
    const suggestions = [];

    let request = {
        Code: model.getValue(),
        Position: model.getOffsetAt(position),
        Assemblies: assemblies
    }
    let resultQ = await sendRequest("complete", request);

    for (let elem of resultQ.data) {
        suggestions.push({
            label: {
                label: elem.Suggestion,
                description: elem.Description
            },
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: elem.Suggestion
        });
    }
    // ����Զ������
    suggestions.push({
        label: "Console",
        kind: monaco.languages.CompletionItemKind.Class,
        documentation: "Represents the standard input, output, and error streams.",
        insertText: "Console",
    });
    suggestions.push({
        label: "DateTime",
        kind: monaco.languages.CompletionItemKind.Class,
        documentation:
            "Represents an instant in time, typically expressed as a date and time of day.",
        insertText: "DateTime",
    });
    return { suggestions: suggestions, incomplete: true };
}

export const languageId = 'csharp';

/**
 * 
 */
export const Monarch = {
    defaultToken: 'invalid',
    tokenPostfix: '.cs',

    brackets: [
        { open: '{', close: '}', token: 'delimiter.curly' },
        { open: '[', close: ']', token: 'delimiter.square' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' },
        { open: '<', close: '>', token: 'delimiter.angle' }
    ],

    keywords: [
        'extern', 'alias', 'using', 'bool', 'decimal', 'sbyte', 'byte', 'short',
        'ushort', 'int', 'uint', 'long', 'ulong', 'char', 'float', 'double',
        'object', 'dynamic', 'string', 'assembly', 'is', 'as', 'ref',
        'out', 'this', 'base', 'new', 'typeof', 'void', 'checked', 'unchecked',
        'default', 'delegate', 'var', 'const', 'if', 'else', 'switch', 'case',
        'while', 'do', 'for', 'foreach', 'in', 'break', 'continue', 'goto',
        'return', 'throw', 'try', 'catch', 'finally', 'lock', 'yield', 'from',
        'let', 'where', 'join', 'on', 'equals', 'into', 'orderby', 'ascending',
        'descending', 'select', 'group', 'by', 'namespace', 'partial', 'class',
        'field', 'event', 'method', 'param', 'property', 'public', 'protected',
        'internal', 'private', 'abstract', 'sealed', 'static', 'struct', 'readonly',
        'volatile', 'virtual', 'override', 'params', 'get', 'set', 'add', 'remove',
        'operator', 'true', 'false', 'implicit', 'explicit', 'interface', 'enum',
        'null', 'async', 'await', 'fixed', 'sizeof', 'stackalloc', 'unsafe', 'nameof',
        'when'
    ],

    typeKeywords: [
        'boolean', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float'
    ],

    namespaceFollows: [
        'namespace', 'using',
    ],

    parenFollows: [
        'if', 'for', 'while', 'switch', 'foreach', 'using', 'catch', 'when'
    ],

    operators: [
        '=', '??', '||', '&&', '|', '^', '&', '==', '!=', '<=', '>=', '<<',
        '+', '-', '*', '/', '%', '!', '~', '++', '--', '+=',
        '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '>>', '=>'
    ],

    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    // escape sequences
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    // The main tokenizer for our languages
    tokenizer: {
        root: [

            // identifiers and keywords
            [/\@?[a-zA-Z_]\w*/, {
                cases: {
                    '@namespaceFollows': { token: 'keyword.$0', next: '@namespace' },
                    '@keywords': { token: 'keyword.$0', next: '@qualified' },
                    '@default': { token: 'identifier', next: '@qualified' }
                }
            }],

            // whitespace
            { include: '@whitespace' },

            // delimiters and operators
            [/}/, {
                cases: {
                    '$S2==interpolatedstring': { token: 'string.quote', next: '@pop' },
                    '$S2==litinterpstring': { token: 'string.quote', next: '@pop' },
                    '@default': '@brackets'
                }
            }],
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, {
                cases: {
                    '@operators': 'delimiter',
                    '@default': ''
                }
            }],

            // numbers
            [/[0-9_]*\.[0-9_]+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
            [/0[xX][0-9a-fA-F_]+/, 'number.hex'],
            [/0[bB][01_]+/, 'number.hex'], // binary: use same theme style as hex
            [/[0-9_]+/, 'number'],

            // delimiter: after number because of .\d floats
            [/[;,.]/, 'delimiter'],

            // strings
            [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
            [/"/, { token: 'string.quote', next: '@string' }],
            [/\$\@"/, { token: 'string.quote', next: '@litinterpstring' }],
            [/\@"/, { token: 'string.quote', next: '@litstring' }],
            [/\$"/, { token: 'string.quote', next: '@interpolatedstring' }],

            // characters
            [/'[^\\']'/, 'string'],
            [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
            [/'/, 'string.invalid']
        ],

        qualified: [
            [/[a-zA-Z_][\w]*/, {
                cases: {
                    '@keywords': { token: 'keyword.$0' },
                    '@default': 'identifier'
                }
            }],
            [/\./, 'delimiter'],
            ['', '', '@pop'],
        ],

        namespace: [
            { include: '@whitespace' },
            [/[A-Z]\w*/, 'namespace'],
            [/[\.=]/, 'delimiter'],
            ['', '', '@pop'],
        ],

        comment: [
            [/[^\/*]+/, 'comment'],
            // [/\/\*/,    'comment', '@push' ],    // no nested comments :-(
            ['\\*/', 'comment', '@pop'],
            [/[\/*]/, 'comment']
        ],

        string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', next: '@pop' }]
        ],

        litstring: [
            [/[^"]+/, 'string'],
            [/""/, 'string.escape'],
            [/"/, { token: 'string.quote', next: '@pop' }]
        ],

        litinterpstring: [
            [/[^"{]+/, 'string'],
            [/""/, 'string.escape'],
            [/{{/, 'string.escape'],
            [/}}/, 'string.escape'],
            [/{/, { token: 'string.quote', next: 'root.litinterpstring' }],
            [/"/, { token: 'string.quote', next: '@pop' }]
        ],

        interpolatedstring: [
            [/[^\\"{]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/{{/, 'string.escape'],
            [/}}/, 'string.escape'],
            [/{/, { token: 'string.quote', next: 'root.interpolatedstring' }],
            [/"/, { token: 'string.quote', next: '@pop' }]
        ],

        whitespace: [
            [/^[ \t\v\f]*#((r)|(load))(?=\s)/, 'directive.csx'],
            [/^[ \t\v\f]*#\w.*$/, 'namespace.cpp'],
            [/[ \t\v\f\r\n]+/, ''],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
        ],
    },
};

export const languageConfiguration = {

    comments: {
        lineComment: '//',
        blockComment: ['/*', '*/'],
    },
    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
    ],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '\'', close: '\'', notIn: ['string', 'comment'] },
        { open: '\"', close: '\"', notIn: ['string'] }
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '\'', close: '\'' },
        { open: '\"', close: '\"' }
    ],
    indentationRules: {
        decreaseIndentPattern: /^((?!.*?\/\*).*\*\/)?\s*[\}\]\)].*$/,
        increaseIndentPattern: /^((?!\/\/).)*(\{[^}"'`]*|\([^)"'`]*|\[[^\]"'`]*)$/
    }
}

export const legend = {
    tokenTypes: [
        "comment",
        "string",
        "keyword",
        "number",
        "regexp",
        "operator",
        "namespace",
        "type",
        "struct",
        "class",
        "interface",
        "enum",
        "typeParameter",
        "function",
        "member",
        "macro",
        "variable",
        "parameter",
        "property",
        "label",
    ],
    tokenModifiers: [
        "declaration",
        "documentation",
        "readonly",
        "static",
        "abstract",
        "deprecated",
        "modification",
        "async",
    ],
}

const CSHARP_TOKENS = {
    CLASS: "class",
    METHOD: "method",
    PROPERTY: "property",
    COMMENT: "comment",
    STRING: "string",
    NUMBER: "number",
    KEYWORD: "keyword",
    IDENTIFIER: "identifier",
};
const CSHARP_LEGEND = {
    tokenTypes: [
        CSHARP_TOKENS.CLASS,
        CSHARP_TOKENS.METHOD,
        CSHARP_TOKENS.PROPERTY,
        CSHARP_TOKENS.COMMENT,
        CSHARP_TOKENS.STRING,
        CSHARP_TOKENS.NUMBER,
        CSHARP_TOKENS.KEYWORD,
        CSHARP_TOKENS.IDENTIFIER,
    ],
    tokenModifiers: ["static", "readonly", "async"],
    colors: {
        [CSHARP_TOKENS.CLASS]: "#569cd6",
        [CSHARP_TOKENS.METHOD]: "#c586c0",
        [CSHARP_TOKENS.PROPERTY]: "#9cdcfe",
        [CSHARP_TOKENS.COMMENT]: "#6a9955",
        [CSHARP_TOKENS.STRING]: "#ce9178",
        [CSHARP_TOKENS.NUMBER]: "#b5cea8",
        [CSHARP_TOKENS.KEYWORD]: "#4ec9b0",
        [CSHARP_TOKENS.IDENTIFIER]: "#dcdcaa",
    },
};
const CSHARP_TOKEN_PATTERN = /(?<=\W|^)(class|void|int|string|bool|true|false|null|var|new|async|await|namespace|using)(?=\W|$)|(?<=\W|^)(static|readonly)(\.[A-Za-z0-9_]+)*(?=\W|$)|(?<=\W|^)(\w+)(?= *\()|\/\/.*|\/\*[\s\S]*?\*\//gm;


export function  getType(type) {
    return legend.tokenTypes.indexOf(type);
}

/** ��ȡmod
 *  @type {(modifier: string[]|string|null)=>number} 
 * @param grid {Ext.Grid.Panel} ��Ҫ�ϲ���Grid
* @param cols {Array} ��Ҫ�ϲ��е�Index(���)���飻��0��ʼ���������Ҳ������
* @param isAllSome {Boolean} ���Ƿ�2��tr��cols�������һ�����ܽ��кϲ���true�����һ����false(Ĭ��)������ȫһ��
* @return void
* @author polk6 2015/07/21 
* @example
* _________________                             _________________
* |  ���� |  ���� |                             |  ���� |  ���� |
* -----------------      mergeCells(grid,[0])   -----------------
* |  18   |  ���� |              =>             |       |  ���� |
* -----------------                             -  18   ---------
* |  18   |  ���� |                             |       |  ���� |
* -----------------                             -----------------
 */
export function getModifier(modifiers) {
    if (typeof modifiers === "string") {
        modifiers = [modifiers];
    }
    if (Array.isArray(modifiers)) {
        let nModifiers = 0;
        for (let modifier of modifiers) {
            const nModifier = legend.tokenModifiers.indexOf(modifier);
            if (nModifier > -1) {
                nModifiers |= (1 << nModifier) >>> 0;
            }
        }
        return nModifiers;
    } else {
        return 0;
    }
}
export function registerDocumentSemanticTokensProvider() { 
monaco.languages.registerDocumentSemanticTokensProvider(languageId, {
    getLegend: function () { return CSHARP_LEGEND; },
    provideDocumentSemanticTokens: function (model, lastResultId, token) {

        if (lastResultId) {
            let cachedResult = cache.get(lastResultId);
            if (cachedResult) {
                return cachedResult;
            }
        }

        var lines = model.getLinesContent();
        var data = [];

        let result = computeDocumentSemanticTokens(model, token);

        // �������ӵ�������
        let resultId = uuidv4();
        cache.set(resultId, result);

        return {
            data: result.tokens,
            resultId,
        };
    },
    releaseDocumentSemanticTokens: function (resultId) {
        // Release any resources associated with the given resultId here...
        cache.delete(resultId);
    }
});
function computeDocumentSemanticTokens(model, token) {
    let lines = model.getLinesContent();

    let tokens = [];
    let offset = 0;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        let lineTokens = computeLineSemanticTokens(line, offset, token);
        tokens = tokens.concat(lineTokens);
        offset += line.length + 1; // +1 ����Ϊÿ��ĩβ����һ�����з�
    }

    return { tokens };
}

function computeLineSemanticTokens(line, offset, token) {
    let tokens = [];

    // ... �����﷨�����������е����嵥Ԫ ...

    return tokens;
}

let cache = new Map();
}
