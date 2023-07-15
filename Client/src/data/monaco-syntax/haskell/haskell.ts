export const language = {
 module: /^(module)\b/,
 import: /^(import)\b/,
 module_name: /([A-Z][\w'']*)(\.[A-Z][\w'']*)*/,
 module_exports:/([A-Z][\w'']*)(\.[A-Z][\w'']*)*/,
 target:/([A-Z][\w'']*)(\.[A-Z][\w'']*)*/,
 invalid:/[a-z]+/,
 datatype:/[A-Z][\w]+/,
 datatypekey:/Int|Float|Text|Int16|Int64|Double|Char|Text|CI Text|ByteString|Bool|Day|UTCTime|LocalTime|TimeOfDay|Value|Json|JsonStr|UUID|Maybe|Vector|CustomType|GenInnerTy|Rep/,
 functions:/[a-z]+/,
 datacons:/[A-Z][\w]+/,
 typcons:/\s*[A-Z][\w]+/,
 text:/[A-Z][\w]+/,
 classname:/\s*[A-Z][\w]+/,
 arguments:/[a-z][\w]*/,
 typevar:/[a-z][\w]+/,
 reservedid:/qualified|hiding|case|default|deriving|do|else|if|import|in|infix|infixr|let|of|then|type|where|show|_/,
   tokenizer: {
      root :[ 
              [/(@module)/, 'keyword.module.haskell', '@module'],
              [/@import/, 'keyword.module.haskell', '@import'],
              [/\btype instance\b/,'keyword','@typeinstance'],
              [/\btype family\b/,'keyword','@typefamily'],
              [/\bdata\b(?=@typcons)/,'keyword','@typcons'],
              [/\bnewtype\b(?=\s*@typcons)/,'keyword','@typcons'],
              [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
              [/\bclass\b(?=\s*\()/,'keyword','@classname'],
              [/@reservedid/,'keyword'],
               [/[a-z][\w]+(?=\s*?\=)/,'binderas','@binder'],
                [/[a-z][\w]+(?=\s*\:\:)/,'binderad','@typconss'],
               [/[a-z][\w]+(?=\s*?[a-z]\w*)/,'binder','@typconss'],
                [/[a-z][\w]+(?=\s*?\:\:\s*?@datatypekey)/,'bind','@binder'],
                [/[a-z][\w]+(?=\s*?\=\s*?@datacons)/,'bindings'],
              {include:'@whitespace'},
              {include:'@comment'}
              
                    ],
      import :[
              [/@module_name/,'storage.module,haskell'],
              [/(@module_name)(?=\s*as)/, 'storage.module.haskell'],  
              [/\b(qualified)\b(?=\s*@module_name)/, 'keyword'],
              [/(@module_name)(?=\s*?\()/, 'storage.module.haskell'],
              [/(@module_name)(?=\s*\bhiding\b)/, 'storage.module.haskell'],
              [/\b(hiding)\b(?=\s*?\()/, 'keyword'],
              [/\b(as)\b(?=\s*@module_name)/,'keyword'],
              [/\(/,'openbracketss','@functions'],
              {include:'@comment'}
              //{include:'@blockComment'}
      ],
       module :[
              [/(@module_name)/, 'storage.module.haskell'],
              [/\(/, 'openbracket','@module_exports'],
                 [/@reservedid/,'keyword','@pop'],
                 [/@invalid/,'invalid'],
                 [/\,/,'commas'],
              {include:'@whitespace'},
              {include:'@comment'}
              //{include:'@blockComment'}
              ],
      functions :[
                  [/@datatype/,'dcataype','@datatype'],
                  [/@functions/,'functions'],
                  [/\,/,'commas'],
                  [/\)(?=\))/,'closebracket'],
                  [/\)/,'closebracketalla','@popall'],
                  {include:'@comment'}
              //{include:'@blockComment'}

      ],
      
typconss :[
[/\=/,'eqals'],
[/\bundefined\b/,'val','@all'],
[/\btype instance\b/,'keyword','@typeinstance'],
[/\btype family\b/,'keyword','@typefamily'],
 [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
      [/\bclass\b(?=\s*\()/,'keyword','@classname'],
 [/\binstance\b/,'keyword','@classname'],  
  [/\bdata\b(?=@typcons)/,'keyword','@typcons'],
      [/\bnewtype\b(?=\s*@typcons)/,'keyword','@typcons'],
          [/@reservedid/,'keyword','@function'],
           [/[a-z]\w*/,'arguments121'],
           [/[a-z][\w]+(?=\s*?\=\s*?@datacons)/,'bindings','@initialise'],
             [/[a-z][\w]+(?=\s*\=)/,'binderad','@datacons'],
             [/[a-z][\w]+(?=\s*\:\:)/,'binderad','@typconss'],
              [/[a-z][\w]+(?=\s*[a-z]\w*)/,'binderad','@typconss'],
[/\=/,'equals','@all'],
[/\)(?=\s*\:\:)/,'close','@typefamily'],
[/\:\:/,'dcol','@typcons'],
[/\-\>/,'pipes','@bind'],
{include:'@whitespace'},
{include:'@comment'}
//{include:'@blockComment'}

],

function :[
      [/@reservedid/,'keyword'],
       [/@datatypekey/,'dtype'],
       [/[a-z][\w]+(?=\s*\:\:)/,'binderad','@typconss'],
       [/[a-z][\w]+(?=\s*?[a-z]\w*)/,'binder','@typconss'],
       [/[a-z]\w*/,'arguments12'],
       [/\:\:/,'dcol'],
       [/\-\>/,'pipe'],
       [/\btype instance\b/,'keyword','@typeinstance'],
       [/\btype family\b/,'keyword','@typefamily'],
         [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
      [/\bclass\b(?=\s*\()/,'keyword','@classname'],
 [/\binstance\b/,'keyword','@classname'],  
  [/\bdata\b(?=@typcons)/,'keyword','@typcons'],
      [/\bnewtype\b(?=\s*@typcons)/,'keyword'], 
      {include:'@comment'}
      //{include:'@blockComment'}  
    ],

  typcons :[
  [/\=\>/,'pipes'],
       [/\-\>/,'pipe','@bind'],
       [/\btype instance\b/,'keyword','@typeinstance'],
       [/\btype family\b/,'keyword','@typefamily'],
       [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
      [/\bclass\b(?=\s*\()/,'keyword','@classname'],
 [/\binstance\b/,'keyword','@classname'],  
  [/\bdata\b(?=@typcons)/,'keyword','@typcons'],
      [/\bnewtype\b(?=\s*@typcons)/,'keyword'],
 [/@reservedid(?=\s*\()/,'keyword','@typcons'],
      [/@reservedid(?=\s*[A-Z][\w]+)/,'keyword','@typcons'],
       [/@reservedid/,'keyword','@binder'],  
       [/@datatypekey(?=\s*[a-z][\w]*)/,'dtypes','@types'],
       [/@datatypekey/,'dtypes2'],
        [/[A-Z][\w]+(?=\s*?[a-z][\w]*\,)/,'classname','@types'],
        [/[A-Z][\w]+(?=\s*\,)/,'classname','@types'],
      [/[A-Z][\w]+(?=\s*[a-z]\w*\s*?\,)/,'classname','@types'],
       [/[A-Z][\w]+(?=\s*[a-z]\w*\s*?[a-z]\w*\s*?\,)/,'classname','@types'],
      [/[A-Z][\w]+(?=\s*[a-z]\w*\s*?[a-z]\w*\s*?[a-z]\w*\s*?\,)/,'classname','@types'],
      [/[A-Z][\w]+(?=\s*[a-z]\w*\s*?[a-z]\w*\s*?[a-z]\w*\s*?[a-z]\w*\s*?\,)/,'classname','@types'],     
      [/[A-Z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\,)/,'classname','@types'],
      [/[A-Z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*\,)/,'classname','@types'],
        
     //  [/@arguments(?=\s*\,\s*)/,'argument','@types'],
      [/[A-Z][\w]+/,'typecons'],
      [/[a-z][\w]+(?=\s*?\=)/,'binderas','@binder'],
      [/[a-z][\w]+(?=\s*\:\:)/,'binderad','@typconss'],
       

[/[a-z][\w]+(?=\s*?[a-z]\w*)/,'binderer','@typconss'],
       //[/[a-z][\w]+(?=\s*?[a-z]\w*)/,'bind','@typconss'],
      [/[a-z][\w]+(?=\s*?\:\:\s*?@datatypekey)/,'bind','@binder'],
       [/[a-z][\w]+(?=\s*?\=\s*?@datacons)/,'bindings'],
             [/\{/,'oopen','@initialise'],
          [/[a-z]\w*/,'arguments13'],
   [/\(/,'open_bracket'],
      [/\=/,'Equalss','@datacons'],
      [/\,/,'commaa'],
      [/\:\:/,'colondouble','@datacons'],
      [/\)/,'closebrak','@initialise'],
      [/\}/,'close'],
      [/\)(?=\s* \t\r\n\bdata\b)/,'closed','@popall'],
      {include:'@whitespace'},
       {include:'@comment'}
      //        {include:'@blockComment'}
      ],

      typeinstance:[
             [/@datatypekey(?=\s*[A-Z][\w]*)/,'dty','typfam'],
               [/@datatypekey/,'dty'],
               [/\btype instance\b/,'keyword','@typeinstance'],
               [/\btype family\b/,'keyword','@typefamily'],
       [/\bdata\b(?=@typcons)/,'keyword','@typcons'],
              [/\bnewtype\b(?=\s*@typcons)/,'keyword','@typcons'],
              [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
              [/\bclass\b(?=\s*\()/,'keyword','@classname'],
         [/\binstance\b/,'keyword','@classname'],  
         [/[A-Z][\w]*/,'typefamilyname'],
         [/[a-z][\w]+(?=\s*?\=\s*?@datacons)/,'bindings','@initialise'],
         [/[a-z][\w]*(?=\s*?\:\:)/,'binder'],
        [/[a-z][\w]+(?=\s*?\=\s*(\d)+\,)/,'binderc','@binder'],
       [/[a-z][\w]+(?=\s*?\=\s*\"(\w)+.+?\")/,'bindere','@binder'],
         [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?\:\:)/,'cl1','@typconss'],
         [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
       [/\(/,'open'],
       [/\,/,'comma'],
         [/\:\:/,'ddcol'],
         [/\*(?=\s*?\))/,'var','typfam'],
         [/\:\:(?=\s*?\*)/,'var','typfam'],
         [/\*/,'var'],
         [/\-\>/,'pipe','@bind'],
          [/\=/,'equals'],
           [/\}/,'close'],
     
         [/\)/,'closeee'],
         
        
        
         [/[a-z][\w]*/,'arguments'],
         {include:'@whitespace'},

            ],
      
      typefamily:[
          [/@datatypekey/,'dty'],
        [/\btype instance\b/,'keyword','@typeinstance'],
       [/\bdata\b(?=@typcons)/,'keyword','@typcons'],
              [/\bnewtype\b(?=\s*@typcons)/,'keyword','@typcons'],
              [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
              [/\bclass\b(?=\s*\()/,'keyword','@classname'],
         [/\binstance\b/,'keyword','@classname'],  
         [/[A-Z][\w]*/,'typefamilyname'],
         [/[a-z][\w]+(?=\s*?\=\s*?@datacons)/,'bindings','@initialise'],
         [/[a-z][\w]*(?=\s*?\:\:)/,'binder'],
        [/[a-z][\w]+(?=\s*?\=\s*(\d)+\,)/,'binderc','@binder'],
       [/[a-z][\w]+(?=\s*?\=\s*\"(\w)+.+?\")/,'bindere','@binder'],
         [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?\:\:)/,'cl1','@typconss'],
         [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'cl','@typconss'],
       [/\(/,'open'],
       [/\,/,'comma'],
         [/\:\:/,'ddcol'],
         [/\*/,'var'],
         [/\-\>/,'pipe','@bind'],
          [/\=/,'equals'],
           [/\}/,'close'],
     
         [/\)/,'closeee'],
         
         //[/@reservedid(?=\s*[A-Z][\w]*)/,'keyword','@typefamily'],
         [/@reservedid/,'keyword','@typfam'],
         [/[a-z][\w]*/,'arguments'],
         {include:'@whitespace'},
      ],
      typfam:[
      [/\btype instance\b/,'keyword','@typeinstance'],
 [/\btype family\b/,'keyword','@typefamily'],
      [/\bdata\b(?=@typcons)/,'keyword','@typcons'],
              [/\bnewtype\b(?=\s*@typcons)/,'keyword','@typcons'],
              [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
              [/\bclass\b(?=\s*\()/,'keyword','@classname'],
              [/\binstance\b/,'keyword','@classname'],  
      [/@datatypekey/,'dty'],
      [/@reservedid/,'keyword','@typefamily'],
      [/[A-Z][\w]*/,'typefamilyname'],
      [/\=/,'equals'],
       [/[a-z][\w]*/,'names'],
      [/\(/,'open'],
      [/\)/,'close','@pop'],
        ],

      bind:[
      [/\btype instance\b/,'keyword','@typeinstance'],
       [/\btype family\b/,'keyword','@typefamily'],
       [/\bdata\b(?=@typcons)/,'keyword','@typcons'],
              [/\bnewtype\b(?=\s*@typcons)/,'keyword','@typcons'],
              [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
              [/\bclass\b(?=\s*\()/,'keyword','@classname'],
              [/\binstance\b/,'keyword','@classname'],
              [/@datatypekey(?=\s*?[a-z][\w]*)/,'dtyp1','@disk'],
               [/@datatypekey/,'dtyp','@dom'],
                
               [/[a-z][\w]+(?=\s*[a-z]\w*\s*?\:\:)/,'binderad','@typconss'],
               [/\-\>(?=\s*?[a-z][\w]*)/,'typvarfdas','@disk'],    
               [/\-\>/,'pipe'],
               [/[a-z][\w]*/,'typvar','@dom'],
                 [/\(/,'opens','@typcons'],
                 {include:'@whitespace'},
                 {include:'@comment'}
      ],
      disk:[
      [/\btype instance\b/,'keyword','@typeinstance'],
       [/\btype family\b/,'keyword','@typefamily'],
       [/\bdata\b(?=@typcons)/,'keyword','@typcons'],
              [/\bnewtype\b(?=\s*@typcons)/,'keyword','@typcons'],
              [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
              [/\bclass\b(?=\s*\()/,'keyword','@classname'],
              [/\binstance\b/,'keyword','@classname'],
         [/[a-z][\w]+(?=\s*[a-z]\w*\s*?\:\:)/,'binderad','@typconss'],
         [/[a-z][\w]+(?=\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\:\:)/,'binderad','@typconss'],
         [/[a-z][\w]+(?=\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\:\:)/,'binderad','@typconss'],
         [/[a-z][\w]+(?=\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\:\:)/,'binderad','@typconss'],
         [/[a-z][\w]+(?=\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\:\:)/,'binderad','@typconss'],
         [/[a-z][\w]+(?=\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\:\:)/,'binderad','@typconss'],
         [/[a-z][\w]+(?=\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\:\:)/,'binderad','@typconss'],
         [/[a-z][\w]+(?=\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\:\:)/,'binderad','@typconss'],
         [/[a-z][\w]+(?=\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\:\:)/,'binderad','@typconss'],
         [/[a-z][\w]+(?=\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\s*[a-z]\w*\s*?\:\:)/,'binderad','@typconss'],
               
   
                   
      [/[a-z][\w]+(?=\s*\:\:)/,'binderad','@typconss'],
      [/[a-z][\w]+(?=\s*?[a-z]\w*\s*?[a-z]\w*\s*?[a-z]\w*\s*?[a-z]\w*\s*[a-z]\w*\s*?\:\:)/,'biinderad','@typconss'],
 [/[a-z][\w]*/,'argument23'],
       [/[a-z][\w]*/,'typvar','@dom'],
      [/\-\>/,'pp','@bind']

      ],
      dom:[
      [/\btype instance\b/,'keyword','@typeinstance'],
 [/\btype family\b/,'keyword','@typefamily'],
       [/\bdata\b(?=@typcons)/,'keyword','@typcons'],
              [/\bnewtype\b(?=\s*@typcons)/,'keyword','@typcons'],
              [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
              [/\bclass\b(?=\s*\()/,'keyword','@classname'],
              [/\binstance\b/,'keyword','@classname'],
      [/[a-z][\w]+(?=\s*?\=\s*?@datacons)/,'bindings','@initialise'],
            
      [/[a-z][\w]+(?=\s*\=)/,'binderad1','@typconss'],
               [/[a-z][\w]*(?=\s*?[a-z][\w]*\=)/,'binderad1','@typconss'],
     [/[a-z][\w]+(?=\s*?[a-z][\w]*?[a-z][\w]*\=)/,'binderad1','@typconss'],
     [/[a-z][\w]+(?=\s*?[a-z][\w]*?[a-z][\w]*?[a-z][\w]*\=)/,'binderad1','@typconss'],
     [/@reservedid/,'keyword'],
      
      [/[a-z][\w]*(?=\s*[a-z][\w]*\=)/,'binderad1','@typconss'],
      
      [/[a-z][\w]+(?=\s*\:\:)/,'binderad1','@typconss'],
      [/[a-z][\w]+(?=\s*[a-z]\w*\s*?\:\:)/,'binderad2','@typconss'],
       [/[a-z][\w]+(?=\s*[a-z]\w*\s*?[a-z]\w*\s*?\:\:)/,'binderad3','@typconss'],
      [/[a-z][\w]+(?=\s*[a-z]\w*\s*?[a-z]\w*\s*?[a-z]\w*\s*?\:\:)/,'binderad4','@typconss'],
      [/[a-z][\w]+(?=\s*[a-z]\w*\s*?[a-z]\w*\s*?[a-z]\w*\s*?[a-z]\w*\s*?\:\:)/,'binderad5','@typconss'],     
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?\:\:)/,'biinderad6','@typconss'],
      [/[a-z][\w]*(?=\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*?[a-z][\w]*\s*\:\:)/,'biinderad7','@typconss'],
      

            [/[a-z][\w]*/,'argument33'],
            [/[\=]/,'equals'],
            [/\-\>/,'pp','@bind'],
           [/\)(?=\s*\:\:)/,'close','@typefamily']


      ],
        types:[ 
        [/\btype instance\b/,'keyword','@typeinstance'],
         [/\btype family\b/,'keyword','@typefamily'],
         [/\bdata\b(?=@typcons)/,'keyword','@typcons'],
              [/\bnewtype\b(?=\s*@typcons)/,'keyword','@typcons'],
              [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
              [/\bclass\b(?=\s*\()/,'keyword','@classname'],
              [/\binstance\b/,'keyword','@classname'],
       [/[a-z][\w]*/,'argument123'],
       [/\,/,'commaa'],
       [/[A-Z][\w]*/,'classname'],
       [/\)/,'closex'],
       [/\=\>/,'pipe','@type'],
       [/\-\>/,'pipe','@bind'],
       {include:'@whitespace'},
       {include:'@comment'}
      //{include:'@blockComment'}
      ],
      datacons :[
      [/\=/,'Equalst'],
        [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
         [/\bclass\b(?=\s*\()/,'keyword','@classname'],
         [/\btype instance\b/,'keyword','@typeinstance'],
       [/\btype family\b/,'keyword','@typefamily'],
      [/\bundefined\b/,'val','@all'],
      [/\bnewtype\b(?=\s*@typcons)/,'keyword','@typcons'],
       [/\binstance\b/,'keyword','@classname'], 
        [/[a-z][\w]*(?=\s*?\-\>)/,'typvar','@typcons'],
         [/@reservedid(?=\s*\()/,'keyword','@typcons'],
        [/@datatypekey(?=\s*[a-z]\w*)/,'dtypess1','@typcons'],
      [/@datatypekey/,'dtypes1'],
       [/@reservedid(?=\s*[A-Z][\w]+)/,'keyword','@typcons'],
        [/@reservedid/,'keyword'],
        [/[A-Z][\w]+(?=\s*\=\>)/,'classname','@type'],
        [/[A-Z][\w]+(?=\s*[a-z][\w]*\s*\=\>)/,'classnames','@type'],
        [/[a-z][\w]+(?=\s*?\:\:)/,'bindera','@typconss'],
        [/[a-z][\w]+(?=\s*?[a-z]\w*)/,'bindeeqw','@typconss'],
         [/[a-z][\w]*/,'binder','@typconss'],
          [/\bdata\b(?=@typcons)/,'keyword','@typcons'],       
       [/@datacons/,'datacon'],
       [/@reservedid/,'keyword','@binder'],  
      [/@datacons(?=\s*@datatypekey)/,'datacons'],
        [/[a-z][\w]+(?=\s*?\:\:\s*@datatype\,)/,'bindera','@binder'],
        [/[a-z][\w]+(?=\s*?\:\:\s*@datatype\,)/,'bindera','@binder'],
         [/[a-z][\w]+(?=\s*?\=\s*(\d)+\,)/,'binderb','@binder'],
      [/[a-z][\w]+(?=\s*?\=\s*(\d)+)/,'binderc','@binder'],
      [/[a-z][\w]+(?=\s*?\=\s*\"(\w)+.+?\")/,'binderd','@binder'],
      [/[a-z][\w]+(?=\s*?\=\s*\"(\w)+.+?\"\,)/,'bindere','@binder'],
      [/\{/,'openbracketd','@initialise'],
      [/\"\w+.+\"/,'type'], 
      [/\d+/,'type'],
      [/\-\>/,'pip','@binder'],      
      [/\,/,'commas33','@initialise'],
       [/\|/,'alternate'],
       [/\(/,'open','@typcons'],  
       [/\}/,'clos','@initialise'],
       {include:'@whitespace'},
      {include:'@comment'}
      //{include:'@blockComment'}

   ],
   type:[
        [/[a-z][\w]*/,'argument'],
        [/\,/,'commas'],
        [/\=\>/,'pipe'],
        [/[A-Z][\w]*/,'typcons','@types'],
        [/\-\>/,'pipe','@binder'],
         {include:'@whitespace'},
        {include:'@comment'}
        //{include:'@blockComment'}   
   ],
   all :[
   [/\=/,'equals'],
  [/\binstance\b/,'keyword','@classname'], 
       [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
         [/\bclass\b(?=\s*\()/,'keyword','@classname'],
          [/\bdata\b(?=@typcons)/,'keyword','@typcons'],
          [/\btype instance\b/,'keyword','@typeinstance'],
          [/\btype family\b/,'keyword','@typefamily'],
         [/\bnewtype\b(?=\s*@typcons)/,'keyword'],
          [/@reservedid/,'keyword','@typconss'],
         [/[A-Z][\w]+/,'typecons','@typcons'],
         [/[a-z][\w]+(?=\s*\=)/,'binderad','@typconss'],
             [/[a-z][\w]+(?=\s*\:\:)/,'binderad','@typconss'],
         [/[a-z][\w]+(?=\s*?[a-z]\w*)/,'binder','@typconss'],
                   {include:'@comment'}
            //  {include:'@blockComment'}
        
      
   ],
      selectors :[
      [/[a-z][\w]+/,'selectors'],
      [/\=/,'Equalsto','@datacons'],
       [/\"(\w)+.+\"/,'type'],
       [/\d+/,'type'],
       [/\}/,'closeS'],
      {include:'@comment'}
     // {include:'@blockComment'}
      ],
      initialise :[
      [/\btype instance\b/,'keyword','@typeinstance'],
      [/\btype family\b/,'keyword','@typefamily'],
       [/\binstance\b/,'keyword','@classname'],
      [/\bdata\b(?=\s*@typcons)/,'keyword','@typcons'], 
      [/\bnewtype\b(?=\s*@typcons)/,'keyword','@typcons'], 
      [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
      [/\bclass\b(?=\s*\()/,'keyword','@classname'],
      [/@datatypekey(?=\s*)/,'datatype'],
      [/\{/,'open'],
      [/@reservedid/,'keyword'],
      [/\(/,'opn','@typcons'],
       [/\|/,'alternates','@datacons'],
      [/\,/,'comma3'],
     [/[a-z][\w]+(?=\s*?\=\s*?\b@reservedid\b)/,'binder','@all'], 
      [/[a-z][\w]+(?=\s*?\=\s*?\bundefined\b)/,'binder','@binder'],
      [/[a-z][\w]+(?=\s*?\=\s*?@datacons)/,'bindings'],
       [/[a-z][\w]+(?=\s*?\:\:\s*@datatypekey)/,'binderaa','@typconss'],
       [/[a-z][\w]+(?=\s*\:\:)/,'binder','@binder'],
     [/[a-z][\w]+(?=\s*?\:\:\s*@datatypekey\,)/,'binderb','@binder'],
      [/[a-z][\w]+(?=\s*?\=\s*(\d)+\,)/,'binderc','@binder'],
      [/[a-z][\w]+(?=\s*?\=\s*(\d)*)/,'binderd','@binder'],
       [/[a-z][\w]+(?=\s*?\=\s*\"(\w)+.+?\"\,)/,'binders','@binder'],
            [/[a-z][\w]+(?=\s*?\=\s*\"(\w)+.+?\")/,'bindere','@binder'],
         [/[a-z][\w]+(?=\s*[a-z]\w*)/,'binderqwe','@typconss'], 
         [/\:\:/,'doublecolons','@datacons'],
      [/\=/,'Equalsto','@datacons'],
      {include:'@whitespace'},
      {include:'@comment'}
      //{include:'@blockComment'}
      ],
      classname :[
      [/\btype instance\b/,'keyword','@typeinstance'],
       [/\btype family\b/,'keyword','@typefamily'], 
      [/\binstance\b/,'keyword','@classname'], 
       [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
      [/\bclass\b(?=\s*\()/,'keyword','@classname'],
       [/\bdata\b(?=\s*?@typcons)/,'keyword','@typcons'],
       [/\bnewtype\b(?=\s*@typcons)/,'keyword','@typcons'],
       [/[a-z][\w]+(?=\s*?\=)/,'binderas','@binder'],   
      [/[a-z][\w]+(?=\s*?\:\:\s*?@datatypekey)/,'binderas','@binder'],
      [/@datatypekey/,'dtype'],
      [/[A-Z][\w]*/,'classname'],
      [/@reservedid/,'keyword','@typcons'],
      [/[a-z]\w*/,'arguments'],
      [/\,/,'commas'],
      [/\(/,  'openbracket'],
      [/\)/,'closebracket'],
      [/\=\>/,'pipe','@superclass'],
      {include:'@whitespace'},
      {include:'@comment'}
      //{include:'@blockComment'}
      ],
      binder :[
      [/\btype instance\b/,'keyword','@typeinstance'],
      [/\btype family\b/,'keyword','@typefamily'],
       [/\binstance\b/,'keyword','@classname'], 
       [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
      [/\bclass\b(?=\s*\()/,'keyword','@classname'],
       [/\bdata\b(?=\s*?@typcons)/,'keyword','@typcons'],
        [/@reservedid/,'keyword'],
        [/[a-z][\w]+(?=\s*\:\:)/,'binder'],
        [/[a-z][\w]+(?=\s*\=)/,'binder'],    
         [/\:\:/,'doublecolons','@datacons'],
        [/@datatypekey(?=\s*[a-z]\w*)/,'dtypes','@typcons'],
       [/@datatypekey/,'dtypess'],
        [/\bnewtype\b(?=\s*@typcons)/,'keyword','@typcons'],
       [/\-\>/,'pipe'],
       [/\d+/,'digit'],
       [/\{/,'open'],
       [/\=/,'Equalsto','@datacons'],
      [/\(/,'opn','@typcons'],
       [/\|/,'alternates','@datacons'],
      [/\,/,'comma3'],

[/[a-z][\w]*(?=\s*[a-z][\w]*)/,'blii','@typconss'],

       [/[a-z][\w]*/,'typvar','@typconss'],
      [/\bclass\b(?=\s*@classname)/,'keyword','@classname'],
      [/\bclass\b(?=\s*\()/,'keyword','@classname'],
      [/\binstance\b/,'keyword','@classname'],  
       [/\bundefined\b/,'value'],
        {include:'@whitespace'},
        {include:'@comment'}
        //{include:'@blockComment'}
      ],
      superclass :[
      [/[A-Z][\w]+/,'typeclass'],
      [/@reservedid/,'keyword','@typcons'],
      [/[a-z][\w]*/,'typearguments'],
      {include:'@whitespace'},
              {include:'@comment'}
              //{include:'@blockComment'}
      ],
      argument:[
           [/[a-z][\w]*(?=\s*\-\>)/,'argument'],
           [/\-\>/,'pipea','@binder'],
          {include:'@whitespace'},
              {include:'@comment'}
              //{include:'@blockComment'}
           
],
    

      datatype :[
                [/\(/,'openbracketd','@pop'],
             {include:'@comment'}
              //{include:'@blockComment'}
      ],
       module_exports :[
               [/(@module_exports)/,'storage.module.haskell'],
               [/\(/,'openbracket','@target'],
               [/\)/,'closebracket','@popall'],
               [/\,/,'comma1'],
               [/@invalid/,'invalid'],
                {include:'@whitespace'},
                {include:'@comment'}
                //{include:'@blockcomment'}

                 
       ],



       target :[ 
                [/(@target)/,'target'],
                [/\,/,'comma2'],
                [/\)/,'closebracket','@pop'],
              {include:'@comment'}
     //         {include:'@blockComment'}


       ],
       whitespace :[
                   [/\t\r\n/,'whitespace'], 
                   [/\s*/,'whitespace']

        ],
        comment :[
                  [/\-\-\w+/,'punctuation.comment.haskell'],
                    {include:'@whitespace'},
                    ],
        Block_comment :[
                   [/\{\-/,'punctuation.comment.haskell'],
                   [/\-\}/,'comment.block.haskell'],
                    {include:'@whitespace'}
  ],
        }
  };



  
export const conf = {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  brackets: [['{','}'],['[',']'],['(',')'],['<','>']],
  autoClosingPairs: [
    { open: '"', close: '"', notIn: ['string', 'comment'] },
    { open: '\'', close: '\'', notIn: ['string', 'comment'] },
    { open: '{', close: '}', notIn: ['string', 'comment'] },
    { open: '[', close: ']', notIn: ['string', 'comment'] },
    { open: '(', close: ')', notIn: ['string', 'comment'] },
    { open: '<', close: '>', notIn: ['string', 'comment'] },
  ]
};