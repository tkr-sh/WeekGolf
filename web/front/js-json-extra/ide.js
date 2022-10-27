let mainIde = ace.edit("mainIde");
const correspondance = {
    "Apl": "apl",
    "Bash": "sh",
    "C++": "c_cpp",
    "C": "c_cpp",
    "C#": "csharp",
    "Clojure":"clojure",
    "Elixir":"elixir",
    "Go":"golang",
    "Golfscript": "golfscript",
    "Haskell":"haskell",
    "Java":"java",
    "Julia":"julia",
    "K":"php", // TODO
    "J": "j",
    "Jelly": "jelly",
    "Kotlin":"kotlin",
    "Lua":"lua",
    "Javascript": "javascript",
    "Ocaml":"ocaml",
    "Perl": "perl",
    "Php": "php",
    "Prolog": "prolog",
    "Python": "python",
    "R": "r",
    "Ruby": "ruby",
    "Rust": "rust",
    "Vyxal": "vyxal"
}

function resizingMain(){

    window.onload = function(){
        mainIde = ace.edit("mainIde");
        mainIde.setTheme("ace/theme/monokai");
        console.log(localStorage.selectedLanguage)
        console.log(correspondance[localStorage.selectedLanguage.toUpperCase()[0] + localStorage.selectedLanguage.substring(1)])
        mainIde.session.setMode(`ace/mode/${correspondance[localStorage.selectedLanguage.toUpperCase()[0] + localStorage.selectedLanguage.substring(1)]}`);

        mainIde.setOptions ({
            fontFamily: "monospace",
            fontSize: 20,
            animatedScroll: true,
            maxLines: Infinity,
            copyWithEmptySelection: true
        });
    }
    
}

resizingMain();


function solutions(lang){
    let solutionIdeN = document.getElementById("solution_ide_0");
    let i = 0;
    while (solutionIdeN != null){
        
        let editor = ace.edit(solutionIdeN);
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode(`ace/mode/${lang}`);
        
        editor.setOptions ({
            fontFamily: "monospace",
            fontSize: 18,
            animatedScroll: true
            
        });
        
        i++;
        solutionIdeN = document.getElementById(`solution_ide_${i}`);
    }
}

setTimeout('solutions("python")', 1000);



function solutiondN(lang, n, str){
    
    if (lang === 'c' || lang === 'cpp'){
        lang = "c_cpp"; 
    }

    console.log(str);
    str = str.replace("\\n","\\\\n");

    let solutionIdeN = document.getElementById("solution_ide_" + n);

    editor = ace.edit(solutionIdeN);
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode(`ace/mode/${lang.replace("cs", "csharp").replace("node", "javascript")}`);
    editor.setValue(str, 1);
    editor.session.setUseWorker(false);
    editor.setShowPrintMargin(false);
    editor.setReadOnly(true);

    
    editor.setOptions ({
        fontFamily: "monospace",
        fontSize: 18,
        animatedScroll: true
        
    });
}