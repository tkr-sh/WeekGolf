# FILES
f = open("description.md", "r", encoding="utf8").read()
open("description.json","w", encoding="utf8").write("") # Destroy the file
f_write = open("description.json","a", encoding="utf8") # Create a new one


# Spliting the file by langs
lang = f.split("<!--")[1:]
f_write.write("{\n")

for e in lang:
    lang_split = e.split("##")
    lang_name = lang_split[0].split("\n#")[1].strip()
    lang_split = [*map(lambda s: "\n".join(s.split("\n")[1:]).strip().replace('"',"\\\"").replace('\n',"\\n"), lang_split)]

    f_write.write(f"""\t\"{lang_name}\" : {{
\t\t\"history\" : \"{lang_split[1]}\",
\t\t\"characteristics\" : \"{lang_split[2]}\",
\t\t\"program\" : \"""" + '\\n'.join(map(lambda s:s[1:],(' '+lang_split[3]).replace(" "*4,"\t").split('\\n'))).replace("\t", " "*4).replace("\\\"",'"').replace('"',"\\\"") + """\"
\t}"""+(",\n" if e != lang[-1] else "")+"\n")

f_write.write("}")
f_write.close()