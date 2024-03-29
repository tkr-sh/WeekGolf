#################################
#                               #
# quiz_state:                   #
#   - 0: Not running            #
#   - 1: Waiting for players    #
#   - 2: Running                #
#                               #
#################################


# from discord.ext import commands
import discord
import requests
# from PIL import Image, ImageDraw, ImageFont
# from io import BytesIO
# import cairosvg
# import time
from requests.structures import CaseInsensitiveDict
import datetime
import re
import asyncio
import json
import random
from generate_image import generate_image_5, generate_image_2

# Env
exec(open(".env").read())

# Variables
waiting_for_response = False
waiting_for_response_up = False
client = discord.Client()
SERVER_ID = "989521524849508433"
embed_start_id = 0
quiz_state = 0
global_msg = 0

global_correct = -1
players = []
players_score = []
players_this_round = {}
players_correct_this_round = 0


# Good format for langs
with open("formatLang.json") as file:
    format_lang = json.load(file)


last_message = {
    "New author": "",
    "Previous author": "",
    "Language": "",
    "Problem": "",
    "New size": "",
    "Previous size": "",
    "Difference": 0,
    "id": "",
    "title":"",
    "color":""
}

last_message_up = {
    "New author": "",
    "Previous author": "",
    "Language": "",
    "Problem": "",
    "New size": "",
    "Previous size": "",
    "Difference": 0,
    "id": "",
    "title":"",
    "color":""
}


############
# SHOW TOP #
############
def replaceArr(origin: list, dest: list, string: str) -> str:

    """The equivalent of replace in PHP where you can replace [a,b,c] by [d,e,f]

    Returns:
        The string replaced
    """

    new_string: str = string

    for i,e in enumerate(origin):
        if e in new_string:
            new_string = new_string.replace(e, dest[i])

    return new_string





def sendingRequest() -> None:

    """ Get the best languages in the top 5 ranking """

    # The url with the data
    url: str = "https://api.weekgolf.net/api/v1/top-languages"

    # Define the headers
    headers = CaseInsensitiveDict()
    headers["Content-Type"] = "application/x-www-form-urlencoded"

    # Get the top languages
    res = requests.get(url, headers=headers, data="").json()

    # Store everythin in different lists
    logo_list: list[str] = *map(lambda d: d["img"].replace("#","s"), res),
    name_list: list[str] = *map(lambda d: d["lang"], res),
    votes_list: list[str] = *map(lambda d: int(d["upvote"]), res),
    color_list: list[str] = *map(lambda lang: getColorOfLang(lang), name_list),


    # If it's the final phase or not
    if len(color_list) != 2:
        generate_image_5(color_list, logo_list, name_list, votes_list)
    else:
        generate_image_2(color_list, logo_list, name_list, votes_list)


########
# WEEK #
########
def sendingRequestWeek():

    """ Get the info of the challenge of the week """

    url = "https://api.weekgolf.net/api/v1/week-info"

    headers = CaseInsensitiveDict()
    headers["Content-Type"] = "application/x-www-form-urlencoded"

    rep: dict = requests.get(url, headers=headers, data="").json()[0]

    print(rep)


    rep["note"] = int(rep["sum_votes"]) / int(rep["voters"])
    rep["color"] = "#333333" if rep["lotw"] is None else getColorOfLang(rep["lotw"])


    return rep




def intToTime(n: int) -> str:
    """ Int to time """
    d,h,m,s = n // 3600 // 24, n // 3600 % 24, n // 60 % 60, n % 60
    return  f"{d} day{['','s'][d>2]}, {h} hour{['','s'][h>2]}, {m} minute{['','s'][m>2]}, {s} second{['','s'][s>2]}"





def langToExtension(lang: str) -> str:

    """ This function converts a lang to an extension for discord """

    lang = lang.lower()

    dic = {
        "bash": "bash",
        "c": "c",
        "c++": "cpp",
        "clojure": "clj",
        "c#": "cs",
        "elixir": "erl",
        "go": "go",
        "haskell": "hs",
        "java": "java",
        "js": "js",
        "javascript": "js",
        "julia": "py",
        "kotlin": "kt",
        "lua": "lua",
        "ocaml": "ml",
        "perl": "pl",
        "php": "php",
        "prolog": "prolog",
        "python": "py",
        "r": "r",
        "raku": "pl",
        "ruby": "rb",
        "rust": "rs"
    }

    return dic.get(lang, "")




