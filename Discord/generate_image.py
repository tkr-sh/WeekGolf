# Import
from PIL import Image, ImageDraw, ImageFont
import requests
from io import BytesIO
import cairosvg
# import time


########################
# CONVERT HEX TO TUPLE #
########################
def hex_to_tuple(h: str) -> tuple:

    """ Return a Tuple from hexa """

    r = int(h[1:3],16)
    g = int(h[3:5],16)
    b = int(h[5:7],16)

    return (r,g,b)


####################################
# FUNCTION THAT GENERATE THE TOP 5 #
#####################################
def generate_image_5(color_list: list[str], logo_list, name_list, votes_list) -> None:


    """ A function that generate the image """

    # Draw the colors
    def draw_colors(x_start, x_end, y_start, y_end, c):

        """ Draw the colors """

        try:
            for i in range(y_start, y_start + y_end):
                for j in range(x_start, x_end):
                    img.putpixel((j, i), c)
        except IndexError:
            return 1




    # Creating the image
    img = Image.new('RGB', (2048, 2048), color='red').convert('RGBA')


    # Custom list
    ## Colors
    color_list = [*map(hex_to_tuple, color_list)]
    coor_y_start = [0, 0, 750, 1205, 1660]
    coor_y_end = [2048, 750, 455, 455, 455]

    ## Logo
    # The offset for images
    offset_list = [(262,774), (1336,175), (1386,780), (1386,1235), (1386, 1690)]
    # Size of images
    size_img_list = [500, 400, 300, 300, 250]
    # Y offset of the name of the lang
    y_lang_offset_list = [1300, 600, 1100, 1550, 1950]
    # Y offset of the number of vote
    y_vote_offset_list = [600, 50, 880, 1350, 1780]
    # Capitalizing the name_list
    name_list = [*map(lambda s: s.capitalize(),name_list)]

    ## Fonts
    fnt50 = ImageFont.truetype("includes/fonts/DejaVuSansMono.ttf", 50)
    fnt70 = ImageFont.truetype("includes/fonts/DejaVuSansMono.ttf", 70)
    fnt90 = ImageFont.truetype("includes/fonts/DejaVuSansMono.ttf", 90)

    ## Rank
    rank_list = ["1st", "2nd", "3rd", "4th", '5th']
    y_rank_offset_list = [10, 10, 760, 1215, 1670]




    current_rank = 0
    diff_rank = 1
    for i,colors in enumerate(color_list):
        # Color
        draw_colors([0,1024][i > 0], [1024,2048][i > 0], coor_y_start[i], coor_y_end[i], colors)
        # time.sleep(1)


        # Logo
        ## Get the image
        try:
            # Get the image
            response = requests.get(f"https://www.weekgolf.net/src/assets/icons/{logo_list[i]}")
            temp_svg = response.content
            temp_logo = BytesIO()

            ## Convert SVG to PNG
            cairosvg.svg2png(bytestring=temp_svg, write_to=temp_logo)
        # If an error occurs, just but a question mark
        except Exception:
            response = requests.get("https://www.weekgolf.net/src/assets/icons/question.svg")
            temp_svg = response.content
            temp_logo = BytesIO()

            ## Convert SVG to PNG
            cairosvg.svg2png(bytestring=temp_svg, write_to=temp_logo)


        ## Convert the image to png
        temp_logo = Image.open(temp_logo)
        temp_logo = temp_logo.resize((size_img_list[i], size_img_list[i]))
        img.paste(temp_logo, offset_list[i], temp_logo)


        # The font
        draw = ImageDraw.Draw(img)
        ## The language name
        w, _ = draw.textsize(name_list[i], font=fnt90)
        x_lang = [1024 + (1024 - w) / 2, (1024 - w) / 2][i == 0]
        draw.text((x_lang, y_lang_offset_list[i]), name_list[i], font=fnt90, fill=(255, 255, 255, 255))

        ## The vote number
        vote_txt = str(votes_list[i]) + "\n "[i < 2] + "vote" + ("s" * (int(votes_list[i]) > 1))
        w, _ = draw.textsize(vote_txt, font=fnt90)
        x_lang = [1050, 1024 + (1024 - w)/2,(1024 - w)/2][(i == 0) + (i < 2)]
        draw.text((x_lang, y_vote_offset_list[i]), vote_txt, font=fnt90, fill=(255, 255, 255, 255))


        ## The rank
        if i == 0:
            current_rank = 0
        elif votes_list[i - 1] == votes_list[i]:
            diff_rank += 1
        else:
            current_rank += diff_rank
            diff_rank = 1

        rank_txt = rank_list[current_rank]
        w, _ = draw.textsize(rank_txt, font=fnt70)
        x_lang = [1034, 10][i == 0]
        draw.text((x_lang, y_rank_offset_list[i]), rank_txt, font=fnt50, fill=(255, 255, 255, 255))

    # Save the image
    img.save('temp.png')








