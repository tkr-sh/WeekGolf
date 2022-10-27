<!DOCTYPE html>
<html lang="en">
    <script>
        if ( window.location.href === "https://week.golf/profile.php" || window.location.href === "https://week.golf/profile.php?"){
            const xhttp = new XMLHttpRequest();


            xhttp.open("POST", "https://week.golf/getIdbyToken.php", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhttp.send(`t=${localStorage.token}`);

            xhttp.onload = function() {
                const rep = JSON.parse(xhttp.responseText);
                const user_id = rep["id"];
                
                if (user_id != "" && user_id != null)
                    window.location.href = "https://week.golf/profile.php?id="+user_id;
                else
                    window.location.href = "https://week.golf"
            }
        }
    </script>
    <head>
        <!-- 3ncoding -->
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- Title -->
        <title>WeekGolf</title>

        <!-- Icon -->
        <link rel="icon" href="https://i.imgur.com/9Pgc6UV.png">

        <!-- Color Theme -->
        <script src="color.js"></script>

        <!-- CSS -->
        <link href="style.css" rel="stylesheet" type="text/css" />
        <link href="header.css" rel="stylesheet" type="text/css" />
        <link href="footer.css" rel="stylesheet" type="text/css" />
        <link href="profile.css" rel="stylesheet" type="text/css" />

        <!-- Header Boucing -->
        <script src="header.js"></script>

        <!-- Scroll to Top -->
        <script src="scrolltop.js"></script>

        <script>
            function edit(){
                document.location.href = "https://week.golf/edit.html"
            }
        </script>

    </head>
    <body>
    <div id="blurall">
  
        <!-- Header -->
        <?php
            include_once "header.html";
        ?>

        <?php
            include_once "connectToDatabase.php";
            
            $user_id = $_GET["id"];
            $correct_id = $user_id != null;
            if ($correct_id){
                $sql = rsql("SELECT * FROM Users WHERE id = ?", [$user_id], "i");
                $correct_id = $sql -> num_rows > 0;
                if (!$correct_id){
                    echo "<script>window.location.href='profile.php';</script>";
                    exit;
                }
                $result = $sql -> fetch_assoc();
            }
        ?>
        <!-- Main -->
        <main>
            <!-- ( ͡° ͜ʖ ͡°) -->
            <div id="easter">( ͡° ͜ʖ ͡°)</div>

            <!-- Banner-->
            <div id="banner" style="background-image: <?= $correct_id && $result["banner"] !== null ? "url('".$result["banner"]."')": "url(img/banner.jpg)"?>"></div>
            <!-- Profile picture -->
            <div style="text-align: center;">
                <img src="<?= $correct_id && $result["pp"] !== null ? $result["pp"] : "img/nouser_white.jpg"?>" id="central_image">
            </div>

            <!-- Pannel -->
            <section id="pannel">
                <img src="img/edit.svg" id="edit" onclick="edit()">
                <article id="editxt" onclick="edit()">
                    Edit
                </article>

                <!-- Country -->
                <?php
                    if (strtolower($result["country"]) !== "xx"){
                ?>
                <div id="country_parent">
                    <img src="img/flags/<?= strtolower($result["country"]) ?>.svg" id="country">
                </div>
                <?php
                    }
                ?>

                <!-- Friend -->
                <button id="friendButton">
                    <div class="vertical-align" style="width: 999999px">
                        <div style="display: flex;" id="jstfyContent">
                            <img id="friendIcon" src="img/mirror.svg">
                            <div style="display: table;">
                                <div id="friendTXT">Hey, it's you!</div>
                            </div>
                        </div>
                    </div>
                </button>
                
                <?php
                    if ($result["discord_display"] == 1){
                ?>
                <!-- Discord -->
                <a href="https://discordapp.com/users/<?= $result["discord_id"] ?>" id="discord_link">
                    <button id="discordButton" style="width: auto; display: table">
                        <div style="display: flex;" id="jstfyContent">
                            <img id="discordIcon" src="img/discord.svg">
                            <div style="display: table;">
                                <div id="discordTXT"><?= $result["discord"] ?></div>
                            </div>
                        </div>
                    </button>
                </a>
                <?php
                    }
                ?>

                <!-- Username -->
                <article id="username">
                    <?= htmlspecialchars($result["username"]) ?>
                </article>

                <!-- Bio -->
                <dt id="bio">
                    <?= str_replace("\n", "<br>", htmlspecialchars($result["bio"])) ?>
                </dt>

                <!-- Pannel buttons -->
                <article id="buttons_pannel">
                    <table style="width: 100%; height: 100%; padding: 0;">
                        <tr  style="width: 100%; height: 100%;">
                            <td  style="width: 20%; height: 100%;"></td>

                            <td class="td_pannel" onclick="switch_sub('friends')">
                                <div class="text_in_button">
                                    <div class="vertical-align">Friends</div>
                                </div>
                                <div style="width: 100%;height: 10px;background-color: #fff; bottom: 0;"></div>
                            </td>

                            <td style="width: 7.5%; height: 100%;"></td>

                            <td class="td_pannel"  onclick="switch_sub('info')">
                                <div class="text_in_button">
                                    <div class="vertical-align">Information</div>
                                </div>
                                <div style="width: 100%;height: 10px;background-color: #fff; bottom: 0;"></div>
                            </td>

                            <td style="width: 7.5%; height: 100%;"></td>

                            <td class="td_pannel" onclick="switch_sub('activity')">
                                <div class="text_in_button">
                                    <div class="vertical-align">Activity</div>
                                </div>
                                <div style="width: 100%;height: 10px;background-color: #fff; bottom: 0;"></div>
                            </td>
                            <td style="width: 20%; height: 100%;"></td>
                        </tr>
                    </table>
                </article>
            </section>


            <!-- Sub -->
            <!-- Friends-->
            <section id="friends">
                <article id="friend_div">
                    <div class="section_title" onclick="arrow('friend')">
                        <div style="display:inline;">Friends</div>
                        <div id="nb_friends"> - 0</div>
                        <img class="arrow" src="img/arrow_down.svg" id="friend_arrow">
                    </div>
                    <div id="friend_content"></div>
                </article>

                <article id="follower_div">
                    <div class="section_title" onclick="arrow('follower')">
                        <div style="display:inline;">Followers</div>
                        <div id="nb_followers"> - 0</div>
                        <img class="arrow" src="img/arrow_down.svg" id="follower_arrow">
                    </div>
                    <div id="follower_content"></div>
                </article>

                <article id="following_div">
                    <div class="section_title" onclick="arrow('following')">
                        <div style="display:inline;">Followings</div>
                        <div id="nb_followings"> - 0</div>
                        <img class="arrow" src="img/arrow_down.svg" id="following_arrow">
                    </div>
                    <div id="following_content"></div>
                </article>
                <br>
                <br>
                <br>
                <br>
            </section>



            <!-- Informations -->
            <section id="info">
                <!-- Left Part-->
                <article id="score_left">
                    <div id="score_div">
                        <div class="responsive_div">
                            <!-- SCORE -->
                            <div class="name_section">Score</div>
                            <div class="line"></div>
                            <?php 
                            $tot_points = intval($result["golf_score"]) + intval($result["upgrade_score"]) + intval($result["coop_score"]);
                            ?>
                            <div class="text_in_section"><?= $tot_points ?> points</div>
                            <section class="repartition">
                                <?php
                                    foreach(["golf", "upgrade", "coop"] as $score){
                                ?>
                                <div id="repartition_<?= str_replace("golf","score",$score)?>" style="width: <?=  round( 100 * intval($result[$score."_score"]) / $tot_points, 1 ) ?>%"></div>
                                <?php
                                    }
                                ?>
                            </section>
                            <section class="pourcentage">
                                <?php
                                foreach(["golf_score", "upgrade_score", "coop_score"] as $score){
                                    $score_percent = round( 100 * intval($result[$score]) / $tot_points, 1 );
                                ?>
                                <div id="pourcentage_score" style="width: <?= $score_percent ?>%">
                                    <?= $score_percent ?>%
                                </div>
                                <?php
                                }
                                ?>
                            </section>

                            <div class="subtitle_div">  
                                <div class="subtitle" style="background-color: #08F;"></div>
                                <div class="vertical_align" style="margin-left: 10px"> Golf points</div>
                            </div>
                            <div class="subtitle_div">  
                                <div class="subtitle" style="background-color: #0b3;"></div>
                                <div class="vertical_align" style="margin-left: 10px"> Upgraded the answer</div>
                            </div> 
                            <div class="subtitle_div">  
                                <div class="subtitle" style="background-color: #f80;"></div>
                                <div class="vertical_align" style="margin-left: 10px"> Cooperation points</div>
                            </div>


                            <!-- LANGUAGE -->
                            <div class="name_section">Language</div>
                            <div class="line"></div>
                            <?php
                                # Calculate the sum
                                $sum = 0;
                                $dic_score = [];
                                $languages_result = rsql("SELECT * FROM Languages WHERE owner_id = ?", [$user_id], "i")->fetch_assoc();
                                $column_sql = $conn->query("SHOW COLUMNS FROM Languages");
                                if ($column_sql -> num_rows > 0) {
                                    while ($row = $column_sql -> fetch_assoc()) {
                                        if ($row['Field'] != 'owner_id'){
                                            $sum += $languages_result[$row['Field']];
                                            $dic_score[explode('_',$row['Field'])[0]] = $languages_result[$row['Field']];
                                        }
                                    }
                                }
                                arsort($dic_score);

                                # Dictionnary colorlang
                                $result_color = $conn->query("SELECT lang,color FROM ColorLang");
                                $dic_color = [];
                                while ($row = $result_color->fetch_assoc()){
                                    $dic_color[$row['lang']] = $row['color'];
                                }



                                # Embed PHP
                                foreach ($dic_score as $key => $value){
                                    if ($value == 0){
                                        break;
                                    }
                            ?>
                            <article class='box_languages_score'>
                                <div style='display: flex; justify-content: left;'>
                                    <img src='img/<?= strtolower(str_replace(["cpp","js"],["c++","javascript"],$key)) ?>.svg' style="width: 30px; height: 30px; margin-right: 10px; margin-top: 10px">
                                    <div style='font-size: 30px; color: white;'> 
                                        <?= str_replace(["Cpp", "Js", "Cs", "Ocaml","Php", "Apl"], ["C++","JavaScript", "C#","OCaml","PHP", "APL"], ucfirst($key)) ?>
                                    </div>
                                </div>

                                <div class='bar_languages_score'>
                          
                                <div class='percentage_languages_score' style = 'background-color : <?= $dic_color[str_replace(["cpp","js"],["c++","javascript"],$key)] ?>; width:<?= 100 * $value / $sum ?>%'>
                                <?php
                                    if (100 * $value / $sum > 15){
                                ?>
                                    <div style='height: 100%;display: table-cell; vertical-align: middle; color: #fff'>
                                        <?= strval(round(100 * $value / $sum , 2)) . "%" ?>
                                    </div>
                                <?php
                                    }
                                ?>
                                </div>
                                <?php 
                                    if (100 * $value / $sum <= 15){
                                ?>
                                    <div style='height: 100%;display: table-cell; vertical-align: middle; width: 50px; color: white; padding-right: 10px; text-align: right;'>
                                        <?= strval(round(100 * $value / $sum , 2)) . "%" ?>
                                    </div>
                                <?php
                                    }
                                ?>
                                </div>
                            </article>
                            <?php
                                }
                            ?>
                            <section id="points_languages_repartition"></section>
                        </div>
                    </div>
                </article>

                <!-- Right Part -->
                <article id="ranking_right">
                    <div id="ranking_div">
                        <div class="responsive_div">

                            <!-- Global Ranking -->
                            <div class="name_section">Global Ranking</div>
                            <div class="line"></div>
                            <?php
                            # Initialize score
                            $same_score = -1;
                            $better_score = 0;
                            $less_score = 0;

                            # Calculate the points of the user
                            $result_sum_pts = rsql("SELECT golf_score + upgrade_score + coop_score FROM Users WHERE id = ?", [$user_id], "i") -> fetch_assoc();
                            $user_score = $result_sum_pts["golf_score + upgrade_score + coop_score"];
                            
                            # Pointsfor all users
                            $all_players_score = $conn->query("SELECT golf_score + upgrade_score + coop_score FROM Users ORDER BY golf_score + upgrade_score + coop_score DESC");
                            $total_players = $all_players_score -> num_rows;


                            while ($row = $all_players_score -> fetch_assoc()){
                                if ($row["golf_score + upgrade_score + coop_score"] > $user_score){
                                    $better_score++;
                                } else if ($row["golf_score + upgrade_score + coop_score"] == $user_score) {
                                    $same_score++;
                                } else {
                                    # Because its order, if a score is less, all after will be.
                                    $less_score = $total_players - $better_score - $less_score;
                                    break;
                                }
                            }
                            ?>
                            <div class="text_in_section" id="the_ranking_div"><?= $better_score + 1?> / <?= $total_players ?></div>
                            <div class="repartition" style="background-color: #f45;display: flex; justify-content: left;">
                                <div id="ranking_bar" style="width: <?= 100 * $better_score / $total_players ?>%"></div>
                                <div id="ranking_bar_2" style="width: <?= 100 *$same_score / $total_players ?>%"></div>
                            </div>

                            <div class="pourcentage">
                                <div id="pourcentage_ranking_better" style="width: <?= round(100 * $better_score / $total_players, 2) ?>%">
                                <?= round(100 * $better_score / $total_players, 2) ?>%
                                </div>

                                <?php
                                    if ($same_score != 0){
                                ?>
                                <div id="pourcentage_ranking_same" style="width: <?= round(100 * $same_score / $total_players, 2) ?>%">
                                <?= round(100 * $same_score / $total_players, 2) ?>%
                                </div>
                                <?php
                                    }
                                ?>

                                <div id="pourcentage_ranking_less" style="width: <?= round(100 * $less_score / $total_players, 2) ?>%">
                                <?= round(100 * $less_score / $total_players, 2) ?>%
                                </div>
                            </div>
                            <div class="subtitle_div">  
                                <div class="subtitle" style="background-color: rgb(255, 228, 56);"></div>
                                <div class="vertical_align" style="margin-left: 10px" id="peopleBetterRanking"> People that have a better ranking than <?= $result["username"] ?></div>
                            </div>
                            <?php
                                if ($same_score != 0){
                            ?>
                            <div class="subtitle_div">  
                                <div class="subtitle" style="background-color: rgb(103, 255, 56);"></div>
                                <div class="vertical_align" style="margin-left: 10px" id="peopleSameRanking"> People that have the same ranking as <?= $result["username"] ?></div>
                            </div>
                            <?php
                                }
                            ?>

                            <div class="subtitle_div">  
                                <div class="subtitle" style="background-color: #f45;"></div>
                                <div class="vertical_align" style="margin-left: 10px" id="hasBetterRanking"><?= $result["username"] ?> has a better ranking than these people</div>
                            </div>

                            <!-- Best performances -->
                            <div class="name_section" style="margin-top: 10px;">Best Performances</div>
                            <div class="line"></div>
                            <div id="the_top_3"></div>
                            <div class="see_more" onclick="seePerformances()">Click here to see all performances</div>

                            <!-- Best comments -->
                            <div class="name_section" style="margin-top: 10px;">Best Comments</div>
                            <div class="line"></div>
                            <div id="the_top_3_comments"></div>
                            <div class="see_more" onclick="seeComments()">Click here to see all comments</div>
                            
                            
                            <!-- Ranking in languages-->
                            <div class="name_section">Ranking in Languages</div>
                            <div class="line"></div>
                            <section id="ranking_in_lang"></section>
                            
                        </div>
                    </div>
                </article>

                <!-- Compensate -->
                <article id="for_a_good_size" style="height: 1000px"></article>
            </section>


            <!-- Activty -->
            <section id="activity" style="padding-top: 50px; padding-bottom: 50px;">
            </section>



            <div id="new_user">
               
                <br>
                <b style="font-size: 35px;">Welcome to WeekGolf!</b>
                <br>
                <div style="overflow-y: auto; height: calc(100% - 240px);">
                    WeelGolf is a code golf platform. The goal of code golf is to create a program that solves a specific problem using as few bytes as possible!<br><br>
                    In the upper left corner of the screen, this is the main source of navigation between the different pages!<br><br>If you want to:<br>
                    - <b>Resolve a problem</b>: You can go on "<i>Problems</i>"<br>
                    - <b>Vote for a new language</b>: You can go on "<i>Vote</i>"<br>
                    - <b>See some of your questions answered</b>: You can go on "<i>Questions</i>"<br>
                    - <b>See the activity in Weekgolf</b>: You can go on "<i>Activity</i>"<br>
                    - <b>Add a profile picturre</b>: You can go on "<i>Settings</i>"<br><br>
                </div>
                <div id="new_buttons">
                    <a href="https://discord.gg/CqrbqSkdX3" target="_blank">
                        <div class="new_button" style="margin-right: 10%;">
                            <img src="img/discord.svg" style="width: 50px;">
                        </div>
                    </a>
                    <div class="new_button" style="background-color: #888; padding-top: 17px; height: 53px;font-size: 25px;" onclick="function hidden(){document.getElementById('new_user').style.display = 'none';};hidden()">
                        <i>
                            Continue
                        </i>
                    </div>
                </div>
            </div>
        </main>



        <!-- Footer -->
        <?php
            include_once "footer.html";
        ?>


        </div>  

        <div id="list_perf">
            <div id="header_list_perf">
                All performances
                <img src="img/cross.svg" id="cross_list_perf" onclick="closeSeeMore()">
                <table style="width: 100%">
                    <tr style="width: 100%">
                        <td style="width: 50%; ">
                            Filter by Language name:<br>
                            <input onkeyup="filterSolByLang()" class="filter">
                        </td>
                        <td style="width: 50%;  ">
                            <div id="problem_filter">
                                Filter by Problem name:<br>
                                <input onkeyup="filterSolByProblem()" class="filter" style="width: 90%;">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div id="content_list_perf">
            </div>
        </div>


        <div id="list_comments">
            <div id="header_list_comments">
                All comments
                <img src="img/cross.svg" id="cross_list_perf" onclick="closeSeeMore()">
                <table style="width: 100%">
                    <tr style="width: 100%">
                    </tr>
                </table>
            </div>
            <div id="content_list_comments" style="overflow: auto; height: calc( 100% - 140px);">
            </div>
        </div>



        <!-- UPDATE SCORES -->
        <script defer>
            const uselessXHTTP = new XMLHttpRequest();
            uselessXHTTP.open("GET", "https://week.golf/updateLangScore.php", true);
            uselessXHTTP.send();
        </script>

        <!-- Get info by ID-->
        <script defer>
            // Uniform the size
            function UniformSize(){
                const height_total = [window.getComputedStyle(document.getElementById("score_div")).getPropertyValue("height"), window.getComputedStyle(document.getElementById("ranking_div")).getPropertyValue("height")];
                
                function mapping(s){ return parseInt(s.substring(0,s.length-2)) }
                let maxi =  Math.max(...height_total.map(mapping));

                document.getElementById("for_a_good_size").style.height = 150 + maxi + "px";
            }

            for (let i = 0; i < 10; i++){
                setTimeout(UniformSize, 100*i);
            }
        </script>

        <!-- If it's your profile -->
        <script defer>
            const xhttp = new XMLHttpRequest();
            let friend_stat = -1; // -1 <=> Not set. 0 <=> Nor your profile. 1 <=> Your profile


            xhttp.open("POST", "https://week.golf/getIdbyToken.php", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhttp.send(`t=${localStorage.token}`);

            xhttp.onload = function() {
                const rep = JSON.parse(xhttp.responseText);
                const user_id = rep["id"];
                const url = new URL(window.location.href);
                const id = url.searchParams.get("id");

                if (user_id != id){
                    document.getElementById("edit").style.display = "none";
                    document.getElementById("editxt").style.display = "none";
                    friend_stat = 0;
                } else {
                    document.getElementById("friendButton").style.backgroundColor = "#fd0"
                    document.getElementById("friendTXT").textContent = "Hey, it's you!"
                    document.getElementById("friendIcon").src = "img/mirror.svg"
                    friend_stat = 1;
                }
            }
        </script>

        <!-- Friend case -->
        <script defer>
            friendButton = document.getElementById("friendButton");
            friendTXT = document.getElementById("friendTXT");
            friendIcon = document.getElementById("friendIcon");
            function determine(option){
                if (friend_stat == 0){ 
                    switch (option){
                        case 0: // Nothing
                            friendButton.style.backgroundColor = "#89A";
                            friendTXT.textContent = "Nothing";
                            friendIcon.src = "img/follow.svg";
                            break;
                        case 1: // You follow them
                            friendButton.style.backgroundColor = "#389";
                            friendTXT.textContent = "Watching";
                            friendIcon.src = "img/watching.svg";
                            break;
                        case 2: // They follow you
                            friendButton.style.backgroundColor = "#f03";
                            friendTXT.textContent = "Follows you";
                            friendIcon.src = "img/heart.svg";
                            break;
                        case 3: // Friendship
                            friendButton.style.backgroundColor = "#0d6";
                            friendTXT.textContent = "Friends";
                            friendIcon.src = "img/friends.svg";
                            break;
                        case 4: // It's you :D!
                            friendButton.style.backgroundColor = "#fd0";
                            friendTXT.textContent = "Hey, it's you!";
                            friendIcon.src = "img/mirror.svg";
                            break;
                    }
                } else if (friend_stat == -1) {
                    setTimeout(determine,10);
                }
            }
            const xhttp3 = new XMLHttpRequest();

            xhttp3.open("POST", "https://week.golf/friendship.php", true);
            xhttp3.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhttp3.send(`id=${new URL(window.location.href).searchParams.get("id")}&t=${localStorage.token}`);

            function makeHexColor() {
                var result = '#';
                var characters = 'ABCDEF0123456789';
                var charactersLength = characters.length;
                for ( var i = 0; i < 6; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }

            xhttp3.onload = function() {
                const rep = JSON.parse(xhttp3.responseText);
                setTimeout(function(){
                    determine(parseInt(rep["state"]))
                },50);
                
                option = parseInt(rep["state"]);


                friendButton.onclick = function (){
                    if (4>option && option>1){
                        option = (option===3)?2:3;
                        determine(option);
                    } else if (option !== 4 ) {
                        option = (option===1)?0:1;
                        determine(option);
                    }

                    if (document.getElementById("friendTXT").textContent == "Hey, it's you!"){
                        document.getElementById("friendButton").style.backgroundColor = makeHexColor();
                    } else {
                        const xhttp4 = new XMLHttpRequest();
                        xhttp4.open("POST", "https://week.golf/changeFriendship.php", true);
                        xhttp4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhttp4.send(`id=${new URL(window.location.href).searchParams.get("id")}&t=${localStorage.token}&s=${+(option!==0&&option!==2)}`);
                    }
                };  
            }
        </script>

        <!-- Load friends -->
        <script defer>

            function innerDivFriends(str, arr, correspondance){
                let theDivContent = document.getElementById(str+"_content");
                let textContent = ' ';
                for (let i = 0; i < arr.length; i++){
                    let j = 0;
                    while (parseInt(arr[i]) !== correspondance[j][0]){
                        j++;
                    }
                    //
                    textContent += `<a href="https://week.golf/profile.php?id=${arr[i]}">
                                        <div class="boxFriends" style="background-color: #${["073","802","145"][(str.substring(0,2)==='fo')+(str==='following')]}">
                                            <div class="headerFriends" style="background-color: #${["0d6","f03","389"][(str.substring(0,2)==='fo')+(str==='following')]}">
                                                <div class="friendName">
                                                    ${correspondance[j][1].replace(" ","_")}
                                                </div>
                                            </div>
                                            <img src="${(correspondance[j][2]===null)?'img/nouser_white.jpg':correspondance[j][2]}" class="friendPP" style="border-color: #${["073","802","145"][(str.substring(0,2)==='fo')+(str==='following')]}">
                                        </div>
                                    </a>`
                }
                theDivContent.innerHTML = textContent;
            }

            let following = [];
            let follower = [];
            let friends = [];
            let infos = [];
            const xhttp2 = new XMLHttpRequest();

            xhttp2.open("POST", "https://week.golf/friend.php", true);
            xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhttp2.send(`id=${new URL(window.location.href).searchParams.get("id")}`);

            xhttp2.onload = function() {
                const rep = JSON.parse(xhttp2.responseText);
                follower = rep["follower"];
                following = rep["following"];
                infos = rep["infos"]

                // Adding the category "friends"
                for (let i = 0; i < follower.length;i++){
                    if (following.includes(follower[i])){
                        friends.push(follower[i]);
                        following.splice(following.indexOf(follower[i]),1);
                        follower.splice(follower.indexOf(follower[i]),1);
                        i--;
                    }
                }

                document.getElementById("nb_friends").textContent = ` - ${friends.length}`;
                document.getElementById("nb_followers").textContent = ` - ${follower.length}`;
                document.getElementById("nb_followings").textContent = ` - ${following.length}`;

                innerDivFriends("friend",friends,infos);
                innerDivFriends("follower",follower,infos);
                innerDivFriends("following",following,infos);
            }
            

        </script>

        <!-- Arrow -->
        <script>
            function arrow(str){
                const arrow = document.getElementById(`${str}_arrow`);
                const content = document.getElementById(`${str}_content`)
                let bool = content.style.display === 'block'

                arrow.src = bool?'img/arrow_down.svg':'img/arrow_up.svg';
                content.style.display = bool?"none":"block";
            }
        </script>


        <!-- Comments -->
        <script defer>
            const xhttp6 = new XMLHttpRequest();

            xhttp6.open("POST", "https://week.golf/getBestComments.php", true);
            xhttp6.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhttp6.send(`id=${new URL(window.location.href).searchParams.get("id")}`);

            xhttp6.onload = function() {
                const content = JSON.parse(xhttp6.responseText)["content"];
                const upvote = JSON.parse(xhttp6.responseText)["upvote"];
                
                let add = "";
                let add2 = "";

                for (let i = 0; i < Math.min(3,content.length); i ++){
                    add += '<div class="subtitle_div" style="display: flex;justify-content: left; background-color: #222; width: calc(100% - 100px); border-radius: 5px; overflow: hidden;">'
                        add += "<div>"
                            add += `<div class="title_challenge">${upvote[i]} upvote${upvote[i]>1?'s':''}</div>`
                            add += `<div style="margin-left: 10px; margin-top: -5px;font-size:15px">${content[i].replace(/</g,"&lt;")}</div>`
                        add += "</div>"
                    add += '</div>'

                }
                document.getElementById('the_top_3_comments').innerHTML += add;

                for (let i = 0; i < content.length; i ++){
                    // For All Performances
                    add2 += `<div class="all_perf"  style="display: flex;justify-content: left;">
                                <div>
                                    <div class="title_challenge">${upvote[i]} upvote${upvote[i]>1?'s':''}</div>
                                    <div style="margin-left: 10px; margin-top: -5px;font-size:15px">${content[i].replace(/</g,"&lt;")}</div>
                                </div>
                            </div>`

                }

                document.getElementById('content_list_comments').innerHTML = add2;
            }

        </script>

        <!-- Performances -->
        <script defer>
            const xhttp5 = new XMLHttpRequest();

            xhttp5.open("POST", "https://week.golf/getBestPerformances.php", true);
            xhttp5.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhttp5.send(`id=${new URL(window.location.href).searchParams.get("id")}`);

            xhttp5.onload = function() {
                let best_performances = JSON.parse(xhttp5.responseText)["res"];


                best_performances.sort(function(first, second) {
                    return (first[4]/first[5] - second[4]/second[5] == 0)?first[4] - second[4]:(first[4]/first[5] - second[4]/second[5])
                });

                  ///////////////////////
                 // Best Performances //
                ///////////////////////////////
                const ranking_div = document.getElementById("ranking_div");
                const subtitle_div = ranking_div.getElementsByClassName("subtitle_div");
                let background_color_div = "";
                
                for (let i = 0; i < best_performances.length; i ++){
                    add = ""
                    add2 = ""
                    if (best_performances[i][4] == 1){
                        background_color_div = "#fb0"
                    } else if (best_performances[i][4] == 2){
                        background_color_div = "#ccc"
                    } else if (best_performances[i][4] == 3){
                        background_color_div = "#cd7f32"
                    } else if (best_performances[i][4] <= 10){
                        background_color_div = "#289c7d"
                    } else if (best_performances[i][4] <= 100){
                        background_color_div = "#bf245b"
                    } else {
                        background_color_div = "#999"
                    }



                    // For the TOP 3
                    if (i < 3){
                        add += '<div class="subtitle_div"  style="display: flex;justify-content: left;">'
                            add += `<div class="box_ranking_langage" style="background-color:${background_color_div};">`
                                add +=`<img src="img/${best_performances[i][1].toLocaleLowerCase().replace("csharp","cs").replace("cpp","c++").replace("node","javascript")}_white.svg" style="width: 40px;">`
                            add += '</div>'
                            add += "<div>"
                                add += `<div class="title_challenge">${best_performances[i][3]}</div>`
                                add += `<div style="margin-left: 10px; margin-top: -5px;font-size:15px">Ranking: ${best_performances[i][4]} / ${best_performances[i][5]} (${best_performances[i][2]}bytes)</div>`
                            add += "</div>"
                        add += '</div>'

                    document.getElementById('the_top_3').innerHTML += add;

                    }


                    // For All Performances
                    add2 += `
                        <a href="https://week.golf/stats.php?id=${new URL(window.location.href).searchParams.get("id")}&lang=${encodeURIComponent(best_performances[i][1].toLocaleLowerCase().replace("csharp","cs").replace("cpp","c++").replace("node","javascript"))}&pb=${encodeURIComponent(best_performances[i][3])}">
                            <div class="all_perf"  style="display: flex;justify-content: left;">
                                <table style="width: 100%;">
                                    <tr style="width: 100%; display: flex;">
                                        <td class="organisation_left">
                                            <div class="box_ranking_langage" style="background-color:${background_color_div};width: 60px;height: 60px; border-radius: 10px; margin-top: -3px;   ">
                                                <img src="img/${best_performances[i][1].toLocaleLowerCase().replace("csharp","cs").replace("cpp","c++").replace("node","javascript")}_white.svg" style="width: 40px; margin-left: 10px; margin-top: 10px; display: block;">
                                            </div>
                                            <div>
                                                <div class="title_challenge">${best_performances[i][3]}</div>
                                                <div style="margin-left: 10px; margin-top: -5px;font-size:15px">Ranking: ${best_performances[i][4]} / ${best_performances[i][5]}</div>
                                            </div>
                                        </td>
                                        <td class="organisation_right">
                                            <div class='lb_bytes' style='justify-content: right; margin-top: -12px; margin-right:0;'>
                                                    <div class="vertical-align" style="height: 70px">
                                                        ${best_performances[i][2]}
                                                        <div style="font-size: 10px; margin-top: -10px">Bytes</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </a>`

                    document.getElementById('content_list_perf').innerHTML += add2;
                }

                setTimeout(footer, 10);
            }
        </script>

        <!-- Best ranking by lang -->
        <script>
            const xhttp9 = new XMLHttpRequest();

            xhttp9.open("POST", "https://week.golf/getBestRankingLang.php", true);
            xhttp9.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhttp9.send(`id=${new URL(window.location.href).searchParams.get("id")}`);

            xhttp9.onload = function() {
                const rep = JSON.parse(xhttp9.responseText);

                const lang = rep["langs"];
                const rank = rep["rank"];
                const tot = rep["tot"];

                let textContent = "";

                for (let i = 0; i < tot.length; i++){
                    if (rank[i] + 1== 1){
                        background_color_div = "#fb0"
                    } else if (rank[i]+ 1 == 2){
                        background_color_div = "#ccc"
                    } else if (rank[i]+ 1 == 3){
                        background_color_div = "#cd7f32"
                    } else if (rank[i]+ 1 <= 10){
                        background_color_div = "#289c7d"
                    } else if (rank[i]+ 1 <= 100){
                        background_color_div = "#bf245b"
                    } else {
                        background_color_div = "#999"
                    }

                    let display_lang = lang[i].replace("cs","C#").replace("cpp","C++").replace("js","javascript");
                    textContent += `
                    <article class="color_box" style="display: flex; justify-content: center; margin-bottom: 10px; background-color: ${background_color_div}">
                        <img src="img/${lang[i].toLowerCase().replace("csharp","cs").replace("cpp","c++").replace("js","javascript")}_white.svg" style="width: 30px; margin-right: 10px; display: block;">
                        <div style="display: table">
                            <div class="vertical-align">
                                ${display_lang[0].toUpperCase() + display_lang.slice(1).toLowerCase()}: ${rank[i] + 1} / ${tot[i]}
                            </div>
                        </div>
                    </article>`
                }

                document.getElementById("ranking_in_lang").innerHTML = textContent;
            }
        </script>

        <!-- See more -->
        <script>
            // Too see the "All performances"
            function seePerformances(){
                document.getElementById("blurall").style.filter = "blur(5px)";
                document.getElementById("list_perf").style.filter = "blur(0)";
                document.getElementById("list_perf").style.display = "block";
            }

            // Too see the "All comments"
            function seeComments(){
                document.getElementById("blurall").style.filter = "blur(5px)";
                document.getElementById("list_comments").style.filter = "blur(0)";
                document.getElementById("list_comments").style.display = "block";
            }
            
            // Too close the "All performances"
            function closeSeeMore(){
                document.getElementById("list_comments").style.display = "none";
                document.getElementById("list_perf").style.display = "none";
                document.getElementById("blurall").style.filter = "blur(0px)";
            }

            function filterSolByProblem(){
                let text = document.getElementsByClassName("filter")[1].value.toLowerCase();

                let all_perf = document.getElementsByClassName("all_perf");

                for (let i = 0; i < all_perf.length; i++){
                    if (!all_perf[i].getElementsByClassName("title_challenge")[0].textContent.toLowerCase().includes(text)){
                        all_perf[i].style.display = "none";
                    } else {
                        all_perf[i].style.display = "flex";
                    }
                }
            }

            function filterSolByLang(){
                let text = document.getElementsByClassName("filter")[0].value.toLowerCase();

                let all_perf = document.getElementsByClassName("all_perf");

                for (let i = 0; i < all_perf.length; i++){
                    if (!all_perf[i].getElementsByTagName("img")[0].src.toLowerCase().split("/").at(-1).split('_')[0].includes(text)){
                        all_perf[i].style.display = "none";
                    } else {
                        all_perf[i].style.display = "flex";
                    }
                }
            }
        </script>

        <!-- On resize -->
        <script defer>
            let username = document.getElementById("username");
            <?php
                if ($result["discord_display"] == 1){
            ?>
            function onresizeDiscord(){
                let display = window.getComputedStyle(document.getElementById("discordButton")).display != "none";
                if (window.innerWidth < 1100 && display){
                    username.style.top = '-160px';
                    document.getElementById("pannel").style.height = "430px"
                } else {
                    // document.getElementById("pannel").style.height = display?"250px":"350px";
                    document.getElementById("pannel").style.height = window.innerWidth < 1100 ? "350px":"270px";
                    username.style.top = '-80px';

                }
            }
            onresizeDiscord();
            // window.onresize = onresizeDiscord();
            window.addEventListener('resize', onresizeDiscord);
            <?php
                }
            ?>

            function onresizePerf(){
                let height = window.innerHeight;
                let header_height = parseInt(window.getComputedStyle(document.getElementById("header_list_perf")).height);
                document.getElementById("list_perf").style.height = height - 100 + "px";
                document.getElementById("list_comments").style.height = height - 100 + "px";
                document.getElementById("content_list_perf").style.height = (height - 115 - header_height) + "px";
            }

            setTimeout(onresizePerf, 300);
            window.onresize = onresizePerf;
        </script>

        <!-- Activity -->
        <script defer>
            const xhttp7 = new XMLHttpRequest();

            xhttp7.open("POST", "https://week.golf/getActivityById.php", true);
            xhttp7.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhttp7.send(`id=${new URL(window.location.href).searchParams.get("id")}`);

            xhttp7.onload = function() {
                let content = JSON.parse(xhttp7.responseText)["content"];
                let title = JSON.parse(xhttp7.responseText)["title"];
                let date = JSON.parse(xhttp7.responseText)["date"];

                let innerHTML = "";

                for (let i = 0; i < date.length; i++){
                    innerHTML += `<article class="content_activity">
                                    <div class="header_activity">
                                        ${title[i]}
                                        <div class="date_activity"> ${date[i]}</div>
                                    </div>
                                    <div class="main_activity">
                                        ${content[i]}
                                    </div>
                                </article>`
                }

                document.getElementById("activity").innerHTML = innerHTML;
            }
        </script>

        <!-- If new user -->
        <script>
            const url_new = new URL(window.location.href).searchParams.get("new");
            if (url_new != null && url_new == "1"){
                document.getElementById("new_user").style.display = "block";
                document.getElementById("new_user").style.height = parseInt(window.innerHeight) - 100 + "px"
                window.addEventListener("resize", function(){
                    document.getElementById("new_user").style.height = parseInt(window.innerHeight) - 100 + "px"
                });
            } else {
                document.getElementById("new_user").style.display = "none";
            }
        </script>

        <script src="profile.js"></script>
    </body>
</html>