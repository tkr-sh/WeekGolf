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
        <link href="style.css" rel="stylesheet" type="text/css" />
        <link href="header.css" rel="stylesheet" type="text/css" />
        <link href="footer.css" rel="stylesheet" type="text/css" />
        <link href="index.css" rel="stylesheet" type="text/css" />

        <!-- Embed HTML -->
        <script src="lib/csi.js"></script>

        <!-- Header Boucing -->
        <script src="header.js"></script>

        <!-- Scroll to Top -->
        <script src="scrolltop.js"></script>

        <!--Langage Support -->
    </head>
    <body>  
        <!-- Header -->
        <header  id="index_header">
            <div id="WeekGolfText">
                <div id="white">
                    Week
                </div>
                <div id="green" style="color: #3C3">
                    Golf
                </div>
            </div>
            <img src="img/weekgolfwhite.svg" style="width: 100px" id="logo_in_header">
            <a href="createAccount.html">
                <div class="button_index">
                    <div style="height: 100%; display: table-cell;vertical-align: middle; color:#fff; background-color: #5C5">
                        Start Golfing Now!
                    </div>
                </div>
            </a>
        </header>

        <!-- EACH WEEK -->
        <div class="boxes" id="first_color">
            <table style="height: 100%; width: 100%;">
                <tr  style="height: 100%; width: 100%;">
                    <td style="height: 100%; width: 20%"></td>
                    <td style="height: 100%; width: 30%">
                            <div class="title_boxes">
                                1 challenge<br>every week!
                            </div>
                            <div class="description_boxes">
                                Each week, a new challenge. Your goal: try to solve this problem with as few bytes as possible. There are rankings for each programming language.
                            </div>
                    </td>
                    <td>
                        <img src="img/calendar.svg" id="img_calendar" class="image_right">
                    </td>
                    <td style="height: 100%; width: 20%"></td>
                </tr>
            </table>
        </div>

        <!-- +20 LANGAGES -->
        <div class="boxes" style="background-color: #444; height: 400px">
            <table style="height: 100%; width: 100%;">
                <tr  style="height: 100%; width: 100%;">
                    <td style="height: 100%; width: 20%"></td>
                    <td>
                        <img src="img/+20.svg" class="image_left" id="img_20" style="width: 300px">
                    </td>
                    <td style="height: 100%; width: 30%; text-align: right;">
                        <div class="title_boxes">
                            Over 20 programming<br>languages available
                        </div>
                        <div class="description_boxes">
                            You can try to solve the challenges in more than 20 different programming languages. Click <b onclick="showLanguages()" style="cursor: pointer">HERE</b> to see the list of 20 languages.
                        </div>
                    </td>
                    <td style="height: 100%; width: 20%"></td>
                </tr>
            </table>
        </div>
        <section id="languages_box">
            <?php 

                include_once "connectToDatabase.php";

                $color_arr = array();
                $sql = "SELECT ColorLang.lang, ColorLang.color FROM ColorLang, CurrentLang WHERE ColorLang.lang = CurrentLang.lang ORDER BY lang ASC;";
                $i = 0;
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        $color_arr[$i] = array($row["lang"], $row["color"]);
                        $i++;
                    }
                }

                for ($i = 0; $i < sizeof($color_arr); $i++){

                    
            ?>
                <div class="languages_small_box" title="<?=ucfirst($color_arr[$i][0])?>">
                    <div class="boxContent" style='background-color: <?=$color_arr[$i][1]?>'></div>
                    <img src="img/<?=$color_arr[$i][0]?>.svg" class="image_colored">
                    <img src="img/<?=$color_arr[$i][0]?>_white.svg" class="image_white">
                </div>
            <?php   
                }
            ?>
        </section>

        <!-- BEST ANSWER -->
        <div class="boxes" style="height: 400px; margin-top: 0px">
            <table style="height: 100%; width: 100%;">
                <tr  style="height: 100%; width: 100%;">
                    <td style="height: 100%; width: 20%"></td>
                    <td style="height: 100%; width: 30%">
                            <div class="title_boxes">
                                Discover the<br>best answer
                            </div>
                            <div class="description_boxes">
                                After the week of competition, the best answer is revealed for all to see. If you can improve it, you can submit an improved answer for the community to see the best possible solution.
                            </div>
                    </td>
                    <td>
                        <img src="img/trophie.svg" id="img_trophie" class="image_right">
                    </td>
                    <td style="height: 100%; width: 20%"></td>
                </tr>
            </table>
        </div>

        <!-- ASK FOR HELP -->
        <div class="boxes" style="background-color: #444; height: 400px;margin-top: 0px">
            <table style="height: 100%; width: 100%;">
                <tr  style="height: 100%; width: 100%;">
                    <td style="height: 100%; width: 20%"></td>
                    <td>
                        <img src="img/upgrade_arrow.svg" class="image_left" id="img_arrow" style="width: 200px">
                    </td>
                    <td style="height: 100%; width: 30%; text-align: right;">
                        <div class="title_boxes">
                            Ask for<br>explanations<br>
                        </div>
                        <div class="description_boxes">
                            If you can't understand the solution, feel free to put a comment under the solution saying that you don't understand this part. You can upvote the useful answers and downvote the answers that are not correct
                        </div>
                    </td>
                    <td style="height: 100%; width: 20%"></td>
                </tr>
            </table>
        </div>

        <!-- LOOP -->
        <div class="boxes" style="height: 400px; margin-top: 0px">
            <table style="height: 100%; width: 100%;">
                <tr  style="height: 100%; width: 100%;">
                    <td style="height: 100%; width: 20%"></td>
                    <td style="height: 100%; width: 30%; min-width: 150px;">
                            <div class="title_boxes" style="min-width: 150px;">
                                When it ends,<br>it starts over
                            </div>
                            <div class="description_boxes">
                                When the week of competition ends, the answers are revealed. You may think it's the beginning of boredom. However, the second the competition ends, a new one begins for a week and so on.
                            </div>
                    </td>
                    <td>
                        <img src="img/loop.svg" class="image_right" id="img_loop" style="width: 300px">
                    </td>
                    <td style="height: 100%; width: 20%"></td>
                </tr>
            </table>
        </div>

        <div id="end_index">
            <div id="wannaTry">
                Want to Try ?
            </div>
            
            <a href="createAccount.html">
                <div id="createAccount">
                    <div class="vertical-align">
                        Create an account
                    </div>
                </div>
            </a>
        </div>





        <!-- Footer -->
        <div data-include="footer.html"></div>


        <!-- HERE ONCLICK -->
        <script>
            function showLanguages(){
                const languages_box = document.getElementById("languages_box");
                languages_box.style.display = ((window.getComputedStyle(languages_box).display === 'block')?"none":"block");
            }
        </script>
    </body>
</html> 