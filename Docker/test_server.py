from requests import post


data = {
    "lang": "python",
    "code": "print(input())",
    "inputs": ["hey", "tk", "Sho"],
}


# req = post("http://localhost:5800/", json=data)
req = post("http://localhost:5800/", json=data)


print(req.json())
print(req.status_code())

