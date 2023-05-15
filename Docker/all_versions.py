#!/usr/bin/python
from subprocess import run
import json
from tqdm import tqdm
from re import search

# Get the JSON
with open("languages.json", 'r') as file:
    dic = json.load(file)

# Dic with all the answers
versions: dict[str, str] = {}

# For each languages
for k,v in tqdm(dic.items()):
    # run the command and capture the output
    result = run(['./version.sh', k], capture_output=True, text=True)

    version_str: str = ""

    match_regex = search(v.get("regex", "\\d+\\.\\d+\\.\\d+"), result.stdout + result.stderr)
    if match_regex:
        version_str = match_regex.group(0)

    versions[k] = version_str


json.dump(versions, open("versions.json", "wt"), indent=4)
