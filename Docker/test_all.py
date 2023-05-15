#!/usr/bin/python
from subprocess import run
import json
from time import time


# Get the JSON
with open("languages.json", 'r') as file:
    dic = json.load(file)

def unit(n):
    if n > 1:
        return f"{round(n,2)}s"
    else:
        return f"{round(n*1000,2)}ms"

for k,_ in dic.items():
    start_time = time()
    result = run(['./test.sh', k], capture_output=True, text=True)
    end_time = time()

    if "SUCCESS" in result.stdout:
        print("UP",k,unit(end_time - start_time))
    else:
        print("DOWN",k)

    # print(result)