def getColorOfLang(lang: str) -> str:

    """ Get the color of a lang """

    # Open the JSON file
    with open('colorLang.json') as json_file:
        # Load the JSON data into a Python object
        color_lang = json.load(json_file)

    return color_lang[lang.lower()] if lang.lower() in color_lang else "#333333"


########
# MEAN #
########
def getMeans() -> dict:
    print(requests.get("https://api.weekgolf.net/api/v1/mean-languages").json())
    return requests.get("https://api.weekgolf.net/api/v1/mean-languages").json()


def ranking(n: int) -> str:
    if n < 4:
        return f':{["first", "second", "third"][n - 1]}_place:'
    else:
        s = str(n)
        return s + ("th" if s[-1] not in "123" or s[-2] == "1" else ["st", "nd", "rd"][n % 10 - 1])


########
# QUIZ #
########
def generate_string_description(sec: int) -> str:

    """ Return the string to update the description in Python """

    return f"""This quiz consists of a series of 10 different questions! Whether it's about WeekGolf, about the world of code golf, or about the world of programming in general! :D
You have 10 seconds to answer to each question!

For the quiz to start, there must be more than one person. You can participate by writing "Me", "me", "ME!!!!" etc.

If there are enough people, the quiz starts in:
`{sec} seconds`"""



def creating_question() -> tuple:

    """ This function creates a question with answer for the quiz """

    question = ""
    choices = []
    correct = -1
    description = None

    with open("questions.json", encoding="utf8") as json_file:

        dic = json.load(json_file)
        proba_list = sum([[k] * v["proba"] for k,v in dic.items()], [])
        question = random.choice(proba_list)
        print(proba_list, question)

        dic_question = dic[question]


        # Pick Mode
        if dic_question["type"] == "pick":
            list_answer = dic_question["answers"]
            choices.append(dic_question["correct"])
            list_answer.remove(dic_question["correct"])

            # Adding 3 random answers
            for _ in range(3):
                # Get a random number in list_answer
                random_nb = random.randint(0, len(list_answer) - 1)
                # Add an answer to the list
                choices.append(list_answer[random_nb])
                list_answer.pop(random_nb)

            # Shuffle the list
            random.shuffle(choices)

            correct = choices.index(dic_question["correct"])
            question = dic_question["question"]

        # Set mode
        elif dic_question["type"] == "set":
            # Get all answers in a list
            values = [*dic_question["answers"].keys()]
            # Get a random value in the list
            correct_value = random.choice(values)
            # Add it's value
            choices.append(dic_question["answers"][correct_value])

            # Adding 3 random answers
            while len(choices) != 4:
                random_value = random.choice(values)
                if dic_question["answers"][random_value] not in choices:
                    choices.append(dic_question["answers"][random_value])

            # Shuffle the list
            random.shuffle(choices)

            correct = choices.index(dic_question["answers"][correct_value])
            question = dic_question["question"].replace("<PARAM>", correct_value)

            if "description" in dic_question:
                description = dic_question["description"].replace("<PARAM>", correct_value)


    return (question, choices, correct, description)


def random_quiz_msg(name: str) -> str:

    """ Genereate a random message when somebody joins the quiz """

    random_sentence = [
        "<PARAM> takes the quiz!",
        "<PARAM> takes WeekGolf's quiz!",
        "<PARAM> wants to show his knowledge!",
        "<PARAM> takes the quiz with its eyes closed!",
        "<PARAM> wants to practice!",
        "<PARAM> doesn't play for fun!",
        "<PARAM> is determined to win this quiz!"
    ]

    return random.choice(random_sentence).replace("<PARAM>", name)


