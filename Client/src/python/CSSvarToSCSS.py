content = ""

with open("src/style/Variables.scss", 'r') as f:
    content = f.read().split("\n")


# Get the start of 
line_index = 0
while not ":root" in content[line_index]:
    line_index += 1
    


new_lines = []
# When it's the start
while not "}" in content[line_index]:
    if "//" in content[line_index] or content[line_index].isspace():
        new_lines.append(content[line_index].lstrip())
    elif "--" in content[line_index]:
        name_var = content[line_index].split(":")[0].strip().replace("--","")
        new_lines.append(
            f"${name_var}: var(--{name_var});"
        )
    else: # Shouldn't appen
        pass

    line_index += 1


content = content[:line_index + 1] + [""] + new_lines + [""] + content[line_index + 2 :]
*content, = map(lambda l: l + "\n", content)
open("src/style/Variables.scss", 'w').writelines(content) 