import colorsys
from json import dump, loads

PATH = "src/api/v1/data/colorLang.json"

def get_hsv(hexrgb):
    hexrgb = hexrgb.lstrip("#")   # in case you have Web color specs
    r, g, b = (int(hexrgb[i:i+2], 16) / 255.0 for i in range(0, 5, 2))
    return colorsys.rgb_to_hsv(r, g, b)


dic_lang_color = {}

with open(PATH) as f:
    dic_lang_color = loads(f.read())


# Functions to sort depending on something
def sort_color():
    """ Sort by color, to make a rainbow """
    dic = {k: v for k, v in sorted(dic_lang_color.items(), key=lambda x:get_hsv(x[1]))}

    with open(PATH, 'w') as f:
        dump(dic, f, indent=4)

def sort_name():
    """ Sort by name """
    dic = {k: v for k, v in sorted(dic_lang_color.items(), key=lambda x: x[0])}
    with open(PATH, 'w') as f:
        dump(dic, f, indent=4)



sort_color()
# sort_name()