def int_to_en(n: int) -> str:
    d = {1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth', 5: 'Fifth', 6: 'Sixth', 7: 'Seventh', 8: 'Eighth', 9: 'Ninth', 10: 'Last'}
    return d[n]


@client.event
async def on_message(message):
    global last_message, last_message_up, waiting_for_response, waiting_for_response_up, quiz_state, global_correct, players, players_score, players_this_round, players_correct_this_round


    # If it's not the bot itself
    if str(message.author) != "WeekGolf#3860" and str(message.author) != "WeekGolfBeta#2377" and str(message.guild.id) == SERVER_ID:

        can_be_split = str(message.content) != ""

        # Show the top image
        if str(message.content) == "$show top" or str(message.content) == "$st":
            creating_image = await message.channel.send("Creating the image... (10s)")
            sendingRequest()
            await message.channel.send(file=discord.File('temp.png'))
            await creating_image.delete()

        # Get the mean of languages
        elif str(message.content) == "$mean" or str(message.content) == "$m":
            await message.channel.send(
                "\n".join(f"{ranking(i+1)} - **{format_lang[e['lang'].lower()]}**'s mean: **{round(float(e['mean_min_size']), 2)}** bytes"for i,e in enumerate(getMeans()))
            )

        # Help
        elif str(message.content) == "$help" or str(message.content) == "$h":
            await message.channel.send("Here are the commands:\n- $show top (st)\n- $help (h)\n- $mean (m)\n- $week (w)\n- $info <lang>\n- $quiz start (qs)")

        # week
        elif str(message.content) == "$week" or str(message.content) == "$w":
            # Sending the Request
            rep = sendingRequestWeek()


            # Creating the embed
            new_embed = discord.Embed(
                title="Title: " + rep["title"],
                color=int(rep["color"][1:],16),
                timestamp=datetime.datetime.utcnow()
            )

            # Adding the ID of the problem
            new_embed.add_field(name="ID", value=rep["id"], inline=False)
            # Adding the language of the weeks
            new_embed.add_field(name="Language of the Week", value=rep["lotw"].capitalize() if rep["lotw"] is not None else "None", inline=True)
            # Adding the note of the problem
            new_embed.add_field(name="Note", value=str(rep["note"]) + " / 10", inline=True)
            # Adding the time in which the problem ends
            new_embed.add_field(name="End in", value=intToTime(int(rep["time"])), inline=False)
            # Add the image of the language of the week as a thumbnail
            new_embed.set_thumbnail(url=f"https://www.weekgolf.net/src/assets/imgs/{str(rep['lotw']).lower()}.png")

            await message.channel.send(embed=new_embed)


        # Info
        elif can_be_split and (str(message.content).split()[0] == "$info" or str(message.content).split()[0] == "$i"):
            # Sending the Request

            with open("description.json") as f:
                rep = json.load(f)
            # rep = requests.get("https://www.weekgolf.net/description.json").json()

            translate = {
                "javascript": "JavaScript",
                "ocaml": "OCaml"
            }

            correct_lang_case = lambda _lang: _lang.capitalize() if _lang.capitalize() in rep else _lang.upper() if _lang.upper() in rep else _lang
            send_correct_text = lambda txt: new_txt if len(new_txt := re.sub("<[^>]*>", "", txt)) < 1024 else new_txt[:1020] + "..."

            lang = correct_lang_case("".join(str(message.content).split()[1:]))
            if lang.lower() in translate:
                lang = translate[lang.lower()]

            # Creating the embed
            new_embed = discord.Embed(title=f"Language: {lang}", color=int(str(getColorOfLang(lang.lower().replace("#","s").replace("++","pp")))[1:],16), timestamp=datetime.datetime.utcnow())
            history = send_correct_text(rep[lang]["history"])
            characteristics = send_correct_text(rep[lang]["characteristics"])
            history = send_correct_text(rep[lang]["history"])
            new_embed.add_field(name="History", value=history, inline=False)
            new_embed.add_field(name="Characteristics", value=characteristics, inline=False)
            new_embed.add_field(name="Example of program", value=f"```{langToExtension(lang)}\n{rep[lang]['program']}\n```", inline=False)
            new_embed.set_thumbnail(url=f"https://www.weekgolf.net/src/assets/imgs/{lang.lower()}.png")

            await message.channel.send(embed=new_embed)


        # If the user wants to be in the quiz
        elif "me" in "".join(filter(lambda c:c.isalpha(),str(message.content))).lower() and quiz_state == 1 and str(message.author) not in players:
            players.append(str(message.author))
            await message.channel.send(random_quiz_msg(str(message.author).split("#")[0]))


        # If the user submits an answer during the quiz
        elif str(message.content).lower() in "abcd" and quiz_state == 2 and str(message.author) not in players_this_round:
            if str(message.content).lower() == "abcd"[global_correct]:
                score = len(players) * 100 - players_correct_this_round * 100
                players_score[players.index(str(message.author))] += score
                players_correct_this_round += 1
            else:
                score = 0
            players_this_round[str(message.author)] = score




        # Start the quiz
        elif "$quiz start" == str(message.content) or str(message.content) == "$qs":
            # If somebody already did the cmd
            if quiz_state == 1:
                await message.channel.send("Game is already starting...")
            # If there is already a quiz running
            elif quiz_state == 2:
                await message.channel.send("Game has already started...")
            else:
                embed_start = discord.Embed(
                    title="WeekGolf's quiz!",
                    color=0x33CC33,
                    description=generate_string_description(60),
                    timestamp=datetime.datetime.utcnow()
                )
                await message.channel.send(embed=embed_start)
                players = []

                quiz_state = 1

                # Waiting for people to come in the quiz
                await asyncio.sleep(60)

                # If there is enought players
                if len(players) > 1:
                    players_score = [0] * len(players)
                    quiz_state = 2

                    for i in range(10):
                        await message.channel.send(f"**_{int_to_en(i+1)} question incoming..._**")
                        await asyncio.sleep(1)
                        question, choices, correct, description = creating_question()
                        global_correct = correct

                        embed_question = discord.Embed(
                            title=question,
                            color=0x33CC33,
                            timestamp=datetime.datetime.utcnow(),
                            description="" if description is None else description
                        )

                        for j,e in enumerate(choices):
                            embed_question.add_field(name="ABCD"[j], value=e, inline=True)
                            if j % 2:
                                embed_question.add_field(name='\u200b', value='\u200b')


                        # Initiate var for this round
                        players_correct_this_round = 0
                        players_this_round = {}

                        # Waiting for answers
                        await message.channel.send(embed=embed_question)
                        await asyncio.sleep(10)

                        # Sorting players and players_score
                        dic_players_score = dict(zip(players, players_score))
                        dic_players_score = dict(sorted(dic_players_score.items(), key=lambda item: item[1]))
                        players = [*dic_players_score.keys()][::-1]
                        players_score = [*dic_players_score.values()][::-1]

                        # Message for the rank
                        rank = ""
                        for j,player in enumerate(players):
                            if player in players_this_round.keys():
                                rank += ranking(j+1)+" => " + "❌✅"[players_this_round[player]>0] + f" - {player}: {players_score[j]}pts ({players_this_round[player]}pts this turn)"
                            else:
                                rank += f"{ranking(j+1)} => ⏲️ - {player}: {players_score[j]}pts (the user did not have time to enter his answer)"
                            rank += "\n"

                        # Creating the embed
                        embed_solution = discord.Embed(title="Result", color=0x33CC33, timestamp=datetime.datetime.utcnow())
                        embed_solution.add_field(name="Solution", value=f"The correct answer was **{'ABCD'[correct]}: {choices[correct]}**", inline=False)
                        embed_solution.add_field(name="Rank", value=rank, inline=False)


                        await message.channel.send(embed=embed_solution)
                        if i != 9:
                            await message.channel.send("New question in 10 seconds...")
                        await asyncio.sleep(11)

                    await message.channel.send(f"🎉{players[0]}🎉 won!!!\n🎊Congratulations🎊!")

                # Else, if not enought players
                else:
                    await message.channel.send("Not enough players. Quiz aborted (||**RIP.**||)")

                quiz_state = 0





        # Update scores
        ## NEW RECORD CHANNEL
        if str(message.author) == "WeekGolf#0000" and str(message.channel.id) == "995078197181947945":

            print("NEW RECORD!")
            fields = message.embeds[0].fields
            if last_message["Problem"] == fields[0].value and last_message["Language"] == fields[6].value and last_message["New author"] == fields[5].value:

                # Get the previous message
                previous_message = await message.channel.fetch_message(int(last_message["id"]))

                # Upate the previous size and Difference
                last_message["Previous size"] = last_message["Previous size"] + f"->{fields[1].value}"
                last_message["New size"] = fields[2].value
                last_message["Difference"] += int(fields[1].value) - int(fields[2].value)
                last_message["id"] = message.id

                # Create a new embed with correct data
                new_embed = discord.Embed(title=last_message["title"], color=last_message["color"], timestamp=datetime.datetime.utcnow())
                new_embed.add_field(name="Problem", value=last_message["Problem"], inline=False)
                new_embed.add_field(name="Previous size", value=last_message["Previous size"], inline=True)
                new_embed.add_field(name="New size", value=last_message["New size"], inline=True)
                new_embed.add_field(name="Difference", value=last_message["Difference"], inline=True)
                new_embed.add_field(name="Previous author", value=last_message["Previous author"], inline=True)
                new_embed.add_field(name="New author", value=last_message["New author"], inline=True)
                new_embed.add_field(name="Language", value=last_message["Language"], inline=True)
                new_embed.set_thumbnail(url=f"https://week.golf/img/{last_message['Language'].lower()}.png")

                # Update embed + delete the new one
                await previous_message.delete()
                await message.delete()
                waiting_for_response = True
                await message.channel.send(embed=new_embed)
            else:
                last_message = {
                    "New author": fields[5].value,
                    "Previous author": fields[4].value,
                    "Language": fields[6].value,
                    "Problem": fields[0].value,
                    "New size": fields[2].value,
                    "Previous size": fields[1].value,
                    "Difference": int(fields[3].value),
                    "id": message.id,
                    "title":message.embeds[0].title,
                    "color":message.embeds[0].color
                }
                print(last_message)

        ## UPGRADE CHANNEL
        elif str(message.author) == "WeekGolf#0000" and str(message.channel.id) == "1026951672527847515":
            print("NEW UPDATE!")
            fields = message.embeds[0].fields
            if last_message_up["Problem"] == fields[0].value and last_message_up["Language"] == fields[6].value and last_message_up["New author"] == fields[5].value:

                # Get the previous message
                previous_message_up = await message.channel.fetch_message(int(last_message_up["id"]))

                # Upate the previous size and Difference
                last_message_up["Previous size"] = last_message_up["Previous size"] + f"->{fields[1].value}"
                last_message_up["New size"] = fields[2].value
                last_message_up["Difference"] += int(fields[1].value) - int(fields[2].value)
                last_message_up["id"] = message.id

                # Create a new embed with correct data
                new_embed = discord.Embed(title=last_message_up["title"], color=last_message_up["color"], timestamp=datetime.datetime.utcnow())
                new_embed.add_field(name="Problem", value=last_message_up["Problem"], inline=False)
                new_embed.add_field(name="Previous size", value=last_message_up["Previous size"], inline=True)
                new_embed.add_field(name="New size", value=last_message_up["New size"], inline=True)
                new_embed.add_field(name="Difference", value=last_message_up["Difference"], inline=True)
                new_embed.add_field(name="Previous author", value=last_message_up["Previous author"], inline=True)
                new_embed.add_field(name="New author", value=last_message_up["New author"], inline=True)
                new_embed.add_field(name="Language", value=last_message_up["Language"], inline=True)
                new_embed.set_thumbnail(url=f"https://www.weekgolf.net/src/assets/imgs/{last_message_up['Language'].lower()}.png")

                # Update embed + delete the new one
                await previous_message_up.delete()
                await message.delete()
                waiting_for_response_up = True
                await message.channel.send(embed=new_embed)
            else:
                last_message_up = {
                    "New author": fields[5].value,
                    "Previous author": fields[4].value,
                    "Language": fields[6].value,
                    "Problem": fields[0].value,
                    "New size": fields[2].value,
                    "Previous size": fields[1].value,
                    "Difference": int(fields[3].value),
                    "id": message.id,
                    "title":message.embeds[0].title,
                    "color":message.embeds[0].color
                }
                print(last_message_up)


    elif waiting_for_response:
        last_message["id"] = message.id
        print("Updated last message id.")
        waiting_for_response = False

    elif waiting_for_response_up:
        last_message_up["id"] = message.id
        print("Updated last message id.")
        waiting_for_response_up = False

    else:
        for embed in message.embeds:
            if embed.to_dict()["title"] == "WeekGolf's quiz!":
                for i in range(1,4):
                    await asyncio.sleep(15)
                    await message.edit(embed=discord.Embed(title="WeekGolf's quiz!", color=0x33CC33, description=generate_string_description(60-i*15), timestamp=datetime.datetime.utcnow()))
        if str(message.content) == "New question in 10 segenerateconds...":
            emojis = ["{}\N{COMBINING ENCLOSING KEYCAP}".format(num) for num in range(1, 10)][::-1]
            for i in range(10):
                await message.add_reaction(emojis[i])
                await asyncio.sleep(1)


client.run(TOKEN)
