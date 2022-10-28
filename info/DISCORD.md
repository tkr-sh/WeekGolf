# Discord
## Summary
- [Discord](#discord)
  - [Summary](#summary)
  - [Language used](#language-used)
  - [questions.json](#questionsjson)
  - [Functions](#functions)
    - [replaceArr](#replacearr)
    - [hexToTuple](#hextotuple)
    - [main](#main)
    - [top2](#top2)
    - [sendingRequest](#sendingrequest)
    - [intToTime](#inttotime)
    - [langToExtension](#langtoextension)
    - [getColorOfLang](#getcoloroflang)
    - [getMeans](#getmeans)
    - [ranking](#ranking)
    - [generate_string_description](#generate_string_description)
    - [creating_question](#creating_question)
    - [random_quiz_msg](#random_quiz_msg)
    - [int_to_en](#int_to_en)
    - [on_message](#on_message)

## Language used
The language used for the discord bot is Python<br>
Some librairies are used such as:
- discord.py
- requests
- datetime
- PIL
- cairosvg
- io

## questions.json
The list of the questions for the quiz in a JSON format.

## Functions
### replaceArr
Replace all element of origin by dest in string (equivalent to strreplace in PHP)

### hexToTuple
Convert a hex value (str) to tuple

### main
This function is the function to create the image for `$show top`

### top2
This function is the function to create the image for `$show top` and when it's the thrid phase

### sendingRequest
Sending a request to get the top5 ranking in languages

### intToTime
Convert an int to string. Usefull for the `$week` command

### langToExtension
Convert a lang to it's extension for discord triple back quote

### getColorOfLang
Get the color of the lang with a RGB format

### getMeans
The means of languages in a dictionnary

### ranking
From an int to a ranking

### generate_string_description
Return the description for the quiz before it starts

### creating_question
Return a question with the questions, the possible answers, the supposed answer, and description in case there is a program

### random_quiz_msg
Say a random message to welcome players

### int_to_en
Convert an int to English 
1 => First, 2 => Second

### on_message
The main function when a message is sent on discord