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

status = {}
for k,_ in dic.items():
    start_time = time()
    result = run(['./test.sh', k], capture_output=True, text=True)
    end_time = time()

    if "SUCCESS" in result.stdout:
        print("UP",k,unit(end_time - start_time))
    else:
        print("DOWN",k)

    status[k] = round((end_time - start_time) * 1000, 2) if "SUCCESS" in result.stdout else -1

json.dump
json.dump(status, open("status.json", 'w'), indent=4)
# print(result)
