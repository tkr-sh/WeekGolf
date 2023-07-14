/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export var conf = {
    comments: {
        lineComment: '#',
        blockComment: ["'''", "'''"]
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
        { open: '"', close: '"', notIn: ['string'] },
        { open: "'", close: "'", notIn: ['string', 'comment'] }
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
    ],
    folding: {
        offSide: true,
        markers: {
            start: new RegExp('^\\s*#region\\b'),
            end: new RegExp('^\\s*#endregion\\b')
        }
    }
};
export var language = {
    defaultToken: '',
    tokenPostfix: '.python',
    // Output of print(keyword.kwlist)
    keywords: ['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'],
    functions: ['real', 'splitlines', 'DeprecationWarning', 'UnicodeWarning', 'capitalize', 'enumerate', 'ord', 'filter', 'object', 'help', 'oct', '__name__', 'None', 'ConnectionResetError', 'Exception', 'startswith', 'ndim', '__imul__', 'ReferenceError', 'values', '__getattribute__', '__pos__', 'classmethod', 'ExceptionGroup', '__lt__', 'rstrip', 'EnvironmentError', '__gt__', '__doc__', 'isidentifier', 'exec', 'NotImplementedError', '__build_class__', 'BufferError', 'max', 'imag', 'license', 'itemsize', 'zfill', 'nbytes', '__rxor__', 'input', '__le__', 'reverse', '__mod__', '__format__', 'float', 'upper', 'any', 'map', 'min', 'index', 'OSError', '__radd__', '__rpow__', '__trunc__', 'BaseExceptionGroup', 'to_bytes', '__dir__', 'get', 'islower', '__invert__', 'expandtabs', 'split', '__sizeof__', 'SystemError', '__setitem__', 'ValueError', '__new__', '__rshift__', 'c_contiguous', 'conjugate', 'open', 'IndexError', 'print', 'format_map', 'dict', 'bit_count', 'len', 'UnboundLocalError', '__subclasshook__', '__floordiv__', 'reversed', 'difference', '__ceil__', 'ConnectionRefusedError', '__setattr__', 'rjust', 'compile', 'id', 'sort', 'InterruptedError', 'keys', 'isprintable', '__bytes__', 'format', 'ModuleNotFoundError', '__rfloordiv__', 'shape', 'MemoryError', '__add__', '__hash__', 'False', 'swapcase', 'pop', 'IOError', 'rsplit', 'sum', 'fromkeys', 'repr', 'SystemExit', '__rdivmod__', 'f_contiguous', 'StopIteration', 'eval', 'True', 'bit_length', 'UnicodeTranslateError', 'vars', 'ImportError', 'locals', 'copyright', 'remove', '__spec__', 'NotImplemented', 'numerator', '__truediv__', '__loader__', 'istitle', 'RecursionError', 'step', 'str', 'OverflowError', 'exit', 'isalnum', 'SyntaxError', '__divmod__', 'KeyboardInterrupt', '__reduce_ex__', '__delattr__', 'is_integer', '__or__', 'TabError', 'isascii', 'TypeError', 'bytearray', 'range', 'start', 'credits', 'bin', 'join', 'setdefault', 'tobytes', 'cast', 'setattr', 'Ellipsis', 'encode', 'symmetric_difference', '__rrshift__', '__import__', '__rmul__', 'anext', '__init__', 'difference_update', 'chr', '__iadd__', 'removeprefix', '__xor__', 'NameError', 'SyntaxWarning', '__rtruediv__', 'frozenset', '__package__', 'BaseException', '__rlshift__', 'RuntimeWarning', 'casefold', 'set', 'breakpoint', 'issuperset', 'GeneratorExit', 'items', 'isdigit', '__enter__', 'all', 'list', 'BrokenPipeError', 'suboffsets', 'ProcessLookupError', '__index__', 'isinstance', 'iter', 'release', '__class__', 'getattr', 'endswith', 'discard', 'rfind', 'hasattr', '__repr__', 'copy', 'memoryview', '__getitem__', 'sorted', 'AttributeError', '__neg__', 'center', '__floor__', 'AssertionError', 'union', 'symmetric_difference_update', 'IsADirectoryError', 'title', 'IndentationError', '__reduce__', 'extend', 'UnicodeDecodeError', 'ArithmeticError', 'hash', 'PendingDeprecationWarning', 'RuntimeError', 'maketrans', '__contains__', 'UnicodeError', '__eq__', '__iter__', 'globals', 'type', 'rpartition', '__abs__', 'pow', 'FileNotFoundError', 'ConnectionAbortedError', 'abs', 'stop', 'delattr', 'ZeroDivisionError', '__complex__', 'PermissionError', 'decode', '__round__', 'BytesWarning', 'issubclass', 'update', '__float__', 'toreadonly', 'partition', 'next', '__ge__', '__iand__', '__exit__', '__rsub__', 'tolist', '__ixor__', 'int', 'ConnectionError', '__getformat__', 'intersection', 'popitem', '__alloc__', 'FloatingPointError', '__reversed__', 'UnicodeEncodeError', 'as_integer_ratio', 'UserWarning', 'complex', 'issubset', '__sub__', '__str__', 'zip', 'staticmethod', 'hex', 'translate', 'slice', 'removesuffix', 'ljust', '__ior__', 'find', 'replace', 'FileExistsError', 'isnumeric', 'FutureWarning', 'ChildProcessError', 'quit', 'insert', 'strides', 'super', '__bool__', 'EncodingWarning', 'tuple', '__getnewargs__', 'strip', 'isdecimal', 'ImportWarning', 'bytes', 'rindex', 'isalpha', 'KeyError', '__getstate__', 'intersection_update', 'isspace', 'NotADirectoryError', '__debug__', 'ascii', 'fromhex', 'round', '__ror__', 'BlockingIOError', '__pow__', 'isdisjoint', 'readonly', '__class_getitem__', 'StopAsyncIteration', 'Warning', '__ne__', 'from_bytes', '__rand__', 'obj', '__lshift__', '__len__', 'aiter', 'callable', '__mul__', 'clear', 'bool', '__delitem__', 'isupper', 'count', 'lstrip', '__rmod__', 'ResourceWarning', '__isub__', 'TimeoutError', '__and__', 'property', '__int__', 'add', 'contiguous', '__init_subclass__', 'denominator', 'dir', 'append', 'EOFError', 'LookupError', 'divmod', 'lower'],
    brackets: [
        { open: '{', close: '}', token: 'delimiter.curly' },
        { open: '[', close: ']', token: 'delimiter.bracket' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' }
    ],
    tokenizer: {
        root: [
            { include: '@whitespace' },
            { include: '@numbers' },
            { include: '@strings' },
            [/[,:;]/, 'delimiter'],
            [/[{}\[\]()]/, '@brackets'],
            [/@[a-zA-Z_]\w*/, 'tag'],
            [
                /[a-zA-Z_]\w*/,
                {
                    cases: {
                        '@functions': 'function',
                        '@keywords': 'keyword',
                        '@default': 'identifier'
                    }
                }
            ]
        ],
        // Deal with white space, including single and multi-line comments
        whitespace: [
            [/\s+/, 'white'],
            [/(^#.*$)/, 'comment'],
            [/'''/, 'string', '@endDocString'],
            [/"""/, 'string', '@endDblDocString']
        ],
        endDocString: [
            [/[^']+/, 'string'],
            [/\\'/, 'string'],
            [/'''/, 'string', '@popall'],
            [/'/, 'string']
        ],
        endDblDocString: [
            [/[^"]+/, 'string'],
            [/\\"/, 'string'],
            [/"""/, 'string', '@popall'],
            [/"/, 'string']
        ],
        // Recognize hex, negatives, decimals, imaginaries, longs, and scientific notation
        numbers: [
            [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number.hex'],
            [/-?0o([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number.hex'],
            [/-?0b([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number.hex'],
            [/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, 'number']
        ],
        // Recognize strings, including those broken across lines with \ (but not without)
        strings: [
            [/'$/, 'string.escape', '@popall'],
            [/'/, 'string.escape', '@stringBody'],
            [/"$/, 'string.escape', '@popall'],
            [/"/, 'string.escape', '@dblStringBody']
        ],
        stringBody: [
            [/[^\\']+$/, 'string', '@popall'],
            [/[^\\']+/, 'string'],
            [/\\./, 'string'],
            [/'/, 'string.escape', '@popall'],
            [/\\$/, 'string']
        ],
        dblStringBody: [
            [/[^\\"]+$/, 'string', '@popall'],
            [/[^\\"]+/, 'string'],
            [/\\./, 'string'],
            [/"/, 'string.escape', '@popall'],
            [/\\$/, 'string']
        ]
    }
};