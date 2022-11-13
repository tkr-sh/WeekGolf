<!DOCTYPE html>
<html lang="en">
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
        <link href="index.css" rel="stylesheet" type="text/css" />
        <link href="style.css" rel="stylesheet" type="text/css" />
        <link href="header.css" rel="stylesheet" type="text/css" />
        <link href="footer.css" rel="stylesheet" type="text/css" />

        <!-- Embed HTML -->
        <script src="lib/csi.js"></script>

        <!-- Header Boucing -->
        <script src="header.js"></script>

        <!-- Scroll to Top -->
        <script src="scrolltop.js"></script>

        <!--Langage Support -->
        <style>
            @media screen and (max-width: 1100px) {
                .category span{
                    display: none;
                }

                .lb_bytes{
                    font-size: 20px;
                }
                
                .lb_bytes .vertical-align div{
                    font-size: 35px;
                }

                
            }

            @media screen and (max-width: 500px) {
                .lb_username {
                    width: 50px;
                }

                .language_div .vertical-align span{
                    display: none;
                }
            }
        </style>
    </head>
    <body>     

  
        <!-- Header -->
        <?php
            include_once "header.html";
        ?>
       
        <main>
            <div style="width: 90%; margin-left: 5%; display: flex; flex-direction: row;flex-wrap: wrap;justify-content: space-between;">
                <button class="leaderboard_button" onclick="chooseSection(0)">
                    <div class="vertical-align" style="width: 99999px">
                        Global
                    </div>
                </button>
                <button class="leaderboard_button" onclick="chooseSection(1)">
                    <div class="vertical-align" style="width: 99999px">
                        Languages
                    </div>
                </button>
            </div>



            <div id="global_leaderboard" class="leaderboard_ide">
                <title id="leaderboard_ide_text" style="display: flex; align-items: center; justify-content: center;">
                    Global LeaderBoard
                </title>
                <ul class="leaderboard_languages">
                    <li class="category">
                        <div class="vertical-align" onclick="showSection('global')">
                            <img src="img/global.svg" style="width:30px;height: 30px; top: 5px; position: relative;">
                            <span>
                                Global
                            </span>
                        </div>
                    </li>
                    <li class="category">
                        <div class="vertical-align" onclick="showSection('golf')">
                            <img src="img/weekgolfwhite.svg" style="width:30px;height: 30px; top: 5px; position: relative;">
                            <span>
                                Golf
                            </span>
                        </div>
                    </li>
                    <li class="category">
                        <div class="vertical-align" onclick="showSection('upgrade')">
                            <img src="img/upgrade_arrow.svg" style="width:30px;height: 30px; top: 5px; position: relative;">
                            <span>
                                Upgrade
                            </span>
                        </div>
                    </li>
                    <li class="category" onclick="showSection('coop')">
                        <div class="vertical-align">
                            <img src="img/cooperation.svg" style="width:30px;height: 30px; top: 5px; position: relative;">
                            <span>
                                Cooperation
                            </span>
                        </div>
                    </li>
                </ul>
                <div class="leaderboard_users">
                    <?php

                    error_reporting(E_ERROR | E_PARSE);

                    $global = array();
                    $golf = array();
                    $up = array();
                    $coop = array();

                    # Connecting to DataBase
                    include_once "connectToDatabase.php";

                    function getCorrectArray($sql, $conn){

                        $arr = array();
                        $result = $conn->query("SELECT * FROM Users ORDER BY $sql DESC");
                        $i = 0;

                        if ($result->num_rows > 0) {
                            while($row = $result->fetch_assoc()) {
                                $arr[$i] = array($row["id"], $row["username"], $row["pp"],($sql[0]=="("? $row["golf_score"]+$row["upgrade_score"]+$row["coop_score"]:$row[$sql]));
                                $i++;
                            }
                        }

                        
                        return $arr;
                    }



                    function numberToRank($nb){
                        return (intval($nb[-1])<4 && intval($nb[-1])>0 && ($nb[-2]!=="1" || $nb==='1'))?["st","nd","rd"][intval($nb[-1])-1]:"th";
                    }



                    # Global ranking
                    $global = getCorrectArray("(golf_score + coop_score + upgrade_score)", $conn);
                    # Golf ranking
                    $golf = getCorrectArray("golf_score", $conn);
                    # Upgrade ranking
                    $upgrade = getCorrectArray("upgrade_score", $conn);
                    # Cooperation ranking
                    $coop = getCorrectArray("coop_score", $conn);


                    $total = array($global, $golf, $upgrade, $coop);
                    $name = array("global","golf","upgrade","coop");

                    for ($i = 0; $i < 4; $i++){
                        $length = sizeof($total[$i]);
                        $before_score = -1;
                        $rank = 0;
                        for ($j = 0; $j <  $length ;$j ++){
                            $rank += $before_score == $total[$i][$j][3] ? 0 : 1;
                            $before_score = $total[$i][$j][3];
                    
                    ?>

                    <a href="https://week.golf/profile.php?id=<?= $total[$i][$j][0]?>" value="<?=$name[$i]?>">
                            <div class="user_div">
                                <div class="lb_rank">
                                    <div class="vertical-align" style="height: 70px">
                                        <!-- <?= $j + 1?> -->
                                        <?= $rank ?><?= numberToRank(strval($rank))?>
                                    </div>
                                </div>
                                <img src="<?=$total[$i][$j][2]!=null?$total[$i][$j][2]:'img/nouser_white.jpg'?>" class="lb_pp">
                                <div class="lb_username">
                                    <?= $total[$i][$j][1]?>
                                </div>
                                <div class="lb_bytes">
                                    <div class="vertical-align" style="height: 70px">
                                        <?= $total[$i][$j][3]?>
                                        <div style="font-size: 10px; margin-top: -10px">Point<?= intval($total[$i][$j][3]) != 1 ? 's':''?></div>
                                    </div>
                                </div>
                            </div>
                        </a>


                        <?php

                            }
                        }
                        ?>
                </div>
            </div>



            <div class="leaderboard_ide" style="background-color: #222">
                <div id="leaderboard_ide_text">
                    <div class="vertical-align">
                        Language LeaderBoard
                    </div>
                </div>
                <ul class="leaderboard_languages">
                <?php


                    $lang = array();


                    # Connecting to DataBase
                    include_once "connectToDatabase.php";

                    $i = 0;
                    $sql = "SELECT * FROM CurrentLang ORDER BY lang ASC";
                    $tranform = array(
                        "c++",
                        "c#",
                        "javascript",
                    );
                    $to = array(
                        "cpp",
                        "cs",
                        "js"
                    );
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                        ?>

                    <li class="language_div"  onclick="showLanguagesLeaderboard('<?= str_replace($tranform, $to, $row['lang']) ?>')">
                        <div class="vertical-align">
                            <img src="img/<?=$row["lang"]?>_white.svg" style="width:30px;height: 30px; top: 5px; position: relative;">
                            <span>
                                <?= ucfirst(str_replace("cs","c#",$row["lang"])) ?>
                            </span>
                        </div>
                    </li>

                    <?php
                            $lang[$i] = $row["lang"];
                            $i++;
                        }
                    }
                    ?>

                </ul>
                <div class="leaderboard_users">

                    <img src="img/question.svg" id="leaderboard_img">
                    <div id="leaderboard_title">No language selected</div> 

                    <?php

                    $tot = 0;
                    $tranform = array(
                        "c++",
                        "c#",
                        "javascript",
                    );
                    $to = array(
                        "cpp",
                        "cs",
                        "js"
                    );
                    for ($i = 0; $i < sizeof($lang); $i++){
                        $lang[$i] = str_replace($tranform, $to, $lang[$i]);
                        $j = 1;
                        $sql = "SELECT * FROM Users, Languages WHERE Users.id = Languages.owner_id AND ".$lang[$i]."_score > 0 ORDER BY ".$lang[$i]."_score DESC;";
                        $result = $conn->query($sql);
                        $before_score = -1;
                        $diff = 0;
                        if ($result->num_rows > 0) {
                            while($row = $result->fetch_assoc()) {    $tot++;
                                if ($before_score == $row[$lang[$i]."_score"]){
                                    $diff++;
                                } else {
                                    $j += $diff;
                                    $diff = 1;
                                }
                                $before_score = $row[$lang[$i]."_score"];
                    ?>

                        <a href="https://week.golf/profile.php?id=<?= $row["id"]?>" value="<?=$lang[$i]?>">
                            <div class="user_div">
                                <div class="lb_rank">
                                    <div class="vertical-align" style="height: 70px">
                                        <?= $j?><?= numberToRank(strval($j))?>
                                    </div>
                                </div>
                                <img src="<?=$row["pp"] != null ? $row["pp"] : 'img/nouser_white.jpg'?>" class="lb_pp">
                                <div class="lb_username">
                                    <?= $row["username"]?>
                                </div>
                                <div class="lb_bytes">
                                    <div class="vertical-align" style="height: 70px">
                                        <?= $row[$lang[$i]."_score"] ?>
                                        <div style="font-size: 10px; margin-top: -10px">Point<?php if ( intval($row[$lang[$i]."_score"]) != 1 ) echo 's';?></div>
                                    </div>
                                </div>
                            </div>
                        </a>


                        <?php   
                                
                                }
                            }
                        }

                        ?>
                </div>
            </div>
            
            <div style="height:100px; background: rgb(126, 11, 119, 0)"></div>
            
            <div class="uwuwu" id="uwuwu"></div>

        </main>
        <!-- Footer -->
        <?php
            include_once "footer.html";
        ?>


        <!-- JS -->
        <script defer>

            const leaderboard_ide = document.getElementsByClassName("leaderboard_ide");
            const leaderboard_button = document.getElementsByClassName("leaderboard_button");


            function chooseSection(n){
                for (let i = 0; i < leaderboard_button.length ; i++){
                    leaderboard_button[i].style.backgroundColor = "#151515";
                }
                leaderboard_button[n].style.backgroundColor = "var(--darker-color)";

                leaderboard_ide[n].style.display = "block";
                leaderboard_ide[!n?1:0].style.display = "none";

                if (n == 1){
                    showLanguagesLeaderboard(localStorage.selectedLanguage !== null ? localStorage.selectedLanguage : "python");
                } else {
                    showSection("global");
                }
            }

            chooseSection(0);
        </script>


        <script defer>

            function showSection(str){

                const a = document.getElementsByClassName("leaderboard_users")[0].getElementsByTagName("a");

                for (let i = 0; i < a.length; i++){
                    if (a[i].getAttribute('value') === str){
                        a[i].style.display = "block";
                    } else {
                        a[i].style.display = "none";
                    }
                }

                let height = window.getComputedStyle(document.getElementsByClassName("leaderboard_users")[0]).height;

                height = parseInt(height.substring(0, height.length - 2));
                console.log(height);
                document.getElementsByClassName("leaderboard_languages")[0].style.height = height + 70 +"px";
            }

            showSection("global");

        </script>

        <script defer>
            const height_lang = document.getElementsByClassName("language_div").length;

            let  lulength =  window.getComputedStyle(document.getElementsByClassName("leaderboard_users")[1]).height;
            lulength = parseInt(lulength.substring(0, lulength.length - 2))
            // document.getElementsByClassName("leaderboard_users")[1].style.height = lulength > (height_lang * 60 - 70) ? lulength+"px" : (height_lang * 60 - 70) + "px";
            document.getElementsByClassName("leaderboard_users")[1].style.height = "auto";
            if (parseInt(window.getComputedStyle(document.getElementsByClassName("leaderboard_users")[1]).height) < parseInt(window.getComputedStyle(document.getElementsByClassName("leaderboard_languages")[1]).height)){
                document.getElementsByClassName("leaderboard_users")[1].style.height = window.getComputedStyle(document.getElementsByClassName("leaderboard_languages").height);
            }
        </script>

        <script defer>

            function showLanguagesLeaderboard(lang){

                let language_div_length = 0;
                const a = document.getElementsByClassName("leaderboard_users")[1].getElementsByTagName("a");

                for (let i = 0; i < a.length; i++){
                    if (a[i].getAttribute('value') === lang){
                        a[i].style.display = "block";
                        language_div_length++;
                    } else {
                        a[i].style.display = "none";
                    }
                }

                document.getElementById("leaderboard_img").src = `img/${lang.replace("cpp","c++").replace("js","javascript")}_white.svg`;
                document.getElementById("leaderboard_title").textContent = language_div_length+" player"+(language_div_length==1?"":"s");

                let a_lu = document.getElementsByClassName("leaderboard_users")[1].getElementsByTagName("a");
                let tot_players = 0;
                for (let i = 0; i < a_lu.length && tot_players < 12; i++){
                    if (window.getComputedStyle(a_lu[i]).display != "none")
                        tot_players++;
                }

                // If the height of auto is less than the height of the left bar
                if (tot_players < 12){
                    document.getElementsByClassName("leaderboard_users")[1].style.height = window.getComputedStyle(document.getElementsByClassName("leaderboard_languages")[1]).height;
                } else {
                    document.getElementsByClassName("leaderboard_users")[1].style.height = "auto";
                }
            }

        </script>


    </body>
</html>
