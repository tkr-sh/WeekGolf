from json import loads, dump



dic = loads(open("languages.json").read())
sorted_dic = {k:v for k,v in sorted(dic.items(), key=lambda e: e[0])}
dump(sorted_dic, open("languages.json", 'w'), indent=4)
