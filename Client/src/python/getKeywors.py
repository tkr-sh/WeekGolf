import builtins
import keyword

types = ["int", "float", "complex", "bool", "list", "tuple", "range", "str", "dict", "set", "frozenset", "bytes", "bytearray", "memoryview", "builtins"]

print(keyword.kwlist)
print([*set(sum([dir(eval(t)) for t in types], []))])