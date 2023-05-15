#!/usr/bin/python
from os import system
import json

# Get the JSON
with open("languages.json", 'r') as file:
    dic = json.load(file)

for k,_ in dic.items():
    system(f'./build.sh {k}')
