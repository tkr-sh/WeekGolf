<?php
    //  Including DataBase
    //////////////////////
    include_once "connectToDatabase.php";

    $request_id = $_GET["id"]; // ID of the problem

    // Get the ID of the last challenge
    $last_challenge_id = $conn->query("SELECT id FROM Problem WHERE date_enable <= NOW() ORDER BY id DESC LIMIT 1")->fetch_assoc()["id"];

    if ($request_id > $last_challenge_id || $request_id < 1){
        header("Location: https://week.golf/404.html");
    }

    $result = rsql("SELECT title, descript, lotw FROM Problem WHERE id = ?", [$request_id], "i") -> fetch_assoc();
    define('LOTW', $result["lotw"] == NULL ? "python" : $result["lotw"]);
?>
<!DOCTYPE html>
<html lang="en" style="scroll-behavior: smooth;">
    <!-- If logged -->
    <script>
        if (localStorage.token !== ""){
            const xhttp = new XMLHttpRequest();

            xhttp.open("POST", "https://week.golf/getIdbyToken.php", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhttp.send(`t=${localStorage.token}`);

            xhttp.onload = function() {
                const rep = JSON.parse(xhttp.responseText);

                const id = rep["id"];
                
                if (id == "" || id == null){
                    document.location.href = "https://week.golf/";
                }
            }
        } else {
            document.location.href = "https://week.golf/";
        }

    </script>
    <head>
        <!-- 3ncoding -->
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- Title -->
        <title>WeekGolf</title>

        <!-- Icon -->
        <link rel="icon" href="https://i.imgur.com/9Pgc6UV.png">

        <!-- Color Theme -->
        <script src="color.js"></script>
        
        <!-- CSS -->
        <link href="index.css" rel="stylesheet" type="text/css" />
        <link href="style.css" rel="stylesheet" type="text/css" />
        <link href="header.css" rel="stylesheet" type="text/css" />
        <link href="footer.css" rel="stylesheet" type="text/css" />
        <link href="fonts.css" rel="stylesheet" type="text/css" />

        <!-- Special fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

        <!-- Header Boucing -->
        <script src="header.js"></script>

        <!-- Scroll to Top -->
        <script src="scrolltop.js"></script>

        <!--Langage Support -->
        <meta charset="UTF-8">

        <!-- LaTeX -->
        <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
        <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

        <style>
            /* :root {
                --lighter-color-2: #ee6f44;
                --lighter-color: #dc5d32;
                --main-color: #cc5933;
                --darker-color: #b94822;
                --darker-color-2: #ac3811;
                --darker-color-3: #882f11;
                --darker-color-4: #751d00;

                --golf-color: #8a2200;
            } */
        </style>
    </head>
    <body>     

  
        <!-- Header -->
        <?php
        include_once "header.html";
        ?>

        <?php
            // Function to change a name of a language to a beautiful format
            function setCorrectName($lang) {
                $lang = ucfirst($lang);

                switch ($lang){
                    case "Apl":
                        return "APL";
                    case "Cs":
                        return "C#";
                    case "Cpp":
                        return "C++";
                    case "Ocaml":
                        return "OCaml";
                    case "Javascript":
                        return "JavaScript";
                    case "Golfscript":
                        return "GolfScript";
                    case "Php":
                        return "PHP";
                    case "Php":
                        return "PHP";
                    default:
                        return $lang;
                }
            }
        ?>
        
        <!-- Main -->
        <main>
            <!-- Next and previous button -->
            <?php
                // If it's not the last
                $last_problem = $request_id == $last_challenge_id;
                if ($request_id != $last_challenge_id){
            ?>
            <a id="next_challenge" href="https://week.golf/challenge.php?id=<?= $request_id + 1?>">
                <button class="button_next_previous">Next</button>
            </a>
            <?php
                } else {
            ?>
            <div id="picker_lotw" show="0">
                <table style="width: 100%; height: 100%">
                    <tr style="width: 100%; height: 100%">
                        <td style="width: 90%; height: 100%; margin-left: -2px;">
                            <header style="position: absolute; height: 100px; text-align: center; background-color: #151515; width: calc(90% - 2Px); top: 0px; margin-left: -2px">
                                <title>Other languages</title>
                            </header>
                            <div id="scroll_content">
                                <!-- <div id="middd" style="position: fixed"></div> -->
                                <div id="shadow"></div>
                                <?php
                                $data = file_get_contents("https://week.golf/description.json");
                                $data = json_decode($data, true);
                                $data = $data[setCorrectName(LOTW)];
                                $history = $data["history"];
                                $characteristics = $data["characteristics"];
                                $program = $data["program"];

                                $lang_result = $conn->query("SELECT lang FROM CurrentLang ORDER BY lang");
                                $i = 0;
                                while ($row = $lang_result -> fetch_assoc()){
                                ?>
                                    <div class="lang_picker" onclick="clickLang(<?=$i?>)"<?= !$i ? " style='margin-top: 400px'":""?>>
                                        <?=setCorrectName($row["lang"])?>
                                    </div>
                                <?php
                                    $i++;
                                }
                                ?>
                            </div>
                        </td>
                        <td style="width: 10%; height: 100%">
                            <button id="button_picker_lotw">
                                <img src="img/more.svg" style="width: 80%; transform: translate(10%);">
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div id="content_lotw" show="0" title="Language of the Week&#10;Ctrl+Alt+L">
                <header id="header_lotw">
                    <img src="img/<?= str_replace(["#"],["s"],strtolower(LOTW)) ?>_white.svg" style="width: 50px;margin-left: 12.5px;margin-top: 12.5px;">
                </header>
                <main id="main_lotw">
                    <title>Language of the Week:</title>
                    <div id="lang"><?= setCorrectName(LOTW) ?></div>

                    <!-- History -->
                    <h1>History:</h1>
                    <p id="history">
                        <?= str_replace(["\n"],["<br><br>"],$history) ?>
                    </p>


                    
                    <!-- Characteristics -->
                    <h1>Characteristics:</h1>
                    <ul id="characteristics">
                        <?php
                        foreach (explode("\n-",substr($characteristics,2))as $caracteristic){
                        ?>
                            <li><?= $caracteristic ?></li>
                        <?php
                        }
                        ?>
                    </ul>
                        
                    <!-- Program example -->
                    <h1>Program example:</h1>
                    <section class="lotwIde" id="lotwIde"></section>

                    <button id="button_lotw">Golf in this language!</button>
                </main>
            </div>
            <?php
                }
                
                // If it's not the first
                $first_problem = $request_id == 1;
                if (!$first_problem) {
            ?>
            <a id="previous_challenge" href="https://week.golf/challenge.php?id=<?= $request_id - 1?>">
                <button class="button_next_previous" style="margin-right: 5%; float: right; margin-left: -100px<?= $request_id == $last_challenge_id ? '; margin-top: 0px !important' :'' ?>" id="previous_challenge">Previous</button>
            </a>    
            <?php
                }
            ?>

            <!-- Problem Title and Description -->
            <title id="name_problem"><?= $result["title"] ?></title>
            <div id="spacer_problem"></div>
            <dt id="description_problem"><?= $result["descript"] ?></dt>

            <?php
                // If it's the end of the problem
                $result = rsql("SELECT * FROM Problem WHERE id = ? AND date_end < NOW()", [$request_id], "i");
                $show_solution_bool = $result -> num_rows > 0;
                if ($show_solution_bool) {
            ?>
            <!-- Solution -->
            <div id="bulb_content" onclick="sol()">
                <img src="img/bulb.svg" id="bulb_img" alt="Bubl">
            </div>
            <section id="solution_content" style="overflow: hidden; height: 0px">
                <table style="width: 100%; height: 100%">
                    <tr style="width: 100%; height: 100%">
                        <!-- Change lang -->
                        <td id="choose_lang_solution">
                            <button id="selector_lang" onclick="closing()">
                                <img src="img/python_white.svg" style="width: 40px" id="selector_lang_img">
                            </button>
                        </td>

                        <!-- Change Answer -->
                        <td id="choose_solution">
                            <textarea id="filter_golf_username" placeholder="Username..."></textarea>
                            <textarea id="filter_golf_size" placeholder="Size..."></textarea>

                            <?php

                            // CONVERT UNIX TIMESTAMP IN OUR MESURES
                            function unixTimestampToCommon($date){
                                $time = [1, 60, 3600, 84000, 31536000, 9999999999999];
                                $name = ["second", "minute", "hour", "day", "year"];
                                $diff = time() - $date;
                                for ($i = 0; $i < 5; $i++){
                                    if ($diff < $time[$i+1])
                                        return strval(floor($diff / $time[$i])) . " " . $name[$i] . strval(floor($diff / $time[$i]) == 1 ? '' : 's') . " ago";
                                }
                            }
                                            
                            $lang_result = $conn->query("SELECT lang FROM CurrentLang ORDER BY lang");
                            $comments = array();
                            while ($row = $lang_result -> fetch_assoc()){

                                $lang_name = str_replace(["++", "javascript"], ["pp", "node"], $row["lang"]);
                                        
                            
                                # Get the Top 50 of the solutions
                                $code = array();
                                $size = array();
                                $lang = array();
                                $owner_id = array();
                                $ownername = array();
                                $id_array = array();
                                $nb_sol = 0;
                                $user_id = 1;

                                $result = rsql("SELECT UNIX_TIMESTAMP(date_end) FROM Problem WHERE id = ?;", [$request_id], "i");
                                $date_end = -1;
                                if ($result->num_rows > 0) {
                                    while($row = $result->fetch_assoc()) {
                                        $date_end = $row["UNIX_TIMESTAMP(date_end)"];
                                    }
                                }
            
                        
                        
                                # Get TOP50 solutions from a problem
                                $result = rsql("SELECT * FROM (SELECT * FROM (SELECT * FROM Golf WHERE ? > date_submit ORDER BY size ASC) AS T1 WHERE (problem_id = ? AND (? > date_submit) AND lang = ?) LIMIT 50) AS T2 ORDER BY size DESC;", [$date_end, $request_id, $date_end, $lang_name], "siss");
                                # Get solutions
                                if ($result -> num_rows > 0) {
                                    while($row = $result->fetch_assoc()) {
                                        $code[] = $row["code"];
                                        $size[] = intval($row["size"]);
                                        $lang[] = $row["lang"];
                                        $owner_id[] = intval($row["owner_id"]);
                                        $ownername[] = rsql("SELECT username FROM Users WHERE id = ?", [intval($row["owner_id"])], 'i')->fetch_assoc()["username"];
                                        $id_array[] = intval($row["id"]);
                                        $nb_sol++;
                                    }
                                }
                                
                                if (!empty($size)){
                                    $best_size = min($size);
                                } else {
                                    $best_size = 999999;
                                }
                        
                                
                                # Get solutions after date of end
                                $code_size =  $best_size;
                                $result = rsql("SELECT * FROM (SELECT * FROM Golf ORDER BY date_submit ASC) AS T1 WHERE problem_id = ? AND ? < date_submit AND lang = ? AND size < ?;", [$request_id, $date_end, $lang_name, $best_size], "issi");
                                if ($result->num_rows > 0) {
                                    while($row = $result->fetch_assoc()) {
                                        if ($row["size"] < $code_size){
                                            $code_size = $row["size"];
                                            $code[] = $row["code"];
                                            $size[] = intval($row["size"]);
                                            $lang[] = $row["lang"];
                                            $owner_id[] = intval($row["owner_id"]);
                                            $ownername[] = rsql("SELECT username FROM Users WHERE id = ?", [intval($row["owner_id"])], 'i')->fetch_assoc()["username"];
                                            $id_array[] = intval($row["id"]);
                                        }
                                    }
                                }

                                $code = array_reverse($code);
                                $size = array_reverse($size);
                                $lang = array_reverse($lang);
                                $owner_id = array_reverse($owner_id);
                                $ownername = array_reverse($ownername);
                                $id_array = array_reverse($id_array);
                        
                                # Don't need secure SQL
                                # vvvvvvvvvvvvvvvvvvvvv
                                for ($i = 0; $i < sizeof($code); $i++){
                                    $sql = "SELECT * FROM Commentaire WHERE golf_id=".$id_array[$i].";";
                                    $result = $conn->query($sql);
                                    $j = 0;
                                    if ($result->num_rows > 0){
                                        while($row = $result->fetch_assoc()) {
                                            $temp = array();
                                            $temp[] = $row["content"];
                                            $temp[] = $row["owner_id"];
                                            $temp[] = $conn->query("SELECT username FROM Users WHERE id = ".intval($row["owner_id"]).";")->fetch_assoc()["username"];
                                            $temp[] = strtotime($row["date_send"]);
                                            $temp[] = $row["upvote"];
                                            $temp[] = $row["id"];
                                            $temp[] = rsql("SELECT * FROM UpvoteCommentaire WHERE commentaire_id = ? AND owner_id = ?", [$row['id'], $user_id], "ii")->num_rows > 0;
                                            $temp[] = $id_array[$i];
                                            $comments[] = $temp;
                                            $j++;
                                        }
                                    } else {
                                        $comments[$i] = array();
                                    }
                                }
                            
                    
                                for ($i = 0; $i < sizeof($code); $i++){
                            ?>
                                <button class="button_show_solution" name="<?= strtolower($ownername[$i]) ?>" size="<?= $size[$i] ?>" soln="<?= $i ?>" golf_id="<?= $id_array[$i] ?>" lang="<?= str_replace(["pp","node"],["++","javascript"],$lang_name) ?>" onclick="showGolf(<?= $id_array[$i] ?>, '<?=(sizeof($code) - $i > $nb_sol ? 'Upgrade N°' . strval(sizeof($code) - $i - $nb_sol) : 'Solution N°' .strval( -(sizeof($code) - $nb_sol) + $i + 1)). ' - ' . $size[$i] . 'bytes' ?>', '<?= $ownername[$i] ?>', <?= $owner_id[$i] ?>)"> <?= (sizeof($code) - $i > $nb_sol ? "UP N°" . strval(sizeof($code) - $i - $nb_sol) : "SOL N°" .strval(-(sizeof($code) - $nb_sol) + $i + 1))?> </button>
                                <div class="sol" id="<?= $id_array[$i] ?>" style="display: none"><?= str_replace(["<"], ["&lt;"],$code[$i]) ?></div>
                            <?php 
                                }
                            }
                            ?>
                        </td>

                        <!-- The solution -->
                        <td id="solution_content_inside">
                            <header style="color: #fff; font-size: 35px; font-weight: 900; width: 100%">
                                <title style="text-align: center;" id="solution_title">Solution N°1 - 999 bytes</title>
                            </header>
                            <div class="bar_solution"></div>
                            <div class="solution_author">Solution written by <a href="" id="ownername" style="color: #fff">TKirishima</a></div>
                            <div class="solution_ide" id="solution_ide_0" style="width: 95%; margin-left: 2.5%; height: 410px"></div>
                        </td>

                        <!-- The Comments -->
                        <td id="comment_section" style="overflow: auto">
                            <div style="display: flex; overflow: visible; width: 9999px; height: 100%" id="comment_section_container">
                                <!-- Comment title & send button -->
                                <title id="comment_title">Comments</title>
                                <div class="bar_solution"></div>
                                <textarea class="text_area_comment" style="margin-top: 10px; max-height: 339px;"placeholder="Enter a comment..."></textarea>
                                <div class="send_comment" onclick="sendComment(0)" style="margin-top: 0px; margin-bottom: 10px; height: auto">
                                    <div class="vertical-align">
                                        <img src="img/paper_plane.svg" class="paper_plane" alt="Send a comment">
                                    </div>
                                </div>

                                <!-- List of the comments -->
                                <?php
                                    $j = 0;
                                    for ($i = 0; $i < sizeof($comments); $i++){
                                        if ($comments[$i] !== []){
                                ?>
                                <div class="comments" style="overflow: hidden; min-height: auto; height: auto;" golfid="<?= $comments[$i][7] ?>" comment_id="<?= $comments[$i][5] ?>">
                                    <div style="height: 100%; width: 70px; position: relative;display: table; float: left; margin-top: 10px;">
                                        <div class="vertical-align">
                                            <img src="img/upvotewhite.svg" class="upvote_img" onclick="upVote([<?= $j ?>,0])" alt="Upvote a comment">
                                            <img src="img/upvotegreen.svg" class="upvote_img" onclick="upVote([<?= $j ?>,1])" style="display: none;" alt="Unvote a comment">
                                            <div class="nb_upvote"><?= $comments[$i][4] ?></div>
                                        </div>
                                    </div>
                                    <div class="the_comment" style="color: #fff; font-size: 14px">
                                        <?= str_replace(["<"], ["&lt;"], $comments[$i][0]) ?>
                                    </div>
                                    
                                    <div class="comment_owner" style="margin-top: 5px;">
                                        <span style="font-weight: 300;"><?= unixTimestampToCommon($comments[$i][3]) ?> -</span> <?= $comments[$i][2] ?>
                                    </div>
                                </div>
                                <?php   
                                        $j++;
                                        }
                                    }
                                ?>
                            </div>
                        </td>
                    </tr>
                </table>
                <?php
                    }
                ?>
                <article class="language_pannel_selector">
                    <span style="margin-left: calc(50% - 210px); width: 420px;">Select the language</span>
                    
                    <img id="cross_close" src="img/cross.svg" onclick="closing()" alt="Close">

                    <div style="display: table; width: 100%;">
                        <div class="vertical-align">
                            <div id="languages_box" style="background-color: #0000; display: block">
                                <?php 
                                $result_lang = $conn -> query("SELECT ColorLang.lang, ColorLang.color FROM ColorLang, CurrentLang WHERE ColorLang.lang = CurrentLang.lang ORDER BY CurrentLang.lang");
                                for ( $i = 0; $row = $result_lang -> fetch_assoc(); $i++){
                                ?>
                                <div class="languages_small_box" onclick="changingLanguage(<?= $i ?>)" lang="<?= $row["lang"] ?>">
                                    <div class="boxContent" style="background-color: <?= $row["color"] ?>;"></div>
                                    <img src="img/<?= $row["lang"] ?>.svg" class="image_colored" alt="An image of <?= $row["lang"] ?>">
                                    <img src="img/<?= $row["lang"] ?>_white.svg" class="image_white" alt="An image of <?= $row["lang"] ?> in white">
                                    
                                </div>
                                <?php
                                }
                                ?>  
                            </div>
                        </div>
                    </div>
                </article>
            </section>

            <!-- History of golf -->
            <div id="history_golf_content" show="0">
                <button id="history_golf_button" title="See the history&#10;of your solutions&#10;Ctrl+Alt+H"><img src="img/history.svg" style="width: 50px; height: 50px"></button>
                <button id="selector_lang_history" onclick="closing()"><img src="img/question.svg" id="history_image_lang"></button>
                <div id="history_golf_main">
                    <div id="history_solution"></div>
                    <div id="historyIde" class="historyIde"></div>
                </div>
            </div>

            <!-- Time -->
            <time id="time" style="margin-bottom: 5px; background-color: #1C1C1C; height: 60px; width: 375px; margin-left: calc(50% - 187.5px);">
                <div class="vertical-align">    
                    Loading time...
                </div>
            </time>

            <!-- Problem -->
            <button id="language_selector" onclick="closing()" title="Change the language&#10;Ctrl+Alt+C">
                <div id="selected_language" style="width: 150px">Python</div>
            </button>
            <div id="language_ul">
            </div>

            <div id="history_golf" title="See the history&#10;of your solutions&#10;Ctrl+Alt+H">
                <img src="img/history.svg" style="width: 35px; height: 35px; margin-left: 7.5px; margin-top: 7.5px;">
            </div>

            <!-- Run Button -->
            <button onclick="executeCode()" id="run" title="Run your code&#10;Ctrl+Enter">
                <span>RUN</span>
            </button>
            <table style="width: 100%;height: 300px;">
                <tr style = "width: 100%; height: 100%">
                    <td style="width: 5%;"></td> 
                    <td style="width: 90%; height:100%; overflow: hidden;" id="td_of_text_ide">
                        <!-- IDE -->
                        <section class="mainIde" id="mainIde" onmouseout="resizingMain()"></section>
                    </td>
                    <td style="width: 5%;"></td>
                </tr>
            </table>
            <button id="delete_code" onclick="deleteCode()" title="Start from scratch&#10;Ctrl+Alt+D">
                <img src="img/trash.svg" style="width: 35px; height: 35px; margin-left: 7.5px; margin-top: 7.5px" alt="Delete the code">
            </button>
            <div id="nb_byte">0 byte</div>
            <button id="reset_code" onclick="resetCode()" title="Get back to your best solution (if you have one)&#10;Ctrl+Alt+Z">
                <img src="img/reset.svg" style="width: 35px; height: 35px; margin-left: 7.5px; margin-top: 7.5px" alt="Reset the code">
            </button>

            <!-- Keyboards -->
            <div class="keyboard" id="vyxal_keyboard">
                <span style="color: #fff; font-size: 40px; text-align: center; font-weight: 900; width: 100%; margin-top: -7px; margin-bottom: 20px">
                    Vyxal
                </span>
                <br>
                <div class="char_vyxal">
                    <span>λ</span>
                </div>
                <div class="char_vyxal">
                    <span>ƛ</span>
                </div>
                <div class="char_vyxal">
                    <span>¬</span>
                </div>
                <div class="char_vyxal">
                    <span>∧</span>
                </div>
                <div class="char_vyxal">
                    <span>⟑</span>
                </div>
                <div class="char_vyxal">
                    <span>∨</span>
                </div>
                <div class="char_vyxal">
                    <span>⟇</span>
                </div>
                <div class="char_vyxal">
                    <span>÷</span>
                </div>
                <div class="char_vyxal">
                    <span>×</span>
                </div>
                <div class="char_vyxal">
                    <span>«</span>
                </div>
                <div class="char_vyxal">
                    <span>»</span>
                </div>
                <div class="char_vyxal">
                    <span>°</span>
                </div>
                <div class="char_vyxal">
                    <span>•</span>
                </div>
                <div class="char_vyxal">
                    <span>ß</span>
                </div>
                <div class="char_vyxal">
                    <span>†</span>
                </div>
                <div class="char_vyxal">
                    <span>€</span>
                </div>
                <div class="char_vyxal">
                    <span>½</span>
                </div>
                <div class="char_vyxal">
                    <span>∆</span>
                </div>
                <div class="char_vyxal">
                    <span>ø</span>
                </div>
                <div class="char_vyxal">
                    <span>↔</span>
                </div>
                <div class="char_vyxal">
                    <span>¢</span>
                </div>
                <div class="char_vyxal">
                    <span>⌐</span>
                </div>
                <div class="char_vyxal">
                    <span>æ</span>
                </div>
                <div class="char_vyxal">
                    <span>ʀ</span>
                </div>
                <div class="char_vyxal">
                    <span>ʁ</span>
                </div>
                <div class="char_vyxal">
                    <span>ɾ</span>
                </div>
                <div class="char_vyxal">
                    <span>ɽ</span>
                </div>
                <div class="char_vyxal">
                    <span>Þ</span>
                </div>
                <div class="char_vyxal">
                    <span>ƈ</span>
                </div>
                <div class="char_vyxal">
                    <span>∞</span>
                </div>
                <div class="char_vyxal">
                    <span>¨</span>
                </div>
                <div class="char_vyxal">
                    <span>↑</span>
                </div>
                <div class="char_vyxal">
                    <span>↓</span>
                </div>
                <div class="char_vyxal">
                    <span>∴</span>
                </div>
                <div class="char_vyxal">
                    <span>∵</span>
                </div>
                <div class="char_vyxal">
                    <span>›</span>
                </div>
                <div class="char_vyxal">
                    <span>‹</span>
                </div>
                <div class="char_vyxal">
                    <span>∷</span>
                </div>
                <div class="char_vyxal">
                    <span>¤</span>
                </div>
                <div class="char_vyxal">
                    <span>ð</span>
                </div>
                <div class="char_vyxal">
                    <span>→</span>
                </div>
                <div class="char_vyxal">
                    <span>←</span>
                </div>
                <div class="char_vyxal">
                    <span>β</span>
                </div>
                <div class="char_vyxal">
                    <span>τ</span>
                </div>
                <div class="char_vyxal">
                    <span>ȧ</span>
                </div>
                <div class="char_vyxal">
                    <span>ḃ</span>
                </div>
                <div class="char_vyxal">
                    <span>ċ</span>
                </div>
                <div class="char_vyxal">
                    <span>ḋ</span>
                </div>
                <div class="char_vyxal">
                    <span>ė</span>
                </div>
                <div class="char_vyxal">
                    <span>ḟ</span>
                </div>
                <div class="char_vyxal">
                    <span>ġ</span>
                </div>
                <div class="char_vyxal">
                    <span>ḣ</span>
                </div>
                <div class="char_vyxal">
                    <span>ḭ</span>
                </div>
                <div class="char_vyxal">
                    <span>ŀ</span>
                </div>
                <div class="char_vyxal">
                    <span>ṁ</span>
                </div>
                <div class="char_vyxal">
                    <span>ṅ</span>
                </div>
                <div class="char_vyxal">
                    <span>ȯ</span>
                </div>
                <div class="char_vyxal">
                    <span>ṗ</span>
                </div>
                <div class="char_vyxal">
                    <span>ṙ</span>
                </div>
                <div class="char_vyxal">
                    <span>ṡ</span>
                </div>
                <div class="char_vyxal">
                    <span>ṫ</span>
                </div>
                <div class="char_vyxal">
                    <span>ẇ</span>
                </div>
                <div class="char_vyxal">
                    <span>ẋ</span>
                </div>
                <div class="char_vyxal">
                    <span>ẏ</span>
                </div>
                <div class="char_vyxal">
                    <span>ż</span>
                </div>
                <div class="char_vyxal">
                    <span>√</span>
                </div>
                <div class="char_vyxal">
                    <span>⟨</span>
                </div>
                <div class="char_vyxal">
                    <span>⟩</span>
                </div>
                <div class="char_vyxal">
                    <span>‛</span>
                </div>
                <div class="char_vyxal">
                    <span>₀</span>
                </div>
                <div class="char_vyxal">
                    <span>₁</span>
                </div>
                <div class="char_vyxal">
                    <span>₂</span>
                </div>
                <div class="char_vyxal">
                    <span>₃</span>
                </div>
                <div class="char_vyxal">
                    <span>₄</span>
                </div>
                <div class="char_vyxal">
                    <span>₅</span>
                </div>
                <div class="char_vyxal">
                    <span>₆</span>
                </div>
                <div class="char_vyxal">
                    <span>₇</span>
                </div>
                <div class="char_vyxal">
                    <span>₈</span>
                </div>
                <div class="char_vyxal">
                    <span>¶</span>
                </div>
                <div class="char_vyxal">
                    <span>⁋</span>
                </div>
                <div class="char_vyxal">
                    <span>§</span>
                </div>
                <div class="char_vyxal">
                    <span>ε</span>
                </div>
                <div class="char_vyxal">
                    <span>¡</span>
                </div>
                <div class="char_vyxal">
                    <span>∑</span>
                </div>
                <div class="char_vyxal">
                    <span>¦</span>
                </div>
                <div class="char_vyxal">
                    <span>≈</span>
                </div>
                <div class="char_vyxal">
                    <span>µ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ȧ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ḃ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ċ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ḋ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ė</span>
                </div>
                <div class="char_vyxal">
                    <span>Ḟ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ġ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ḣ</span>
                </div>
                <div class="char_vyxal">
                    <span>İ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ŀ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ṁ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ṅ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ȯ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ṗ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ṙ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ṡ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ṫ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ẇ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ẋ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ẏ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ż</span>
                </div>
                <div class="char_vyxal">
                    <span>₌</span>
                </div>
                <div class="char_vyxal">
                    <span>₍</span>
                </div>
                <div class="char_vyxal">
                    <span>⁰</span>
                </div>
                <div class="char_vyxal">
                    <span>¹</span>
                </div>
                <div class="char_vyxal">
                    <span>²</span>
                </div>
                <div class="char_vyxal">
                    <span>∇</span>
                </div>
                <div class="char_vyxal">
                    <span>⌈</span>
                </div>
                <div class="char_vyxal">
                    <span>⌊</span>
                </div>
                <div class="char_vyxal">
                    <span>¯</span>
                </div>
                <div class="char_vyxal">
                    <span>±</span>
                </div>
                <div class="char_vyxal">
                    <span>₴</span>
                </div>
                <div class="char_vyxal">
                    <span>…</span>
                </div>
                <div class="char_vyxal">
                    <span>□</span>
                </div>
                <div class="char_vyxal">
                    <span>↳</span>
                </div>
                <div class="char_vyxal">
                    <span>↲</span>
                </div>
                <div class="char_vyxal">
                    <span>⋏</span>
                </div>
                <div class="char_vyxal">
                    <span>⋎</span>
                </div>
                <div class="char_vyxal">
                    <span>꘍</span>
                </div>
                <div class="char_vyxal">
                    <span>ꜝ</span>
                </div>
                <div class="char_vyxal">
                    <span>℅</span>
                </div>
                <div class="char_vyxal">
                    <span>≤</span>
                </div>
                <div class="char_vyxal">
                    <span>≥</span>
                </div>
                <div class="char_vyxal">
                    <span>≠</span>
                </div>
                <div class="char_vyxal">
                    <span>⁼</span>
                </div>
                <div class="char_vyxal">
                    <span>ƒ</span>
                </div>
                <div class="char_vyxal">
                    <span>ɖ</span>
                </div>
                <div class="char_vyxal">
                    <span>∪</span>
                </div>
                <div class="char_vyxal">
                    <span>∩</span>
                </div>
                <div class="char_vyxal">
                    <span>⊍</span>
                </div>
                <div class="char_vyxal">
                    <span>£</span>
                </div>
                <div class="char_vyxal">
                    <span>¥</span>
                </div>
                <div class="char_vyxal">
                    <span>⇧</span>
                </div>
                <div class="char_vyxal">
                    <span>⇩</span>
                </div>
                <div class="char_vyxal">
                    <span>Ǎ</span>
                </div>
                <div class="char_vyxal">
                    <span>ǎ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ǐ</span>
                </div>
                <div class="char_vyxal">
                    <span>ǐ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ǒ</span>
                </div>
                <div class="char_vyxal">
                    <span>ǒ</span>
                </div>
                <div class="char_vyxal">
                    <span>Ǔ</span>
                </div>
                <div class="char_vyxal">
                    <span>ǔ</span>
                </div>
                <div class="char_vyxal">
                    <span>⁽</span>
                </div>
                <div class="char_vyxal">
                    <span>‡</span>
                </div>
                <div class="char_vyxal">
                    <span>≬</span>
                </div>
                <div class="char_vyxal">
                    <span>⁺</span>
                </div>
                <div class="char_vyxal">
                    <span>↵</span>
                </div>
                <div class="char_vyxal">
                    <span>⅛</span>
                </div>
                <div class="char_vyxal">
                    <span>¼</span>
                </div>
                <div class="char_vyxal">
                    <span>¾</span>
                </div>
                <div class="char_vyxal">
                    <span>Π</span>
                </div>
                <div class="char_vyxal">
                    <span>„</span>
                </div>
                <div class="char_vyxal">
                    <span>‟</span>
                </div>
            </div>

            <div class="keyboard" id="apl_keyboard">
                <span style="color: #fff; font-size: 40px; text-align: center; font-weight: 900; width: 100%; margin-top: -7px; margin-bottom: 20px">
                    APL
                </span>
                <div class="char_apl">
                    <span>←</span>
                </div>
                <div class="char_apl">
                    <span>+</span>
                </div>
                <div class="char_apl">
                    <span>-</span>
                </div>
                <div class="char_apl">
                    <span>×</span>
                </div>
                <div class="char_apl">
                    <span>÷</span>
                </div>
                <div class="char_apl">
                    <span>*</span>
                </div>
                <div class="char_apl">
                    <span>⍟</span>
                </div>
                <div class="char_apl">
                    <span>⌹</span>
                </div>
                <div class="char_apl">
                    <span>○</span>
                </div>
                <div class="char_apl">
                    <span>!</span>
                </div>
                <div class="char_apl">
                    <span>?</span>
                </div>
                <div class="char_apl">
                    <span>|</span>
                </div>
                <div class="char_apl">
                    <span>⌈</span>
                </div>
                <div class="char_apl">
                    <span>⌊</span>
                </div>
                <div class="char_apl">
                    <span>⊥</span>
                </div>
                <div class="char_apl">
                    <span>⊤</span>
                </div>
                <div class="char_apl">
                    <span>⊣</span>
                </div>
                <div class="char_apl">
                    <span>⊢</span>
                </div>
                <div class="char_apl">
                    <span>=</span>
                </div>
                <div class="char_apl">
                    <span>≠</span>
                </div>
                <div class="char_apl">
                    <span>≤</span>
                </div>
                <div class="char_apl">
                    <span><</span>
                </div>
                <div class="char_apl">
                    <span>></span>
                </div>
                <div class="char_apl">
                    <span>≥</span>
                </div>
                <div class="char_apl">
                    <span>≡</span>
                </div>
                <div class="char_apl">
                    <span>≢</span>
                </div>
                <div class="char_apl">
                    <span>∨</span>
                </div>
                <div class="char_apl">
                    <span>∧</span>
                </div>
                <div class="char_apl">
                    <span>⍲</span>
                </div>
                <div class="char_apl">
                    <span>⍱</span>
                </div>
                <div class="char_apl">
                    <span>↑</span>
                </div>
                <div class="char_apl">
                    <span>↓</span>
                </div>
                <div class="char_apl">
                    <span>⊂</span>
                </div>
                <div class="char_apl">
                    <span>⊃</span>
                </div>
                <div class="char_apl">
                    <span>⊆</span>
                </div>
                <div class="char_apl">
                    <span>⌷</span>
                </div>
                <div class="char_apl">
                    <span>⍋</span>
                </div>
                <div class="char_apl">
                    <span>⍒</span>
                </div>
                <div class="char_apl">
                    <span>⍳</span>
                </div>
                <div class="char_apl">
                    <span>⍸</span>
                </div>
                <div class="char_apl">
                    <span>∊</span>
                </div>
                <div class="char_apl">
                    <span>⍷</span>
                </div>
                <div class="char_apl">
                    <span>∪</span>
                </div>
                <div class="char_apl">
                    <span>∩</span>
                </div>
                <div class="char_apl">
                    <span>~</span>
                </div>
                <div class="char_apl">
                    <span>/</span>
                </div>
                <div class="char_apl">
                    <span>\</span>
                </div>
                <div class="char_apl">
                    <span>⌿</span>
                </div>
                <div class="char_apl">
                    <span>⍀</span>
                </div>
                <div class="char_apl">
                    <span>,</span>
                </div>
                <div class="char_apl">
                    <span>⍪</span>
                </div>
                <div class="char_apl">
                    <span>⍴</span>
                </div>
                <div class="char_apl">
                    <span>⌽</span>
                </div>
                <div class="char_apl">
                    <span>⊖</span>
                </div>
                <div class="char_apl">
                    <span>⍉</span>
                </div>
                <div class="char_apl">
                    <span>¨</span>
                </div>
                <div class="char_apl">
                    <span>⍨</span>
                </div>
                <div class="char_apl">
                    <span>⍣</span>
                </div>
                <div class="char_apl">
                    <span>.</span>
                </div>
                <div class="char_apl">
                    <span>∘</span>
                </div>
                <div class="char_apl">
                    <span>⍤</span>
                </div>
                <div class="char_apl">
                    <span>⍥</span>
                </div>
                <div class="char_apl">
                    <span>@</span>
                </div>
                <div class="char_apl">
                    <span>⎕</span>
                </div>
                <div class="char_apl">
                    <span>⍠</span>
                </div>
                <div class="char_apl">
                    <span>⌸</span>
                </div>
                <div class="char_apl">
                    <span>⌺</span>
                </div>
                <div class="char_apl">
                    <span>⌶</span>
                </div>
                <div class="char_apl">
                    <span>⍎</span>
                </div>
                <div class="char_apl">
                    <span>⍕</span>
                </div>
                <div class="char_apl">
                    <span>⋄</span>
                </div>
                <div class="char_apl">
                    <span>⍝</span>
                </div>
                <div class="char_apl">
                    <span>⍵</span>
                </div>
                <div class="char_apl">
                    <span>⍺</span>
                </div>
                <div class="char_apl">
                    <span>∇</span>
                </div>
                <div class="char_apl">
                    <span>¯</span>
                </div>
                <div class="char_apl">
                    <span>⍬</span>
                </div>
            </div>

            <!-- Settings -->
            <section id="settings_button" value="0" title="Open/Close Settings&#10;Ctrl+Alt+S">
                <button id="settings_header">
                    <img src="img/settings.svg" style="width: 50px" alt="Settings">
                </button>
                <table style="width: calc(100% - 60px)">
                    <tr>
                        <!-- Tabulation or no -->
                        <td class="settings_section">
                            <div class="settings_title">
                                \tABULATION
                            </div>
                            Check that if you want to transform false tab (4 spaces) by a real tab
                            <div style="display: flex; justify-content: center;">
                                <label class="slidebox_container" id="country_slider">
                                    <input type="checkbox" id="checkbox_tabulation">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </td>

                        <!-- Word wrap or no -->
                        <td class="settings_section">
                            <div class="settings_title">
                                WORD WRAP
                            </div>
                            Make a word wrap instead of a long line 
                            
                            <div style="display: flex; justify-content: center;">
                                <label class="slidebox_container" id="country_slider">
                                    <input type="checkbox" id="checkbox_wordwrap">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </td>

                        <!-- Display the cursor position -->
                        <td class="settings_section">
                            <div class="settings_title">
                                CURSOR POSITION
                            </div>
                            Show the cursor position (line and column)
                            
                            <div style="display: flex; justify-content: center;">
                                <label class="slidebox_container" id="country_slider">
                                    <input type="checkbox" id="checkbox_cursorpos">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </td>
                        
                        <!-- Show invisible chars -->
                        <td class="settings_section">
                            <div class="settings_title">
                                SHOW INVISIBLE
                            </div>
                            Show spaces and tabs 
                            
                            <div style="display: flex; justify-content: center;">
                                <label class="slidebox_container" id="country_slider">
                                    <input type="checkbox" id="checkbox_showinvi">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <!-- Autocompletion of Brackets  -->
                        <td class="settings_section">
                            <div class="settings_title">
                                AUTO BRACKETS
                            </div>
                            If it's on it will autocomplet (, [, {, ', " else no.
                            
                            <div style="display: flex; justify-content: center;">
                                <label class="slidebox_container" id="country_slider">
                                    <input type="checkbox" id="checkbox_autobrackets">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </td>

                        <!-- Show errors or no -->
                        <td class="settings_section">
                            <div class="settings_title">
                                SHOW ERROR
                            </div>
                            If it's on it will show STDERR else no.
                            
                            <div style="display: flex; justify-content: center;">
                                <label class="slidebox_container" id="country_slider">
                                    <input type="checkbox" id="checkbox_showerror">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </td>

                        <!-- Delete indentation -->
                        <td class="settings_section">
                            <div class="settings_title">
                                DELETE INDENTATION
                            </div>
                            This will delete all the indentation
                            
                            <button class="keyboard_button" id="button_deleteindent" style="text-align: center">
                                DELETE
                            </button>
                        </td>

                        <!-- Show the Keyboard for languages with new ASCII table -->
                        <td class="settings_section">
                            <div class="settings_title">
                                KEYBOARD
                            </div>
                            <div class="keyboard_button" id="vyxal_kb_bt">Vyxal</div>
                            <div class="keyboard_button" id="apl_kb_bt">APL</div>
                            <div class="keyboard_button" id="none_kb_bt">None</div>
                        </td>
                    </tr>
                </table>
            </section>


            <!-- Output -->
            <div id="output_txt">
                <div style="display: table-cell;
                vertical-align: middle;
                text-align: center;">
                    Output
                </div>
            </div>

            <table style="width: 100%;height: 400px;" id="table_output">
                <tr style = "width: 100%; height: 100%">
                    <td style="width: 5%;"></td>
                    <td style="width: 90%; height:100%;">
                        <!-- OUTPUT-->
                        <div id="output"></div>
                    </td>
                    <td style="width: 5%;"></td>
                </tr>
            </table>

            
            <!-- Leaderboard -->
            <section id="leaderboard_ide" style="background-color: #222">
                <header id="leaderboard_ide_text">
                    <div class="vertical-align">
                        LeaderBoard
                    </div>
                </header>
                <ul id="leaderboard_languages">
                    <?php
                    $result = $conn->query("SELECT lang FROM CurrentLang ORDER BY lang");
                    while ($row = $result->fetch_assoc()){
                    ?>
                    <li class="language_div" onclick = "showLeaderboard('<?= strtolower($row['lang']) ?>')">
                        <div class="vertical-align">
                            <img src="img/<?= strtolower($row['lang'])?>_white.svg" style="width: 30px; height: 30px; top: 5px; position: relative; right: 5px" alt="<?= ucfirst($row['lang'])?>">
                            <span>
                                <?= str_replace("Cs", "C#", ucfirst($row['lang']))?>
                            </span>
                        </div>
                    </li>
                    <?php
                    }
                    ?>
                </ul>

                <article id="leaderboard_users">

                    <!-- Image + Txt -->
                    <img src="img/question.svg" id="leaderboard_img" alt="Question">
                    <div id="leaderboard_title">NaN player</div>

                    <!-- All the users -->
                </article>
            </section>
            
            <div style="height:50px; background: rgb(126, 11, 119, 0)"></div>


            <?php
                $result_notes = rsql("SELECT sum_votes, voters FROM Problem WHERE id = ?", [$request_id], "i") -> fetch_assoc();
            ?>
            <table style="width: 100%; height: 70px">
                <tr>
                    <td style="width: 5%"></td>

                    <!-- Mean -->
                    <td style="width: 44.5%">
                        <div class="result_problem">
                            Mean: <?= $result_notes["voters"] != 0 ? round( $result_notes["sum_votes"] / $result_notes["voters"] , 2): "NaN" ?>
                        </div>
                    </td>

                    <td style="width: 1%"></td>

                    <!-- Voters -->
                    <td style="width: 44.5%">
                        <div class="result_problem">
                            Voters: <?=$result_notes["voters"]?>
                        </div>
                    </td>

                    <td style="width: 5%"></td>
                </tr>
            </table>

            <div style="width: calc( 90% - 100px); margin-left: 5%; background-color: #1C1C1C; border-radius: 5px; padding: 50px; margin-top: 10px; margin-bottom: 25px;">
                <div id="star_container">
                    <?php

                    for ($i = 0; $i < 10; $i++){
                    ?>
                    <img src="img/star_off.svg" class="star" onclick="star(<?= $i ?>)" alt="Star off">
                    <?php
                    }
                    ?>
                </div>
            </div>

            <table style="width: 100%; height: 100px">
                <tr>
                    <td style="width: 5%"></td>

                    <!-- Mean -->
                    <td style="width: 44.5%">
                        <div id="del_vote" onclick="delNote()">
                            DELETE VOTE
                        </div>
                    </td>

                    <td style="width: 1%"></td>

                    <!-- Voters -->
                    <td style="width: 44.5%">
                        <div id="send_vote" onclick="sendNote()">
                            SEND VOTE
                        </div>
                    </td>

                    <td style="width: 5%"></td>
                </tr>
            </table>


            <div style="height:100px; background: rgb(126, 11, 119, 0)"></div>
            
            <!-- :3 -->
            <div class="uwuwu" id="uwuwu"></div>

        </main>
                
        <!-- Footer -->
        <?php 
            include_once "footer.html"
        ?>




        <!--
                ____.                     _________            .__        __   
                |    |____ ___  _______   /   _____/ ___________|__|______/  |_ 
                |    \__  \\  \/ /\__  \  \_____  \_/ ___\_  __ \  \____ \   __\
            /\__|    |/ __ \\   /  / __ \_/        \  \___|  | \/  |  |_> >  |  
            \________(____  /\_/  (____  /_______  /\___  >__|  |__|   __/|__|  
                          \/           \/        \/     \/         |__|    
                        
            - Ace
            - Default code for IDE
            - Word Wrap, Tabulation, Cursor Position, Show Invisible, Auto brackets, Show errors and Delete Indentation
            - LeaderBoard
            - Execute code
            <?php if ($show_solution_bool){?>-Bulb
            - Upvote
            - Sending comments
            - Show code/solution
            <?php }?>
            - Get My best answer
            - Close selection language
            - Resizing the MarginTop of lang pannel
            - Remaining Time
            - Number of byte
        -->

        <!-- Ace -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script src="includes/ace/ace.js"></script>
        <script src="includes/ace/theme-monokai.js"></script>
        <script src='ide.js'></script>


        <!-- default code -->
        <script src="https://week.golf/defaultCode.js"></script>


        <!-- Word Wrap, Tabulation, Cursor Position, Show Invisible, Auto brackets, Show errors and Delete Indentation-->
        <script>
            // Capitalize
            let capitalize = (str) => str[0].toUpperCase() + str.slice(1).toLowerCase();

            if (localStorage.tab == null) localStorage.tab = "false";
            if (localStorage.wordwrap == null) localStorage.wordwrap = "false";
            if (localStorage.cursorposition == null) localStorage.cursorposition = "false";
            if (localStorage.showinvisible == null) localStorage.showinvisible = "false";
            if (localStorage.autobrackets == null) localStorage.autobrackets = "true";
            if (localStorage.showerror == null) localStorage.showinvisible = "true";


            // Vars
            ///////////////////////////
            // Word Wrap
            let word_wrap = document.getElementById("checkbox_wordwrap");
            // Tabulation
            let tabulation = document.getElementById("checkbox_tabulation");
            // Cursor Position
            let cursor_position = document.getElementById("checkbox_cursorpos");
            // Show Invisible
            let show_invisible = document.getElementById("checkbox_showinvi");
            // Auto Brackets
            let auto_brackets = document.getElementById("checkbox_autobrackets");
            // Show error
            let show_error = document.getElementById("checkbox_showerror");
            // Auto indents
            let delete_indentation = document.getElementById("button_deleteindent");
                
            if (localStorage.wordwrap == "true") word_wrap.checked = true;
            if (localStorage.tab == "true") tabulation.checked = true;
            if (localStorage.cursorposition == "true") cursor_position.checked = true;
            if (localStorage.showinvisible == "true") show_invisible.checked = true;
            if (localStorage.autobrackets == "true") auto_brackets.checked = true;
            if (localStorage.showerror == "true") show_error.checked = true;



            // Functions
            //////////////////////////
            // Word Wrap
            function wordWrap(){
                let mainIde = ace.edit("mainIde");
                const b = localStorage.wordwrap == "true";

                // Main IDE
                if (b){
                    mainIde.getSession().setUseWrapMode(true);
                    mainIde.setOption("indentedSoftWrap", false);
                } else {
                    mainIde.getSession().setUseWrapMode(false);
                    mainIde.setOption("indentedSoftWrap", true);
                }

                // All Solutions
                let solutionN = document.getElementById("solution_ide_0");
                for (let i = 1; solutionN != null; i++){
                    let editor = ace.edit(solutionN);
                    editor.getSession().setUseWrapMode(b);
                    editor.setOption("indentedSoftWrap", !b);
                    solutionN = document.getElementById(`solution_ide_${i}`);
                }
            }


            // Tabulation
            function tabulationFunc(){
                let mainIde = ace.edit("mainIde");
                if (localStorage.tab == "true"){
                    mainIde.session.setOptions({ tabSize: 4, useSoftTabs: false });
                    mainIde.setValue(mainIde.getValue().replaceAll("    ","\t"), -1);
                } else {
                    mainIde.session.setOptions({ tabSize: 4, useSoftTabs: true });
                }
            }


            // Cursor Position
            function getCursorPosition(){
                const mainIde = ace.edit("mainIde");
                const dic = mainIde.getCursorPosition();

                return ` | Row: ${dic["row"]} | Column: ${dic["column"]}`;
            }


            // Show Invisible
            function showInvisible(){
                let mainIde = ace.edit("mainIde");
                const b = localStorage.showinvisible == "true";

                // Main IDE
                mainIde.setOption("showInvisibles", b);

                // All Solutions
                let solutionN = document.getElementById("solution_ide_0");
                for (let i = 1; solutionN != null; i++){
                    let editor = ace.edit(solutionN);

                    editor.setOption("showInvisibles", b);
                    solutionN = document.getElementById(`solution_ide_${i}`);
                }
            }

            // Auto brackets
            function autoBrackets(){
                let mainIde = ace.edit("mainIde");
                const b = localStorage.autobrackets == "true";

                // Main IDE
                mainIde.setOption("behavioursEnabled", b);
            }

            // Delete indentation
            function deleteIndentation(){
                let mainIde = ace.edit("mainIde");
                mainIde.setValue(mainIde.getValue().replaceAll("    ","").replaceAll("\t",""), -1)
            }



            // Event Listener
            ////////////////////////
            word_wrap.addEventListener("change", function(){
                localStorage.wordwrap = this.checked;
                wordWrap();
            });

            tabulation.addEventListener("change", function(){
                localStorage.tab = this.checked;
                tabulationFunc();
            });

            cursor_position.addEventListener("change", function(){
                localStorage.cursorposition = this.checked;
            });

            show_invisible.addEventListener("change", function(){
                localStorage.showinvisible = this.checked;
                showInvisible();
            });

            auto_brackets.addEventListener("change", function(){
                localStorage.autobrackets = this.checked;
                autoBrackets();
            });

            show_error.addEventListener("change", function(){
                localStorage.showerror = this.checked;
            });
            
            delete_indentation.addEventListener("click", function(){
                deleteIndentation();
            });



            wordWrap();
            tabulationFunc();
            showInvisible();
            autoBrackets();
        </script>



        <!-- History of solutions -->
        <script>
            let history_golf_content = document.getElementById("history_golf_content");
            let history_golf_button = document.getElementById("history_golf_button");
            let history_golf = document.getElementById("history_golf");
            let history_solution = document.getElementById("history_solution");
            let global_code = [];
            let global_size = [];


            // ACE
            ////////
            historyIde = ace.edit("historyIde");
            historyIde.setTheme("ace/theme/monokai");
            historyIde.session.setMode(`ace/mode/${capitalize(localStorage.selectedLanguage) in correspondance ? correspondance[capitalize(localStorage.selectedLanguage)] : "python"}`);
            historyIde.setOptions ({
                fontFamily: "monospace",
                fontSize: 20,
                animatedScroll: true,
                maxLines: Infinity,
                copyWithEmptySelection: true
            });
            historyIde.session.setUseWorker(false);
            historyIde.setShowPrintMargin(false);
            historyIde.setReadOnly(true);


            // Function to Hide and show the history
            ///////////////////////////////////////////////
            function hideHistory() {

                // If its not show, show it
                if (history_golf_content.getAttribute("show") == 0) {
                    getHistory();
                    history_golf_content.style.marginLeft = "10%";
                } else { // Else hide it
                    history_golf_content.style.marginLeft = "-80%";
                }

                history_golf_content.setAttribute("show", +!+history_golf_content.getAttribute("show"))
            }


            // Function to get the top solutions of the user
            ///////////////////////////////////////////////
            function getHistory() {
                let xhttp = new XMLHttpRequest();

                xhttp.open("POST", "https://week.golf/getHistoryByToken.php", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                xhttp.send(`t=${localStorage.token}&pid=<?= $request_id ?>&lang=${localStorage.selectedLanguage.replaceAll("#","s").replace("javascript","node")}`);

                xhttp.onload = function() {
                    const rep = JSON.parse(xhttp.responseText);

                    global_code = rep["code"];
                    global_size = rep["size"];


                    let textContent = "";
                    let textContentStorage = "";
                    for (let i = 0; i < global_size.length; i++){
                        textContent += `
                    <button class="button_show_solution" title="${global_size[i]} bytes" onclick="updateHistoryIde(${i})">
                        SOL N°${i+1}
                    </button>`
                    }


                    // Updating the interface
                    history_solution.innerHTML = textContent;
                    historyIde.session.setMode(`ace/mode/${capitalize(localStorage.selectedLanguage) in correspondance ? correspondance[capitalize(localStorage.selectedLanguage)] : "python"}`);
                    updateHistoryIde(0);
                }
            }


            // Function that updates the IDE of the history
            ///////////////////////////////////////////////
            function updateHistoryIde(n) {
                if (global_code[n] != undefined)
                    historyIde.setValue(global_code[n], 1);
            }

            getHistory();
            history_golf_button.addEventListener("click", hideHistory);
            history_golf.addEventListener("click", hideHistory);
        </script>


        <!-- LeaderBoard-->
        <script>
            var globalRankingLeaderBoard = [];
            let bestAnswer = [];
            let bestAnswerLang = [];
            const sorted_languages = [
                <?php 
                    $result = $conn -> query("SELECT lang FROM CurrentLang ORDER BY lang");
                    while ($row = $result -> fetch_assoc()){
                ?>
                "<?= $row['lang']?>",
                <?php
                }
                ?>
            ]

            
            // Number to Rank
            function numberToRank(nb) {
                const len = nb.length;
                return (parseInt(nb[len-1]) < 4 && parseInt(nb[len-1]) > 0 && (nb[len-2] != "1" || nb == '1'))?["st","nd","rd"][parseInt(nb[len-1])-1]:"th";
            }



            // Sending request to get the leaderboard by lang
            function showLeaderboard(lang) {
                let arr = [];
                let j = 0;
                const temp_lang = lang.replace("javascript","node").replace("c++","cpp");
                for (let i = 0; i < globalRankingLeaderBoard.length ; i++){
                    if (globalRankingLeaderBoard[i][0] === temp_lang){
                        arr.push(globalRankingLeaderBoard[i]);
                        arr[j][4] = parseInt(arr[j][4]);
                        j++;
                    }
                }
                let textContent = `<img src="img/${lang}_white.svg" id="leaderboard_img"> <div id="leaderboard_title">${arr.length} player${arr.length!=1?'s':''}</div>`;

                let rank = 0;
                let diff = 1;
                for (let i = 0; i < arr.length; i++){
                    if (i == 0){
                        rank = 1;
                    } else if (arr[i-1][4] < arr[i][4]) {
                        rank += diff;
                        diff = 1;
                    } else { // If the scores are equals
                        diff++;
                    }

                    textContent += `
                    <a href="https://week.golf/profile.php?id=${arr[i][1]}">
                        <div class="user_div">
                            <div class="lb_rank">
                                <div class="vertical-align" style="height: 70px">
                                    ${rank + numberToRank(""+rank)}
                                </div>
                            </div>
                            <img src="${arr[i][3]!=null?arr[i][3]:'img/nouser_white.jpg'}" class="lb_pp">
                            <div class="lb_username">
                                ${arr[i][2].replace(' ', '_')}
                            </div>
                            <div class="lb_bytes">
                                <div class="vertical-align" style="height: 70px">
                                    ${arr[i][4]}
                                    <div style="font-size: 10px; margin-top: -10px">Bytes</div>
                                </div>
                            </div>
                        </div>
                    </a>
                    `
                }

                document.getElementById("leaderboard_users").innerHTML = textContent;
            }

            
            function getTheLeaderBoard(){
                // Loading the Leaderboard
                const xhttp6 = new XMLHttpRequest();
                xhttp6.open("POST", "https://week.golf/getLeaderboardById.php", true); // Sending POST request
                xhttp6.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // Header
                xhttp6.send(`id=<?= $request_id ?>`); // Sending

                xhttp6.onload = function() {
                    const rep = JSON.parse(xhttp6.responseText);
                    globalRankingLeaderBoard = rep["result"];

                    // for (let i = 0; i < 0; i++){}
                    showLeaderboard(localStorage.selectedLanguage == null ? "python": localStorage.selectedLanguage);
                }
            }
            getTheLeaderBoard();
            setInterval(getTheLeaderBoard, 60000);
        </script>

        <!-- Executing code -->
        <script>
            // Execute code
            function executeCode(){
                const correspondance = {
                    "Apl": "apl",
                    "Bash": "bash",
                    "C++": "cpp",
                    "C": "c",
                    "C#": "csharp",
                    "Clojure":"clojure",
                    "Elixir":"elixir",
                    "Go":"golang",
                    "Golfscript":"golfscript",
                    "Haskell":"haskell",
                    "J":"j",
                    "Java":"java",
                    "Jelly":"jelly",
                    "Julia":"julia",
                    "K":"k", // TODO
                    "Kotlin":"kotlin",
                    "Lua":"lua",
                    "Javascript": "javascript",
                    "Ocaml":"ocaml",
                    "Perl": "perl",
                    "Php": "php",
                    "Prolog": "prolog",
                    "Python": "python",
                    "R": "r",
                    "Raku": "raku",
                    "Ruby": "ruby",
                    "Rust": "rust",
                    "Vyxal": "vyxal"
                };
                
                document.getElementById("output").innerHTML = "Starting...";

                const lang = correspondance[document.getElementById('selected_language').textContent];
                const program = mainIde.getValue();


                // Send request
                const xhttp = new XMLHttpRequest();
                xhttp.open("POST", "https://week.golf/io.php", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send(`lang=${lang}&code=${encodeURIComponent(program)}&id=<?= $request_id ?>&t=${localStorage.token}`);


                xhttp.onload = function() {
                    if (xhttp.responseText.toLowerCase().includes("time-out") && xhttp.responseText[0] == "<"){
                        document.getElementById("output").innerHTML = "TIME-OUT.<br>Try to see if there isn't problem in your code like an infinite recursion or an infinte loop.<br>If you think that this is an error, you can report it on the discord or at admin@week.golf";
                        document.getElementById("output").style.borderColor = "#f00";
                        return -1;
                    }
                    const rep = JSON.parse(xhttp.responseText);
                    document.getElementById("output").style.borderColor = (rep["success"] === "SUCCEED")?"#0f0":"#f00";
                    var textContent = "";
                    for (let i = 0; i < parseInt(rep["len"]); i ++){
                        textContent += `>>> Test N°${i+1} State:${rep["success_arr"][i]?'✅':'❌'}<br>`;
                        textContent += `====== Input =========<br>${rep["inputs"][i]}`;
                        textContent += `<br>====== Expected ======<br>${rep["expected"][i].replaceAll("\n","<br>")}`;
                        textContent += `<br>====== Found ========<br>${rep["obtained"][i].replaceAll("\n","<br>")}`;
                        if (rep["error"][i] != "" && (localStorage.showerror == "true" || localStorage.showerror == null)){
                            textContent += `<br>====== ERROR ========<br>${decodeURIComponent(rep["error"][i]).replaceAll("\n","<br>")}`;
                        }   

                        textContent +="<br><br><br>"
                    }
                    document.getElementById("output").innerHTML = textContent;


                    // Get the new best score (not sure there is one)
                    function getNewBestAnswer(){
                        let problem_id = new URL(window.location.href).searchParams.get("id");
                        const xhttp8 = new XMLHttpRequest();
                        
                        xhttp8.open("POST", "https://week.golf/getBestAnswer.php", true);
                        xhttp8.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhttp8.send(`t=${localStorage.token}&id=${problem_id}&l=${localStorage.selectedLanguage}`);

                        // Get name problem
                        xhttp8.onload = function(){
                            const rep = JSON.parse(xhttp8.responseText);
                            bestAnswer =  rep["code"];
                            bestAnswerLang =  rep["lang"];
                        }
                    }
                    getNewBestAnswer();
                    getTheLeaderBoard()
                }
            }

            // Change the Selected language for the IDE
            function changeSelectedLanguageIde(nameLang){
                const div = document.getElementById("selected_language");
                div.innerHTML = nameLang;

                const correspondance = {
                    "Apl": "apl",
                    "Bash": "sh",
                    "C++": "c_cpp",
                    "C": "c_cpp",
                    "C#": "csharp",
                    "Clojure":"clojure",
                    "Elixir":"elixir",
                    "Go":"golang",
                    "Golfscript":"golfscript",
                    "Haskell":"haskell",
                    "J":"php",
                    "Javascript": "javascript",
                    "Java":"java",
                    "Jelly":"php",
                    "Julia":"julia",
                    "K":"php",
                    "Kotlin":"kotlin",
                    "Lua":"lua",
                    "Node": "javascript",
                    "Ocaml":"ocaml",
                    "Perl": "perl",
                    "Php": "php",
                    "Prolog": "prolog",
                    "Python": "python",
                    "R": "r",
                    "Raku": "raku",
                    "Ruby": "ruby",
                    "Rust": "rust",
                    "Vyxal": "php"
                }
                let mainIde = document.getElementById("mainIde");

                editor = ace.edit("mainIde");
                // Changing color in IDE
                console.log(`ace/mode/${correspondance[nameLang]}`)
                editor.session.setMode(`ace/mode/${correspondance[nameLang]}`);
                solutions(correspondance[nameLang])
            }
        </script>

        <?php
            if ($show_solution_bool){
        ?>
        <!-- Bulb -->
        <script defer>
            // Show solution from the bulb;
            function sol(){
                
                const bulb = document.getElementById("bulb_content");
                const solution = document.getElementById("solution_content");
                const solutionBox = document.getElementsByClassName("solutionBox");
                const s = parseInt(window.getComputedStyle(bulb).width)
                let bool = (parseFloat(s) < 82);

                if (bool){
                    const width = parseInt(window.innerWidth) > 600;
                    let theWidth = "";
                    let marginLeft = "";
                    if (width){
                        theWidth = "95%";
                        marginLeft = "2.5%";
                    } else {
                        theWidth = "95%";
                        marginLeft = "2.5%";
                    }
                    bulb.style.width = theWidth;
                    bulb.style.marginLeft = marginLeft ;
                    bulb.style.borderRadius = "0px";
                    bulb.style.borderTopLeftRadius = "20px";
                    bulb.style.borderTopRightRadius = "20px";

                    solution.style.width = theWidth;
                    solution.style.marginLeft = marginLeft ;
                    solution.style.height = "auto";
                    solution.style.paddingTop = "20px";
                    solution.style.paddingBottom = "20px";
                    
                } else {
                    bulb.style.width = (bool)?"95%":"80px";
                    bulb.style.marginLeft = (bool)?"2.5%":'calc(50% - 40px)';
                    bulb.style.borderRadius = (bool)?"0px":'50%';
                    bulb.style.borderTopLeftRadius = (bool)?"20px":'';
                    bulb.style.borderTopRightRadius = (bool)?"20px":'';

                    solution.style.width ="0px";
                    solution.style.height = "0px";
                    solution.style.marginLeft ='50%';
                    solution.style.paddingTop = '0px';
                    solution.style.paddingBottom = '0px';
                }
                

                for (let i = 0; i < solutionBox.length;i++)
                    solutionBox[i].style.display = (bool)?"table":"none";

                setTimeout(set, 1);
            }

            function set(){
                // const comments = document.getElementsByClassName("comments");
                // for (let i = 0; i < comments.length;i++){
                //     comments[i].style.height = document.getElementsByClassName("the_comment")[i].offsetHeight+"px";
                // }
            }
        </script>

        <!-- Upvote -->
        <script defer>
            // When an upvote button is clicked
            function upVote(arr){

                // Style
                document.getElementsByClassName("upvote_img")[arr[0]*2].style.display = arr[1] === 1 ? "block" : "none";
                document.getElementsByClassName("upvote_img")[arr[0]*2+1].style.display = arr[1] === 1 ? "none" : "block";
                document.getElementsByClassName("nb_upvote")[arr[0]].textContent = ""+(parseInt(document.getElementsByClassName("nb_upvote")[arr[0]].textContent) + -arr[1] * 2 + 1);
                
                // Request
                const xhttp7 = new XMLHttpRequest();
                xhttp7.open("POST", "https://week.golf/upvoteComment.php", true);
                xhttp7.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp7.send(`id=${document.getElementsByClassName("comments")[arr[0]].getAttribute('comment_id')}&t=${localStorage.token}`);
                xhttp7.onload = function(){
                    console.log(xhttp7.responseText);
                }
            }

            const comments = document.getElementsByClassName("comments");

            for (let i = 0; i < comments.length; i++){
                comments[i].style.height = document.getElementsByClassName("the_comment")[i].offsetHeight;
            }
        </script>

        <!-- Sending comments -->
        <script>

            let selected_answer_id = 0;

            // SEND COMMENTS
            ////////////////
            function sendComment(){
                // Content of the comment
                const content = document.getElementsByClassName("text_area_comment")[0].value;
                const button_show_solution = document.getElementsByClassName("button_show_solution");
                let id = -1;
                for (let i = 0; i < button_show_solution.length ; i++){
                    if (button_show_solution[i].getAttribute("golf_id") == selected_answer_id){
                        id = button_show_solution[i].getAttribute("golf_id");
                        break;
                    }
                }
                const t = localStorage.token;
                const xhttp4 = new XMLHttpRequest();
                xhttp4.open("POST", "https://week.golf/addComment.php", true);
                xhttp4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp4.send(`id=${id}&c=${encodeURIComponent(content)}&t=${t}`);
                xhttp4.onload = function () {
                    if (xhttp4.responseText === "Comment added :)"){

                        document.getElementById("comment_section").innerHTML += `
                        <div class="comments" style="overflow: hidden; min-height: auto; height: auto;" golfid="${id}" comment_id="-1">
                            <div style="height: 100%; width: 70px; position: relative;display: table; float: left; margin-top: 10px;">
                                <div class="vertical-align">
                                    <img src="img/upvotewhite.svg" class="upvote_img" onclick="upVote([999,0])">
                                    <img src="img/upvotegreen.svg" class="upvote_img" onclick="upVote([999,1])" style="display: none;">
                                    <div class="nb_upvote">0</div>
                                </div>
                            </div>
                            <div class="the_comment" style="color: #fff; font-size: 14px">
                                ${content.replaceAll("<","&lt;")}
                            </div>
                            
                            <div class="comment_owner" style="margin-top: 5px;">
                                <span style="font-weight: 300;">0 second ago -</span> You
                            </div>
                        </div>`
                    }
                }
            }
        </script>

        <!-- Show code/solution -->
        <script defer>
            // GLOBAL COUNT OF COMMENTS
            let count = 0;

            // REPLACE &amp; &lt; &gt; etc... BY THERE REAL SIGN
            //////////////////////////////////////////////////////
            function escapeHtml(str) {
                return str.replaceAll("&amp;", `&`).replaceAll("&lt;", `<`).replaceAll("&gt;", `>`).replaceAll("&quot;", `"`).replaceAll("&#039;", `'`);
            }

            // SHOW A GOLF SOLUTION BY GOLF_ID
            ///////////////////////////////////
            function showGolf(golf_id, title, owner_name, owner_id){
                let code = escapeHtml(document.getElementById("" + golf_id).innerHTML);
                const comment = document.getElementsByClassName("comments");
                count = 0;
                selected_answer_id = golf_id;

                // Set the code to the IDE
                ace.edit("solution_ide_0").setValue(code, -1);

                // Set the title
                document.getElementById("solution_title").textContent = title;

                // HREF and Content of the <a>
                document.getElementById("ownername").href = `https://week.golf/profile.php?id=${owner_id}`;
                document.getElementById("ownername").textContent = owner_name;

                for (let i = 0; i < comments.length; i++){
                    comments[i].style.display = comments[i].getAttribute("golfid") == golf_id ? "block" : "none";
                    count += comments[i].getAttribute("golfid") == golf_id ? 1 : 0;
                }

                document.getElementById("comment_section_container").style.width = 350 + 310 * count + "px";
            }


            // SHOW CHOOSING BUTTONS WHEN THE LANG IS CHANGED
            //////////////////////////////////////////////////
            function showLangGolf(lang){
                // Get the button
                const button_show_solution = document.getElementsByClassName("button_show_solution");
                let first = true;
                let first_index = "";

                // Foreach buttons
                for (let i = 0; i < button_show_solution.length; i++){
                    
                    if(button_show_solution[i].getAttribute("lang") == lang){
                        button_show_solution[i].style.display = "block";
                        // If its the first
                        if (first) {
                            first = false;
                            first_index = i;
                            // first_cmd = `${button_show_solution[i].onclick}`.split("\n")[1];
                        }
                    } else {
                        button_show_solution[i].style.display = "none";
                    }
                }

                // If there is more than one element
                if (!first)
                    eval(`${button_show_solution[first_index].onclick}`.split("\n")[1]);
            }

            
            // CHANGE COMMENT STATE FOR BEING RESPONSIVE
            ////////////////////////////////////////////
            function commentResponsive(){
                // Get objects
                const comment_section = document.getElementById("comment_section");
                const first_div = comment_section.getElementsByTagName("div")[0];
                const comment_owner = document.getElementsByClassName("comment_owner");

                // If small
                if (parseInt(window.innerWidth) <= 1000){
                    comment_section.style.width = parseInt(window.innerWidth) * 0.95 + "px";
                    first_div.style.cssText = `display: flex; overflow: visible; height: 100%; width: ${350 + 310 * count}px`;
                    for (comment of comment_owner){
                        comment.style.marginTop = "-35px"
                    }
                } else {
                    comment_section.style.width = "250px";
                    first_div.style.all = "unset";
                    for (comment of comment_owner){
                        comment.style.marginTop = "5px"
                    }
                }
            }



            // FILTER SOLUTIONS
            //////////////////////////
            function filterSolutions(event) {

                const username = document.getElementById("filter_golf_username").value;
                const size = document.getElementById("filter_golf_size").value;
                const lang = localStorage.selectedLanguage.toLowerCase();
                const button_show_solution = document.getElementsByClassName("button_show_solution");

                const b1 = size[0] != '>' && size[0] != '<';
                const b2 =  size[0] == '>';

                
                for (let i = 0; i < button_show_solution.length; i++) {
                    const btn = button_show_solution[i];
                    if (btn.getAttribute("lang") != lang || (!btn.getAttribute("name").includes(username) && username != "")) {
                        btn.style.display = "none";
                    } else {
                        if (size != "") {
                            if (b1) { // if not in "><"
                                btn.style.display = btn.getAttribute("size").includes(size) ? "block" : "none" ;
                            } else if (b2){ // If its '>'
                                btn.style.display = btn.getAttribute("size") >+ size.slice(1)? "block" : "none" ;
                            } else {
                                btn.style.display = btn.getAttribute("size") <+ size.slice(1)? "block" : "none" ;
                            }
                        } else {
                            btn.style.display = "block";
                        }
                    }
                }
            }





            // GET COMMENTS THAT HAVE BEEN UPVOTED BY THE USER
            //////////////////////////////////////////////////
            const xhttp_solution = new XMLHttpRequest();

            xhttp_solution.open("POST", "https://week.golf/getPersonalUpvotes.php", true);
            xhttp_solution.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhttp_solution.send(`t=${localStorage.token}`);

            xhttp_solution.onload = function() {
                const rep = JSON.parse(xhttp_solution.responseText);

                if (rep === null){
                    alert("TOKEN ERROR.");
                    return 1;
                }

                const arr_comments = rep["comments"];
                const comments = document.getElementsByClassName("comments");
                for (let i = 0; i < comments.length; i++){
                    if (arr_comments.includes(parseInt(comments[i].getAttribute("comment_id")))){
                        document.getElementsByClassName("upvote_img")[i * 2].style.display = "none";
                        document.getElementsByClassName("upvote_img")[i * 2 + 1].style.display = "block";
                    }
                }
            }


            commentResponsive();
            window.addEventListener("resize", commentResponsive);
            document.getElementById("selector_lang_img").src = `img/${localStorage.selectedLanguage}_white.svg`;
            document.getElementById("filter_golf_username").addEventListener("keydown", function(){setTimeout(filterSolutions,100)});
            document.getElementById("filter_golf_size").addEventListener("keydown",  function(){setTimeout(filterSolutions,100)});
            
        </script>
        <?php
            }
        ?>

        <!-- Get My best answer -->
        <script>
            
            let problem_id = new URL(window.location.href).searchParams.get("id");
            const xhttp9 = new XMLHttpRequest();
            

            xhttp9.open("POST", "https://week.golf/getBestAnswer.php", true);
            xhttp9.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp9.send(`t=${localStorage.token}&id=${problem_id}&l=${localStorage.selectedLanguage}`);


            xhttp9.onload = function(){
                const rep = JSON.parse(xhttp9.responseText);

                bestAnswer = rep["code"];
                bestAnswerLang = rep["lang"];
                changingLanguage((localStorage.selectedLanguage == null) ? 21 : sorted_languages.indexOf(localStorage.selectedLanguage), first = true);
            }
        </script>


        <!-- Close && Changing the lang on the hole page -->
        <script>

            // Close the language pannel selector
            //////////////////////////////////////
            function closing(){
                const pannel = document.getElementsByClassName("language_pannel_selector");
                const b = window.getComputedStyle(pannel[0]).display === "none";
                for (let i = 0; i < pannel.length; i++){
                    pannel[i].style.display = b ? "block" : "none";
                }
                selectLanguage();
            }



            // Changing the language in the ALL page
            /////////////////////////////////////////
            function changingLanguage(n, first = false) {
                
                // Reseting all small box by default
                languages_small_box = document.getElementsByClassName("languages_small_box");
                for (let i = 0; i <  languages_small_box.length; i++){
                    languages_small_box[i].getElementsByClassName("boxContent")[0].style.right = "100%";
                    languages_small_box[i].getElementsByClassName("image_colored")[0].style.display = "block";
                    languages_small_box[i].getElementsByClassName("image_white")[0].style.display = "none";
                }

                // Displaying the small boxes selected
                languages_small_box[n].getElementsByClassName("boxContent")[0].style.right = "0";
                languages_small_box[n].getElementsByClassName("image_colored")[0].style.display = "none";
                languages_small_box[n].getElementsByClassName("image_white")[0].style.display = "block";

                // Updating language in localStorage
                localStorage.selectedLanguage = sorted_languages[n];

                // Changing the name of the selected language in the green button
                document.getElementById("selected_language").textContent = (sorted_languages[n] != "cs" )?sorted_languages[n][0].toUpperCase() + sorted_languages[n].substring(1).toLowerCase():"C#";
                
                // Changing the selected language for the IDE
                changeSelectedLanguageIde(( sorted_languages[n] != "cs" ) ? sorted_languages[n][0].toUpperCase() + sorted_languages[n].substring(1).toLowerCase():"C#");
    
                // Changing the leaderboard lang
                showLeaderboard(localStorage.selectedLanguage);

                // Changing the image for history
                document.getElementById("history_image_lang").src = `img/${localStorage.selectedLanguage}_white.svg`;

                // Get the new history
                getHistory();

                // Change IDE content
                //////////////////////
                // localStorage answer
                if (localStorage["<?= $request_id ?>" + sorted_languages[n]] != null){
                    mainIde.setValue( localStorage["<?= $request_id ?>" + sorted_languages[n]], -1 );
                    console.log("Changed code from localStorage");
                }
                // Best answer
                else if (bestAnswerLang != null && bestAnswerLang != []){
                    current_lang = localStorage.selectedLanguage.replace("c++","cpp").replace("c#","cs")
                    mainIde.setValue( bestAnswerLang.includes(current_lang) ? bestAnswer[bestAnswerLang.indexOf(current_lang)] : dic[localStorage.selectedLanguage], -1);
                    console.log("Changed code from the best answer");
                }
                // Else default content
                else {
                    mainIde.setValue(dic[localStorage.selectedLanguage], -1);
                    console.log("Changed code from the default code");
                }
                

                <?php
                    if ($show_solution_bool){
                ?>
                    document.getElementById("selector_lang_img").src = `img/${sorted_languages[n]}_white.svg`;
                    showLangGolf(sorted_languages[n]);
                <?php
                    }
                ?>

                setTimeout(function(){
                    document.getElementsByClassName("language_pannel_selector")[0].style.display = "none";
                },200)
            }
        </script>

        <!-- Resize the "select language"-->
        <script>
            function selectLanguage(){

                // Resize the Language pannel selector when the window is resized //
                
                const pannel = document.getElementsByClassName("language_pannel_selector");
                const h = parseFloat(window.getComputedStyle(pannel[0]).height);
                
                for (let i = 0; i < pannel.length;i++){
                    pannel[i].style.marginTop = window.innerHeight/2 - h/2 + "px";
                }
            }
            selectLanguage();
            window.addEventListener("resize", selectLanguage);
        </script>

        <!-- Remaining time -->
        <script>
            <?php
                $result = $conn -> query("SELECT UNIX_TIMESTAMP( date_end ) - UNIX_TIMESTAMP( NOW() ) FROM Problem WHERE id = $request_id;");
                $time_remaining = $result -> fetch_assoc()["UNIX_TIMESTAMP( date_end ) - UNIX_TIMESTAMP( NOW() )"]; 
            ?>
            let t = <?= $time_remaining ?>;

            function wait(){
                const timeDiv = document.getElementById("time").getElementsByClassName("vertical-align")[0];
                let d = Math.floor(t /86400); 
                let h = Math.floor(t / 3600)%24;
                let m = Math.floor(t / 60)%60;
                let s = t%60;
                timeDiv.textContent = t>0?`Remaining time: ${d}d ${h}h ${m}m ${s}s`:"FINISHED!";
                t--;
            }
            setInterval(wait, 1000);
        </script>

        <!-- Number of byte -->
        <script>
            const nbBytes = document.getElementById("nb_byte");
            window.setInterval(function(){
                let code = mainIde.getValue().replaceAll("\r\n","\n");
                if (localStorage.selectedLanguage  != "vyxal" && localStorage.selectedLanguage != "jelly"  && localStorage.selectedLanguage != "apl"){
                    var size = (new TextEncoder().encode(code)).length;
                } else {
                    var str_vyxal;
                    if (localStorage.selectedLanguage == "vyxal")
                        str_vyxal = "λƛ¬∧⟑∨⟇÷×«\n»°•ß†€½∆ø↔¢⌐æʀʁɾɽÞƈ∞¨ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]`^_abcdefghijklmnopqrstuvwxyz{|}~↑↓∴∵›‹∷¤ð→←βτȧḃċḋėḟġḣḭŀṁṅȯṗṙṡṫẇẋẏż√⟨⟩‛₀₁₂₃₄₅₆₇₈¶⁋§ε¡∑¦≈µȦḂĊḊĖḞĠḢİĿṀṄȮṖṘṠṪẆẊẎŻ₌₍⁰¹²∇⌈⌊¯±₴…□↳↲⋏⋎꘍ꜝ℅≤≥≠⁼ƒɖ∪∩⊍£¥⇧⇩ǍǎǏǐǑǒǓǔ⁽‡≬⁺↵⅛¼¾Π„‟";
                    else if (localStorage.selectedLanguage == "apl")
                        str_vyxal = "⌶%'⍺⍵_abcdefghijklmnopqrstuvwxyz¯.⍬0123456789⊢$∆ABCDEFGHIJKLMNOPQRSTUVWXYZ?⍙ÁÂÃÇÈÊËÌÍÎÏÐÒÓÔÕÙÚÛÝþãìðòõ{}⊣⌷¨ÀÄÅÆ⍨ÉÑÖØÜßàáâäåæçèéêëíîïñ[/⌿\\⍀<≤=≥>≠∨∧-+÷×?∊⍴~↑↓⍳○*⌈⌊∇∘(⊂⊃∩∪⊥⊤|;,⍱⍲⍒⍋⍉⌽⊖⍟⌹!⍕⍎⍫⍪≡≢óôöø\"#&┘┐┌└┼─├┤┴┬│@ùúû^ü`:⍷⋄←→⍝)]⎕⍞⍣\n ⊆⍠⍤⌸⌺⍸⍥⍢√⊇…⌾⍮⍭⍧⍛";
                    else
                        str_vyxal = "¡¢£¤¥¦©¬®µ½¿€ÆÇÐÑ×ØŒÞßæçðıȷñ÷øœþ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¶\n°¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ƁƇƊƑƓƘⱮƝƤƬƲȤɓƈɗƒɠɦƙɱɲƥʠɼʂƭʋȥẠḄḌẸḤỊḲḶṂṆỌṚṢṬỤṾẈỴẒȦḂĊḊĖḞĠḢİĿṀṄȮṖṘṠṪẆẊẎŻạḅḍẹḥịḳḷṃṇọṛṣṭ§Äẉỵẓȧḃċḋėḟġḣŀṁṅȯṗṙṡṫẇẋẏż«»‘’“”";
                    var size = 0;
                    for (let c = 0; c < code.length; c++){
                        if (str_vyxal.includes(code[c])){
                            size ++;
                        } else {
                            size += 2;
                        }
                    }
                }
                const new_description = size + " byte"+(size==1?"":"s") + (localStorage.cursorposition == "true" ? getCursorPosition() : "");
                if (new_description !== nbBytes.innerHTML)
                    nbBytes.innerHTML = new_description;
            }, 100);
        </script>

        <!-- Saving code -->
        <script>
            window.setInterval(function(){
                let code = mainIde.getValue();
                localStorage.setItem("<?= $request_id ?>" + localStorage.selectedLanguage, code);
            }, 5000);
        </script>


        <!-- Delete & Reset code -->
        <script>
            function deleteCode(){
                console.log("Deleted code");
                if (localStorage.tab == "true")
                    mainIde.setValue( dic[localStorage.selectedLanguage].replaceAll("    ","\t"), -1);
                else 
                    mainIde.setValue( dic[localStorage.selectedLanguage], -1);
            }

            function resetCode(){
                console.log("Reset code");

                current_lang = localStorage.selectedLanguage.replace("c++","cpp").replace("c#","cs")

                if (bestAnswerLang.includes(current_lang))
                    mainIde.setValue( bestAnswer[bestAnswerLang.indexOf(current_lang)], -1);
                else
                    deleteCode();
            }
        </script>


        <!-- Height of leaderboard -->
        <script defer>
            document.getElementById("leaderboard_users").style.height = window.getComputedStyle(document.getElementById("leaderboard_languages")).height;
        </script>


        <!-- Output -->
        <script>

            // Resizing the height of the ouput
            ////////////////////////////////////
            function resizeOutputHeight(){

                // If the height is less than 400px, the height of the table := height output //

                const heightOutput = parseInt(window.getComputedStyle(document.getElementById("output")).height);
                if (heightOutput < 400){
                    document.getElementById("table_output").style.height = heightOutput + "px";
                }
            }

            // Resizingthe width of the output
            //////////////////////////////////
            function resizeOutputWidth(){

                // When resize the window, let the output be responsive //
                document.getElementById("output").style.width = parseInt(window.innerWidth) * 0.9 - 14 - 10 + "px";
            }


            // Events
            ////////////////////
            window.addEventListener("resize", resizeOutputWidth);
            new ResizeObserver(resizeOutputHeight).observe(document.getElementById("output"))
            
            // Execute it 
            resizeOutputWidth();
        </script>


        <!-- Settings Button -->
        <script>
            let settings = document.getElementById("settings_button");
            let header_settings = document.getElementById("settings_header");

            function openSettings(){
                const b = settings.getAttribute("value") == 0;

                // Closed => Open it
                if (b) {
                    settings.style.width = "60px";
                    settings.style.marginLeft = "5%";
                    header_settings.style.width = "60px";

                    setTimeout(function(){
                        settings.style.height = "300px";
                        settings.style.width = "90%";
                        header_settings.style.borderTopRightRadius = "0px";
                        header_settings.style.borderBottomRightRadius = "0px";
                    }, 110);
                }
                // Else => close it
                else {
                    settings.style.height = "60px";
                    header_settings.style.borderRadius = "5px";

                    setTimeout(function(){
                        header_settings.style.width = "100%";
                        settings.style.width = "90%";
                        settings.style.marginLeft = "5%";
                    }, 110);

                }

                settings.setAttribute("value", b?1:0);
            }

            header_settings.addEventListener("click", openSettings);
        </script>


        <!-- KeyBoard -->
        <script>
            const vyxal_keyboard = document.getElementById("vyxal_keyboard");
            const apl_keyboard = document.getElementById("apl_keyboard");

            
            // Function to add chars when you click on them
            ///////////////////////////////////////////////
            function addChar(event){
                const element = event.currentTarget;
                const char = element.textContent.replace(/\s/g, "");
                const mainIde = ace.edit("mainIde");

                element.style.backgroundColor = "var(--lighter-color-2)";
                mainIde.session.insert(mainIde.getCursorPosition(), char);

                setTimeout(function(){
                    element.style.backgroundColor = "var(--darker-color)"
                }, 200);
            }

            // Function to remove event listener from keys
            ///////////////////////////////////////////////
            function removeEventListenerFromKeys(lang){
                let arr = document.getElementsByClassName(`char_${lang}`);

                for (let i = 0; i < arr.length; i++){
                    arr[i].removeEventListener("click", addChar);
                }
            } 

            // Function to remove event listener from keys
            ///////////////////////////////////////////////
            function addEventListenerFromKeys(lang){
                let arr = document.getElementsByClassName(`char_${lang}`);

                for (let i = 0; i < arr.length; i++){
                    arr[i].addEventListener("click", addChar);
                }
            } 

            if (localStorage.keyboard == null)
                localStorage.keyboard = "none";

            if (localStorage.keyboard == "vyxal"){
                vyxal_keyboard.style.display = "vyxal";
                addEventListenerFromKeys("vyxal");
            } else if (localStorage.keyboard == "apl"){
                apl_keyboard.style.display = "apl";
                addEventListenerFromKeys("apl");
            }



            vyxal_keyboard.style.display = localStorage.keyboard == "vyxal" ? "flex" : "none";
            apl_keyboard.style.display = localStorage.keyboard == "apl" ? "flex" : "none";

            // Vyxal Button
            ///////////////////////
            document.getElementById("vyxal_kb_bt").addEventListener("click", function(){
                if (localStorage.keyboard == "vyxal"){
                    vyxal_keyboard.style.display =  "none";
                    apl_keyboard.style.display =  "none";
                    localStorage.keyboard = "none";
                    removeEventListenerFromKeys("vyxal");
                } else {
                    vyxal_keyboard.style.display =  "flex";
                    apl_keyboard.style.display =  "none";
                    localStorage.keyboard = "vyxal";
                    removeEventListenerFromKeys("apl");
                    addEventListenerFromKeys("vyxal");
                }
            });

            // APL Button
            ///////////////////////
            document.getElementById("apl_kb_bt").addEventListener("click", function(){
                if (localStorage.keyboard == "apl"){
                    vyxal_keyboard.style.display =  "none";
                    apl_keyboard.style.display =  "none";
                    localStorage.keyboard = "none";
                    removeEventListenerFromKeys("apl");
                } else {
                    vyxal_keyboard.style.display =  "none";
                    apl_keyboard.style.display =  "flex";
                    localStorage.keyboard = "apl";
                    removeEventListenerFromKeys("vyxal");
                    addEventListenerFromKeys("apl");
                }
            });

            // None Button
            ////////////////////////////
            document.getElementById("none_kb_bt").addEventListener("click", function(){
                vyxal_keyboard.style.display = "none";
                apl_keyboard.style.display = "none";
                removeEventListenerFromKeys("vyxal");
                removeEventListenerFromKeys("apl");
                localStorage.keyboard = "none" ;
            });
        </script>

        <!-- More info -->
        <script>
            function moreInfo(){
                const mi = document.getElementById('more_info');
                const b = mi.getAttribute('value')=='0';
                mi.style.display = b ? 'block' : 'none';
                mi.setAttribute('value', b ? '1' : '0')
            }
        </script>


        <!-- Send and delete note at the bottom of the page -->
        <script>
            let global_note = -1;
            let stars = document.getElementsByClassName("star");

            // Update the stars
            function star(n) {
                global_note = n;

                const hueRotateDic = {
                    "green": 0,
                    "yellow": -50,
                    "orange": -100,
                    "red": -120,
                    "purple": -210,
                    "blue": -240,
                    "cyan": -305,
                }

                const hueRotate = hueRotateDic[localStorage.colorTheme ? localStorage.colorTheme : "green"];

                for (let i = 0; i < 10; i++){
                    stars[i].src = i > n ? "img/star_off.svg" : "img/star_on.svg";
                    stars[i].style.filter = i > n ? "drop-shadow(0 0 10px #0f00)" : `drop-shadow(0 0 10px #0f0) hue-rotate(${hueRotate}deg)`;
                }
            }


            // Delete note
            function sendNote(){
                const xhttpSendNote = new XMLHttpRequest();
                xhttpSendNote.open("POST", "https://week.golf/noteProblem.php", true); // Sending POST request
                xhttpSendNote.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // Header
                xhttpSendNote.send(`t=${localStorage.token}&pid=<?= $request_id ?>&n=${global_note}`); // Sending

                xhttpSendNote.onload = function() {
                    if (xhttpSendNote.responseText === "Success"){
                        document.getElementById("del_vote").style.cursor = "pointer";
                        document.getElementById("del_vote").style.backgroundColor = "#3f3";
                    }
                }
            }

            function delNote(){
                const xhttpDeleteNote = new XMLHttpRequest();
                xhttpDeleteNote.open("POST", "https://week.golf/noteProblem.php", true); // Sending POST request
                xhttpDeleteNote.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // Header
                xhttpDeleteNote.send(`t=${localStorage.token}&pid=<?= $request_id ?>&n=-1`); // Sending
            }



            const xhttp3 = new XMLHttpRequest();
            xhttp3.open("POST", "https://week.golf/getNoteOfUser.php", true); // Sending POST request
            xhttp3.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // Header
            xhttp3.send(`t=${localStorage.token}&pid=<?= $request_id ?>`); // Sending

            xhttp3.onload = function() {
                const rep = xhttp3.responseText;
                if (+rep === -1){
                    document.getElementById("del_vote").style.cursor = "not-allowed";
                    document.getElementById("del_vote").style.backgroundColor = "#282828";
                } else {
                    star(rep - 1);
                }
            }
        </script>

        <?php
            if (!$show_solution_bool){
        ?>
        <!-- Language Of the Week -->
        <script defer>
            let time = document.getElementById("time"); // The div where there is the time
            let content_lotw = document.getElementById("content_lotw"); // The div where there is all the content
            let header_lotw = document.getElementById("header_lotw"); // The div where is the header
            let picker_lotw = document.getElementById("picker_lotw"); // The div of the picker content
            let button_picker_lotw = document.getElementById("button_picker_lotw"); // The div of the picker content
            let scroll_content = document.getElementById("scroll_content"); // The scroll for the content
            let button_lotw = document.getElementById("button_lotw"); // The button to change the lang
            let isSticky = true;
            let lang_selected_lotw = '<?= LOTW ?>';
            const LOTW = '<?= LOTW ?>';
            let storage_lang_info = {};


            

            // ACE 
            lotwIde = ace.edit("lotwIde");
            lotwIde.setTheme("ace/theme/monokai");
            lotwIde.session.setMode(`ace/mode/${lang_selected_lotw in correspondance ? correspondance[lang_selected_lotw] : "python"}`);
            lotwIde.setOptions ({
                fontFamily: "monospace",
                fontSize: 20,
                animatedScroll: true,
                maxLines: Infinity,
                copyWithEmptySelection: true
            });
            lotwIde.setValue(`<?= $program ?>`, 1);
            lotwIde.session.setUseWorker(false);
            lotwIde.setShowPrintMargin(false);
            lotwIde.setReadOnly(true);




            //////////////////////////////////
            ////////// FUNCTIONS /////////////
            //////////////////////////////////
            // Function to change a name of a language to a beautiful format
            function setCorrectName(lang) {
                lang = capitalize(lang);

                switch (lang){
                    case "Apl":
                        return "APL";
                    case "Cs":
                        return "C#";
                    case "Cpp":
                        return "C++";
                    case "Ocaml":
                        return "OCaml";
                    case "Javascript":
                        return "JavaScript";
                    case "Golfscript":
                        return "GolfScript";
                    case "Php":
                        return "PHP";
                    case "Php":
                        return "PHP";
                    default:
                        return lang;
                }
            }


            // Function for when you scroll on the page
            function scrollLOTW (){
                if (content_lotw.getAttribute("show") == 0){
                    let scroll_y_div = time.getBoundingClientRect().top;
                    let scroll_y_window = window.scrollY;

                    // If we have scrolled beyond the problem description
                    if (scroll_y_div < 192) {
                        content_lotw.style.top = scroll_y_window + scroll_y_div - 95 + "px"; 
                        content_lotw.style.position = "absolute"; 
                        isSticky = false;
                    } else if (!isSticky) {
                        content_lotw.style.top = "100px"; 
                        content_lotw.style.position = "sticky"; 
                        isSticky = true;
                    }
                }
            }

            
            // Function to show the language of the week
            function showLOTW(){
                lang_selected_lotw = LOTW;
                showPicker();
                lang_selected_lotw = LOTW;
                showPicker();
                
                // If its 0 <=> If its hidden
                if (content_lotw.getAttribute("show") == 0){
                    content_lotw.style.cssText = `
                    position: fixed;
                    width: 80%;
                    margin-left: 10%;
                    left: 0%;
                    top: 130px;
                    transition: .2s;
                    height: 80%;
                    box-shadow: 0px 5px 15px #000;
                    background-color: #181818;`

                    header_lotw.style.cssText = `width: 100%;
                    text-align: center;
                    border-radius: 0px;`

                    picker_lotw.style.marginLeft = "-72%";
                } else {
                    content_lotw.style.height = "75px";
                    picker_lotw.style.marginLeft = "-82%";

                    setTimeout(function(){
                        content_lotw.style.cssText = `
                        position: sticky;
                        width: 75px;
                        margin-left: 0px;
                        left: calc(7.5% - 37.5px);
                        top: 90px;
                        transition: .5s;
                        height: 75px;
                        box-shadow: 0px 0px 0px #000;
                        background-color: #181818;`
                        header_lotw.style.cssText = `width: 75px;
                        border-radius: 100px;`
                        scrollLOTW();
                    }, 200);

                    setTimeout(function(){
                        content_lotw.style.background = "#0000";
                        content_lotw.style.transition = "0s";
                        header_lotw.style.textAlign = "left";
                        scrollLOTW();
                    }, 500);
                }

                content_lotw.setAttribute("show", +!+content_lotw.getAttribute("show")); // +!+something <=> intParse(intParse(something) == 0). Some code golf tricks are sometimes OK here :p
                scrollLOTW();
            }


            // Function to show the picker of lotw
            function showPicker(){
                // If its 0 <=> If its hidden
                if (picker_lotw.getAttribute("show") == 0){
                    picker_lotw.style.marginLeft = "10%";
                } else {
                    getInfoLang(lang_selected_lotw);
                    document.getElementById("lang").innerHTML = setCorrectName(LOTW) + (lang_selected_lotw.toLowerCase() == LOTW.toLowerCase() ? "" : ` (${setCorrectName(lang_selected_lotw)})`);
                    
                    button_lotw.addEventListener("click", function(){
                        clickingButtonLotw(lang_selected_lotw);
                    });
                    picker_lotw.style.marginLeft = "-72%";
                }

                picker_lotw.setAttribute("show", +!+picker_lotw.getAttribute("show"));
            }


            // Change scroll when clicked
            function clickLang(n){
                scroll_content.scrollTop = n*130;
                setTimeout(showPicker, 500);
            }


            // Function to pick a lang when y ou scroll
            function pickLang(){
                    
                let lang_picker = document.getElementsByClassName("lang_picker");
                const margin_top = picker_lotw.getBoundingClientRect().y + 100 + scroll_content.clientHeight / 2;
                
                
                let the_lang = [...lang_picker].filter(e => e.getBoundingClientRect().y > margin_top - 75 && margin_top + 75 > e.getBoundingClientRect().y)
                
                for (let i = 0; i < lang_picker.length; i++){
                    lang_picker[i].style.backgroundColor = "#252525";
                    lang_picker[i].style.scale = "1";
                }
                
                if (the_lang.length > 0){
                    the_lang[0].style.backgroundColor = "var(--main-color)";
                    the_lang[0].style.scale = "1.05";
                    lang_selected_lotw = the_lang[0].innerHTML.replaceAll(" ","").replaceAll("\n","")
                }
            }


            // Update the scroll padding top to center things
            function updateScrollPaddingTop(){
                let val = parseInt(window.getComputedStyle(scroll_content).height)/2 - 40 + "px";
                let lang_picker = [...document.getElementsByClassName("lang_picker")];
                scroll_content.style.scrollPaddingTop = parseInt(window.getComputedStyle(scroll_content).height)/2 - 40 + "px";

                lang_picker[0].style.marginTop = val;
                lang_picker.slice(-1)[0].style.marginBottom = val;
            }
            updateScrollPaddingTop();

            

            // Get the informations (history, characteristics, program) of a lang
            function getInfoLang(lang) {

                let history;
                let cara;
                let code;

                if (!(lang in storage_lang_info)){
                    var getRequest = new XMLHttpRequest();
                    getRequest.open("GET", "https://week.golf/description.json", false);
                    getRequest.send(null);
                    storage_lang_info = JSON.parse(getRequest.responseText);
                }
                
                history = storage_lang_info[setCorrectName(lang)]["history"].replaceAll("\n","<br><br>");
                cara = storage_lang_info[setCorrectName(lang)]["characteristics"].split`\n`.map(e => e.replace("-",""));
                cara = "<li>"+cara.join`</li><li>`+"</li>";
                code = storage_lang_info[setCorrectName(lang)]["program"];

                document.getElementById("history").innerHTML = history;
                document.getElementById("characteristics").innerHTML = cara;
                lotwIde.setValue(code, 1);
                lotwIde.session.setMode(`ace/mode/${capitalize(lang) in correspondance ? correspondance[capitalize(lang)] : "python"}`);


            }


            // Change the language and scroll to it
            function clickingButtonLotw(lang) {
                let langIndex = [...languages_small_box].findIndex(e => e.getAttribute("lang").toLowerCase() == lang.toLowerCase());
                changingLanguage(langIndex);
                
                setTimeout(showLOTW, 100);
                setTimeout(function(){
                    picker_lotw.style.marginLeft = "-82%";
                    content_lotw.setAttribute("show", 0);
                }, 110);

                setTimeout( function(){
                    window.scrollTo(0, parseInt(document.getElementById("language_selector").offsetTop) - 120);
                }, 1000);
            }



            

            window.addEventListener("resize", updateScrollPaddingTop);
            window.addEventListener("scroll",  scrollLOTW);
            scroll_content.addEventListener("scroll",  pickLang);
            header_lotw.addEventListener("click",  showLOTW);
            button_picker_lotw.addEventListener("click",  showPicker);
        </script>
        <?php
        }
        ?>

        <!-- Shortcuts -->
        <script>
            window.addEventListener("keydown", (e) => {

                // If Ctrl key pressed
                if (window.event.ctrlKey){

                    // Execute code [ Ctrl + Enter ]
                    if (e.keyCode == 13) {
                        executeCode();
                    }

                    // Change language [ Ctrl + Alt + C ]
                    if (e.keyCode == 67 && window.event.altKey) {
                        closing();
                    }

                    // Delete code language [ Ctrl + Alt + D ]
                    if (e.keyCode == 68 && window.event.altKey) {
                        deleteCode();
                    }

                    // Delete code language [ Ctrl + Alt + S ]
                    if (e.keyCode == 83 && window.event.altKey) {
                        openSettings();
                    }

                    // Back to your best score [ Ctrl + Alt + Z ]
                    if (e.keyCode == 90 && window.event.altKey) {
                        resetCode();
                    }
                    
                    // See the history of your solutions [ Ctrl + Alt + H ]
                    if (e.keyCode == 72 && window.event.altKey) {
                        hideHistory();
                    }

                    // See the LOTW [ Ctrl + Alt + L ]
                    if (e.keyCode == 76 && window.event.altKey) {
                        showLOTW();
                    }

                    <?php 
                    if (!$last_problem){
                    ?>
                    // Next problem [ Ctrl + Alt + N ]
                    if (e.keyCode == 78 && window.event.altKey) {
                        window.location.href = "https://week.golf/challenge.php?id=<?= $request_id + 1?>"
                    }
                    <?php
                    }
                    ?>

                    <?php 
                    if (!$first_problem){
                    ?>
                    // "Before" problem [ Ctrl + Alt + B ]
                    if (e.keyCode == 66 && window.event.altKey) {
                        window.location.href = "https://week.golf/challenge.php?id=<?= $request_id - 1?>"
                    }
                    <?php 
                    }
                    ?>

                    <?php
                        if ($show_solution_bool){
                    ?>
                    // Up Solution [ Ctrl + Alt + Up ]
                    if (e.keyCode == 38 && window.event.altKey) {
                        window.location.href = "https://week.golf/challenge.php?id=<?= $request_id - 1?>"
                    }
                    // Down Solution [ Ctrl + Alt + Down ]
                    if (e.keyCode == 40 && window.event.altKey) {
                        window.location.href = "https://week.golf/challenge.php?id=<?= $request_id - 1?>"
                    }
                    <?php
                        }
                    ?>
                }
            });
        </script>
    </body>
</html>
