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
        <link href="question.css" rel="stylesheet" type="text/css" />

        <!-- Embed HTML -->
        <script src="lib/csi.js"></script>

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
        <!-- Header -->
        <?php
        include_once "header.html";
        ?>
        
        <main>
            <title id="question_text">Questions</title>
            <div class="bar1"></div>
            <table style="width: 100%;">
                <tr style="width: 100%;">
                    <td style="width: 10%;"></td>


                    <td style="width: 25%;">
                        <div class="button_redirect" onclick="smoothScroll(document.getElementById('first_element_scroll'))">
                            <div class="vertical-align">
                                Language version
                            </div>
                        </div>
                    </td>

                    <td style="width: 2.5%;"></td>
                    <td style="width: 25%;">
                        <div class="button_redirect" onclick="smoothScroll(document.getElementById('second_element_scroll'))">
                            <div class="vertical-align">
                                Point system
                            </div>
                        </div>
                    </td>

                    <td style="width: 2.5%;"></td>
                    <td style="width: 25%;">
                        <div class="button_redirect" onclick="smoothScroll(document.getElementById('third_element_scroll'))">
                            <div class="vertical-align">
                                FAQ
                            </div>
                        </div>
                    </td>



                    <td style="width: 10%;"></td>
                </tr>
            </table>
            
            <div class="descriptif">
                This page is here to help you if you have some questions.<br>
                If this page doesn't help you with the question that you have, you can come on <a href="https://discord.gg/9bexE9TrMY" class="link_text">Discord</a> and we will help you with your question
            </div>


            <div class="question_list" id="first_element_scroll">Language Version</div>
            <div class="bar1"></div>


            <div id = "flex_container">
            <?php
                error_reporting(E_ERROR | E_PARSE);
                $xml = file_get_contents("https://week.golf/version.json");
                $xml = str_replace(["\n","\t"],"",$xml);

                $l = [];
                $lang = [];

                $s = explode('",',$xml);

                foreach ($s as $e) {
                    array_push($lang, str_replace(array('"','{'), array('',''), explode(':',$e)[0]));
                    $e = explode(".",$e);

                    try {
                        $version = array(substr($e[0], -2, 2),$e[1],substr($e[2], 0, 2));
                        if (str_contains($e[0],"github")) # For K
                            array_push($l, preg_replace('/[^0-9A-z.]+/', '', end(explode(" ",end($e)))));
                        else if (str_contains($e[0],"jversion"))
                            array_push($l, "903");
                        else {
                            $s_temp = "";
                            for ($i = 0; $i < sizeof($version) ; $i++){
                                $version[$i] = preg_replace('/[^0-9.]+/', '',$version[$i]);
                            }
                            array_push($l, join(".", $version));
                        }
                    }
                    catch (Exception){
                        array_push($l, "NaN");
                    }
                }
            
                
                $arr_capitalized = array(
                    "cpp" => "c++",
                    "csharp" => "c#",
                    "node" => "javascript"

                );

                $arr_img = array(
                    "cpp" => "c++",
                    "csharp" => "cs",
                    "node" => "javascript"

                );

                for ($i = 0; $i < sizeof($l) - 1; $i++){

                    $lang_name_capitalized = ucfirst (array_key_exists($lang[$i], $arr_capitalized) ? $arr_capitalized[$lang[$i]] : $lang[$i] );
                    $lang_name_img =  ucfirst (array_key_exists($lang[$i], $arr_img) ? $arr_img[$lang[$i]] : $lang[$i] );
                    $version = $l[$i];

                ?>


            
                <div class="flex_content" <?= strlen($l[$i]) > 20 ? 'style="font-size: 12px"':''?> >
                    <div class="header_flex">
                        <img src="img/<?=strtolower($lang_name_img)?>_white.svg" class="icon_flex">
                        <div style="margin-top: -10px">
                            <?= $lang_name_capitalized ?>
                        </div>
                    </div>
                    Version: <?= $version ?>
                </div>

            <?php 
            }
            ?>
            </div>



            <div class="question_list" id="second_element_scroll" style="margin-top: 60px">Point system</div>
            <div class="bar1"></div>
            <div class="descriptif">
                The system of points in WeekGolf is open source and you can see it on github<br>
                It's written both in Python and C so a maximum of person can understand it.<br> It's not "hard" to understand how it works.<br>
            </div>
            <a href = "https://github.com/aderepas/WeekGolfPoints">
                <div id="github_button">
                    <div class="vertical-align">
                        <img src="img/github.svg" style="width: 70px">
                    </div>
                </div>
            </a>

            <div class="question_list" id="third_element_scroll" style="margin-top: 60px"> FAQ</div>
            <div class="bar1"></div>
            <div id="summary_faq"></div>



            <div class="faq_list">Why do I only have 3 points?</div>
            <div class="bar2"></div>
            <div class="descriptif">
                When you start playing weekgolf you start with 3 points.<br>
                1 golf point, 1 upgrade point and 1 cooperation point.<br>
                > You can win golf points by solving the challenge of the week <<br>
                > You can win upgrade points when you upgrade the best answer <<br>
                > You can win cooperation points when your comment is being upvoted <<br>
                Golf points are added to your account when you the week of competition is over.<br>
            </div>


            <div class="faq_list">What are the different types of points</div>
            <div class="bar2"></div>
            <div class="descriptif">
                There is 3 types of points: golf points, upgrade points and cooperation points.<br>
                > You can win golf points by solving the challenge of the week <<br>
                > You can win upgrade points when you upgrade the best answer <<br>
                > You can win cooperation points when your comment is being upvoted <<br>
            </div>


            <div class="faq_list">When a new language will be added to Weekgolf?</div>
            <div class="bar2"></div>
            <div class="descriptif">
                Each month a new language will be added to weekgolf.<br>
                You can vote for the language that you want to be in WeekGolf > <a href="https://week.golf/newLanguage.php" class="link_text">here</a> <<br>
            </div>

            <div class="faq_list">How can I interact with people?</div>
            <div class="bar2"></div>
            <div class="descriptif">
                You can't directly send a message to someone on WeekGolf<br>
                However, you can write a comment under someone's post to congratulate them on their response or ask them for a part of their code that you may not have understood.<br>
                You can also join the WeekGolf discord server to interact with the members there and much more!<br>
            </div>
            <a href = "https://discord.gg/CqrbqSkdX3">
                <div id = "discord_button">
                    <div class = "vertical-align">
                        <img src = "img/discord.svg" style="width: 70px">
                    </div>
                </div>
            </a>

            <div class="faq_list">How can I get user input in JavaScript?</div>
            <div class="bar2"></div>
            <div class="descriptif">
                You can do it using prompt()<br>
                And even if it is marked "JavaScript" so that a maximum of people understand it, it's rather NodeJS.<br>
                Because it is not really possible to take STDIN in pure JavaScript.<br>
            </div>

            <div class="faq_list">How do I add a logo for the language?</div>
            <div class="bar2"></div>
            <div class="descriptif">
                You can't.<br>
                But if you think that one logo is missing, don't hesitate to less us know by contacting admin by discord or at <a href="mailto:admin@week.golf" class="link_text">admin@week.golf</a><br>
            </div>

            <div class="faq_list">More info about versions ?</div>
            <div class="bar2"></div>
            <div class="descriptif">
                The version of C, is the version of the GCC compiler. Its running C17<br>
                The version of C++, is the version of the clang compiler. Its running C++20<br>
                The version of C#, is the version of the .NET framework. Its running C#10<br>
                The version of K, is the git commit. Its from the repository ngn/k<br>
                The version of JavaScript, is the version of NodeJS LTS<br>
                The version of Prolog, is the version of SWI-Prolog<br>
            </div>
            <br>
            <br>
            
        </main>
        
        <!-- Footer -->
        <?php
        include_once "footer.html";
        ?>

        <!-- Smooth Scroll -->
        <script>
            // Smooth scroll to an element
            window.smoothScroll = function(target) {
                var scrollContainer = target;

                do { //find scroll container
                    scrollContainer = scrollContainer.parentNode;
                    if (!scrollContainer) return;
                    scrollContainer.scrollTop += 1;
                } while (scrollContainer.scrollTop == 0);

                
                var targetY = 0;
                do { //find the top of target relatively to the container
                    if (target == scrollContainer) break;
                    targetY += target.offsetTop;
                } while (target = target.offsetParent);


                targetY -= 40 + targetY / 40;
                scrolling = 0;
                i = 0;
                function scroll(){
                    if (Math.round(i) > 30) return;
                    document.body.scrollTop = targetY * i / 30 ;
                    document.documentElement.scrollTop = targetY * i / 30;
                    
                    if (i > 25){
                        i += .25
                    } else if (i > 20){
                        i += .5
                    } else {
                        i += 1.2;
                    }
                    setTimeout(scroll,10)
                }

                scroll();

            }
        </script>


        <!-- FAQ -->
        <script>
            const faq_list = document.getElementsByClassName("faq_list");
            let textContent = "";

            for (let i = 0; i < faq_list.length; i++){
                textContent += `
                <div class="summary_faq_div" onclick="smoothScroll(document.getElementsByClassName('faq_list')[${i}])">
                    ${faq_list[i].textContent}
                </div>`
            }

            document.getElementById("summary_faq").innerHTML = textContent;
        </script>
    </body>
</html>