####################################
# FUNCTION THAT GENERATE THE TOP 2 #
#####################################
def generate_image_2(color_list: list[str], logo_list: list[str], name_list: list[str], votes_list: list[str]) -> None:

    # Draw the colors
    def draw_colors(x_start, x_end, y_start, y_end, c):
        """ Draw the colors """
        try:
            for i in range(y_start, y_start + y_end):
                for j in range(x_start, x_end):
                    img.putpixel((j, i), c)
        except IndexError:
            return 1



    def name_to_image(lang: str, bool: bool) -> None:

        """A function that convert the name to an image"""

        response = requests.get(f"https://www.weekgolf.net/src/assets/icons/{lang}")
        temp_svg = response.content
        temp_logo = BytesIO()

        ## Convert SVG to PNG
        cairosvg.svg2png(bytestring=temp_svg, write_to=temp_logo)

        ## The image in .png
        temp_logo = Image.open(temp_logo)
        temp_logo = temp_logo.resize((500, 500))
        img.paste(temp_logo, (bool * 1024 + 262, 774), temp_logo)



    # Creating the image
    img = Image.new('RGB', (2048, 2048), color='red').convert('RGBA')
    # Define a font
    fnt = ImageFont.truetype("includes/fonts/DejaVuSansMono.ttf", 90)


    # Get the rgb colors on a tuple for the right and left part
    left, right = [*map(hex_to_tuple, color_list)]

    # Draw colors for the left part
    draw_colors(0, 824, 0, 2048, left)

    # Create the gradient between the 2 languages
    for i in range(400):
        temp = tuple((left[j] * (400 - i) + right[j] * i) // 400 for j in range(3))
        draw_colors(824 + i, 824 + i + 1, 0, 2048, temp)

    # Draw colors for the right part
    draw_colors(1224, 2048, 0, 2048, right)


    # Add the image of both languages
    name_to_image(logo_list[0],0)
    name_to_image(logo_list[1],1)


    # After all of that, add the name and the vote of the languages
    draw = ImageDraw.Draw(img)
    for i in range(2):
        # Name
        w, _ = draw.textsize(name_list[i], font=fnt)
        x_lang = [1024 + (1024 - w) / 2,  (1024 - w) / 2][i == 0]
        draw.text((x_lang, 600), name_list[i], font=fnt, fill=(255, 255, 255, 255))

        # Vote
        vote_txt = votes_list[i] + "\n "[i<2] + "vote" + ["","s"][int(votes_list[i]) > 1]
        w, _ = draw.textsize(vote_txt, font=fnt)
        x_lang = [1050, 1024 + (1024 - w)/2,(1024 - w)/2][(i == 0) + (i < 2)]
        draw.text((x_lang, 1300), vote_txt, font=fnt, fill=(255, 255, 255, 255))


    img.save('temp.png')
