/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export var conf = {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
    comments: {
        lineComment: '//',
        blockComment: ['/*', '*/']
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
        { open: "'", close: "'", notIn: ['string', 'comment'] },
        { open: '"', close: '"', notIn: ['string', 'comment'] }
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '<', close: '>' },
        { open: "'", close: "'" },
        { open: '"', close: '"' }
    ],
    folding: {
        markers: {
            start: new RegExp('^\\s*#region\\b'),
            end: new RegExp('^\\s*#endregion\\b')
        }
    }
};
export var language = {
    defaultToken: '',
    tokenPostfix: '.cs',
    brackets: [
        { open: '{', close: '}', token: 'delimiter.curly' },
        { open: '[', close: ']', token: 'delimiter.square' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' },
        { open: '<', close: '>', token: 'delimiter.angle' }
    ],
    keywords: [
        'extern',
        'alias',
        'using',
        'bool',
        'decimal',
        'sbyte',
        'byte',
        'short',
        'ushort',
        'int',
        'uint',
        'long',
        'ulong',
        'char',
        'float',
        'double',
        'object',
        'dynamic',
        'string',
        'assembly',
        'is',
        'as',
        'ref',
        'out',
        'this',
        'base',
        'new',
        'typeof',
        'void',
        'checked',
        'unchecked',
        'default',
        'delegate',
        'var',
        'const',
        'if',
        'else',
        'switch',
        'case',
        'while',
        'do',
        'for',
        'foreach',
        'in',
        'break',
        'continue',
        'goto',
        'return',
        'throw',
        'try',
        'catch',
        'finally',
        'lock',
        'yield',
        'from',
        'let',
        'where',
        'join',
        'on',
        'equals',
        'into',
        'orderby',
        'ascending',
        'descending',
        'select',
        'group',
        'by',
        'namespace',
        'partial',
        'class',
        'field',
        'event',
        'method',
        'param',
        'public',
        'protected',
        'internal',
        'private',
        'abstract',
        'sealed',
        'static',
        'struct',
        'readonly',
        'volatile',
        'virtual',
        'override',
        'params',
        'get',
        'set',
        'add',
        'remove',
        'operator',
        'true',
        'false',
        'implicit',
        'explicit',
        'interface',
        'enum',
        'null',
        'async',
        'await',
        'fixed',
        'sizeof',
        'stackalloc',
        'unsafe',
        'nameof',
        'when'
    ],
    class: [
        "Console",
        "String",
        "Int32",
        "Double",
        "DateTime",
        "TimeSpan",
        "Boolean",
        "Char",
        "Decimal",
        "Math",
        "Random",
        "Convert",
        "Environment",
        "DirectoryInfo",
        "FileInfo",
        "Exception",
        "ArrayList",
        "List",
        "Dictionary",
        "Thread",
    ],
    functions: ["Parse", "TryParse", "DivRem", "LeadingZeroCount", "PopCount", "RotateLeft", "RotateRight", "TrailingZeroCount", "IsPow2", "Log2", "Clamp", "CopySign", "Max", "Min", "Sign", "Abs", "CreateChecked", "CreateSaturating", "CreateTruncating", "IsEvenInteger", "IsNegative", "IsOddInteger", "IsPositive", "MaxMagnitude", "MinMagnitude", "MaxValue", "MinValue", "TrueString", "FalseString", "FromOACurrency", "ToOACurrency", "Add", "Ceiling", "Compare", "Divide", "Equals", "Floor", "GetBits", "TryGetBits", "Remainder", "Multiply", "Negate", "Round", "Subtract", "ToByte", "ToSByte", "ToInt16", "ToDouble", "ToInt32", "ToInt64", "ToUInt16", "ToUInt32", "ToUInt64", "ToSingle", "Truncate", "IsCanonical", "IsInteger", "Zero", "One", "MinusOne", "DaysInMonth", "FromBinary", "FromFileTime", "FromFileTimeUtc", "FromOADate", "SpecifyKind", "IsLeapYear", "ParseExact", "TryParseExact", "Now", "Today", "UtcNow", "UnixEpoch", "FromDays", "FromHours", "FromMilliseconds", "FromMicroseconds", "FromMinutes", "FromSeconds", "FromTicks", "NanosecondsPerTick", "TicksPerMicrosecond", "TicksPerMillisecond", "TicksPerSecond", "TicksPerMinute", "TicksPerHour", "TicksPerDay", "IsFinite", "IsInfinity", "IsNaN", "IsNegativeInfinity", "IsNormal", "IsPositiveInfinity", "IsSubnormal", "Exp", "ExpM1", "Exp2", "Exp2M1", "Exp10", "Exp10M1", "Atan2", "Atan2Pi", "BitDecrement", "BitIncrement", "FusedMultiplyAdd", "Ieee754Remainder", "ILogB", "ReciprocalEstimate", "ReciprocalSqrtEstimate", "ScaleB", "Acosh", "Asinh", "Atanh", "Cosh", "Sinh", "Tanh", "Log", "LogP1", "Log10", "Log2P1", "Log10P1", "MaxNumber", "MinNumber", "IsRealNumber", "MaxMagnitudeNumber", "MinMagnitudeNumber", "Pow", "Cbrt", "Hypot", "RootN", "Sqrt", "Acos", "AcosPi", "Asin", "AsinPi", "Atan", "AtanPi", "Cos", "CosPi", "Sin", "SinCos", "SinCosPi", "SinPi", "Tan", "TanPi", "Epsilon", "NegativeInfinity", "PositiveInfinity", "NaN", "NegativeZero", "E", "Pi", "Tau", "Intern", "IsInterned", "CompareOrdinal", "GetHashCode", "Create", "Copy", "IsNullOrEmpty", "IsNullOrWhiteSpace", "Concat", "Format", "Join", "Empty", "IsAscii", "ToString", "IsAsciiLetter", "IsAsciiLetterLower", "IsAsciiLetterUpper", "IsAsciiDigit", "IsAsciiLetterOrDigit", "IsAsciiHexDigit", "IsAsciiHexDigitUpper", "IsAsciiHexDigitLower", "IsDigit", "IsBetween", "IsLetter", "IsWhiteSpace", "IsUpper", "IsLower", "IsPunctuation", "IsLetterOrDigit", "ToUpper", "ToUpperInvariant", "ToLower", "ToLowerInvariant", "IsControl", "IsNumber", "IsSeparator", "IsSurrogate", "IsSymbol", "GetUnicodeCategory", "GetNumericValue", "IsHighSurrogate", "IsLowSurrogate", "IsSurrogatePair", "ConvertFromUtf32", "ConvertToUtf32", "ConstrainedCopy", "Clear", "AsReadOnly", "Resize", "CreateInstance", "BinarySearch", "ConvertAll", "Exists", "Fill", "Find", "FindAll", "FindIndex", "FindLast", "FindLastIndex", "ForEach", "IndexOf", "LastIndexOf", "Reverse", "Sort", "TrueForAll", "MaxLength", "get_Capacity", "set_Capacity", "get_Count", "get_Item", "set_Item", "AddRange", "Contains", "CopyTo", "EnsureCapacity", "GetEnumerator", "GetRange", "Insert", "InsertRange", "Remove", "RemoveAll", "RemoveAt", "RemoveRange", "ToArray", "TrimExcess", "GetType", "ReadKey", "ResetColor", "SetBufferSize", "SetWindowPosition", "SetWindowSize", "GetCursorPosition", "Beep", "MoveBufferArea", "SetCursorPosition", "OpenStandardInput", "OpenStandardOutput", "OpenStandardError", "SetIn", "SetOut", "SetError", "Read", "ReadLine", "WriteLine", "Write", "In", "InputEncoding", "OutputEncoding", "KeyAvailable", "Out", "Error", "IsInputRedirected", "IsOutputRedirected", "IsErrorRedirected", "CursorSize", "NumberLock", "CapsLock", "BackgroundColor", "ForegroundColor", "BufferWidth", "BufferHeight", "WindowLeft", "WindowTop", "WindowWidth", "WindowHeight", "LargestWindowWidth", "LargestWindowHeight", "CursorVisible", "CursorLeft", "CursorTop", "Title", "TreatControlCAsInput", "CancelKeyPress"],
    namespaceFollows: ['namespace', 'using'],
    parenFollows: ['if', 'for', 'while', 'switch', 'foreach', 'using', 'catch', 'when'],
    operators: [
        '=',
        '??',
        '||',
        '&&',
        '|',
        '^',
        '&',
        '==',
        '!=',
        '<=',
        '>=',
        '<<',
        '+',
        '-',
        '*',
        '/',
        '%',
        '!',
        '~',
        '++',
        '--',
        '+=',
        '-=',
        '*=',
        '/=',
        '%=',
        '&=',
        '|=',
        '^=',
        '<<=',
        '>>=',
        '>>',
        '=>'
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    // escape sequences
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    // The main tokenizer for our languages
    tokenizer: {
        root: [
            // identifiers and keywords
            [
                /\@?[a-zA-Z_]\w*/,
                {
                    cases: {
                        '@class': 'class',
                        '@functions': 'function',
                        '@namespaceFollows': {
                            token: 'keyword.$0',
                            next: '@namespace'
                        },
                        '@keywords': {
                            token: 'keyword.$0',
                            next: '@qualified'
                        },
                        '@default': { token: 'identifier', next: '@qualified' }
                    }
                }
            ],
            // whitespace
            { include: '@whitespace' },
            // delimiters and operators
            [
                /}/,
                {
                    cases: {
                        '$S2==interpolatedstring': {
                            token: 'string.quote',
                            next: '@pop'
                        },
                        '$S2==litinterpstring': {
                            token: 'string.quote',
                            next: '@pop'
                        },
                        '@default': '@brackets'
                    }
                }
            ],
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [
                /@symbols/,
                {
                    cases: {
                        '@operators': 'delimiter',
                        '@default': ''
                    }
                }
            ],
            // numbers
            [/[0-9_]*\.[0-9_]+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
            [/0[xX][0-9a-fA-F_]+/, 'number.hex'],
            [/0[bB][01_]+/, 'number.hex'],
            [/[0-9_]+/, 'number'],
            // delimiter: after number because of .\d floats
            [/[;,.]/, 'delimiter'],
            // strings
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
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
            [
                /[a-zA-Z_][\w]*/,
                {
                    cases: {
                        '@keywords': { token: 'keyword.$0' },
                        '@default': 'identifier'
                    }
                }
            ],
            [/\./, 'delimiter'],
            ['', '', '@pop']
        ],
        namespace: [
            { include: '@whitespace' },
            [/[A-Z]\w*/, 'namespace'],
            [/[\.=]/, 'delimiter'],
            ['', '', '@pop']
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
            [/\/\/.*$/, 'comment']
        ]
    }
};
