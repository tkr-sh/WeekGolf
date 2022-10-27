# FILES
f = open("description.md", "r", encoding="utf8").read()


# Spliting the file by langs
lang = f.split("<!--")[1:]



def langToExtension(lang: str) -> str:

    """ This function converts a lang to an extension for discord """

    lang = lang.lower()

    dic = {
        "bash" : "bash",
        "c" : "c",
        "c++" : "cpp",
        "clojure" : "clj",
        "c#" : "cs",
        "elixir" : "erl",
        "go" : "go",
        "haskell" : "hs",
        "java" : "java",
        "js" : "js",
        "julia" : "py",
        "kotlin" : "kt",
        "lua" : "lua",
        "ocaml" : "ml",
        "perl" : "pl",
        "php" : "php",
        "python" : "py",
        "r" : "r",
        "raku": "pl",
        "ruby" : "rb",
        "rust" : "rs"
    }

    return dic.get(lang, "")


for e in lang:
    lang_split = e.split("##")
    lang_name = lang_split[0].split("\n#")[1].strip()
    lang_split = [*map(lambda s: "\n".join(s.split("\n")[1:]).strip().replace('"',"\\\"").replace('\n',"\\n"), lang_split)]

    print('"```'+langToExtension(lang_name)+"\\n"+'\\n'.join(map(lambda s:s[1:],(' '+lang_split[3]).replace(" "*4,"\t").split('\\n'))).replace("\t", "\\t").replace("\\\"",'"').replace('"',"\\\"") + "```\":"+f" \"{lang_name}\",")
