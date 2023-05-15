from json import dump

content = ""

with open("src/style/Variables.scss", 'r') as f:
    content = f.read().split("\n")


# Get the start of 
line_index = 0
while not ":root" in content[line_index]:
    line_index += 1
    


dic = {}
# When it's the start
while not "}" in content[line_index]:
    if "//" in content[line_index] or content[line_index].isspace():
        pass
    elif "--" in content[line_index]:
        name_var = content[line_index].split(":")[0].strip()
        hsl = content[line_index].split(":")[1].strip(";").strip().replace("120", "n")

        if "hsl" in content[line_index]:
            last_elem = f'[{content[line_index].split(",")[2].split(")")[0].strip(",").strip("%").strip()}]%';
            print(last_elem)
            hsl = ",".join(hsl.split(",")[:2]) + "," + last_elem

            if content[line_index].count(",") == 3:
                hsl += "," + content[line_index].split(",")[-1]
            else:
                hsl += ");"

        dic[name_var] = hsl.strip(";")
    else: # Shouldn't appen
        pass

    line_index += 1


with open("src/data/themeCorrespondance.json", "w") as f:
    dump(dic, f, indent = 4)