<!DOCTYPE html>
<html lang="en">
    <head>
        <!-- 3ncoding -->
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Meta preview -->
        <!---- Image ---->
        <meta property="og:image" content="https://week.golf/img/preview.png" />
        <meta property="og:image:alt" content="WeekGolf's logo" />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
        <meta property="og:image:type" content="png" />
        <!---- Text ---->
        <meta property="og:site_name" content="WeekGolf" />
        <meta property="og:title" content="Statistics" />
        <meta property="og:description" content="Here are the statistics about the progression of a user or the global user in a problem" />

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
        <link href="stats.css" rel="stylesheet" type="text/css" />

        <!-- Embed HTML -->
        <script src="lib/csi.js"></script>

        <!-- Header Boucing -->
        <script src="header.js"></script>

        <!-- Scroll to Top -->
        <script>
            function topFunction() {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }


            let pp_url = "";
            function pp(){
                const header_xhttp = new XMLHttpRequest();

                header_xhttp.open("POST", "https://week.golf/getPpByToken.php", true);
                header_xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                header_xhttp.send(`t=${localStorage.token}`);

                header_xhttp.onload = function() {
                    pp_url = JSON.parse(header_xhttp.response)["pfp"];
                }
            }
            pp()

            function recursion(){
                if (document.getElementById("pp") != null && pp_url !== "" ) {
                    document.getElementById("pp").src = pp_url!==null?pp_url:"img/nouser_white.jpg";
                } else {
                    setTimeout("recursion()", 10); // try again in 10 milliseconds
                }
            }
            recursion()

            
            function updateHeader(){
                if (document.getElementById("left_header") != null){
                    if (localStorage.smallHeader == "small"){
                        document.getElementById("left_header").style.display = "none";
                    } else {
                        document.getElementById("left_header_nav").style.display = "none";
                    }
                } else {
                    setTimeout("updateHeader()", 10); // try again in 10 milliseconds
                }
            }
            updateHeader()



            function fromHeightTofloat(height){
                return parseFloat(height.substring(0, height.length - 2));
            }
        </script>

        <style>
            #footer {
                clear: both;
                position: relative;
            }
        </style>

    </head>
    <body>
        <!-- Header -->
        <?php
            include_once "header.html";
        ?>
        <main>
            
            <title id="question_text">Statistics</title>
            <div class="bar1"></div>
            
            <!-- Graph -->
            <div id="stat_graph">
                <div id="bar_left"></div>
                <div id="bar_down"></div>
            </div>
            <div id = "flex_sub"></div>

            <!-- Answer -->
            <section id="content_answer" value="0" title = "Click here to see answers!">
                <button id="green_left">
                    <!-- A<br>N<br>S<br>W<br>E<br>R<br>S  -->
                    <div style="width: 100%; height: 100%; text-align: center; display: table">
                        <div class="vertical-align">
                            <img src="img/checkbox.svg" width="50px">
                        </div>
                    </div>
                </button>
                <article id="selector_answer">
                    
                </article>
                <article style="height: 80%; margin-top: 40px; width: 3px; background-color: #888; float: left"></article>
                <article style="height: 100%; width: calc(90% - 100px - 3px); float: left;">
                    <div style="text-align: center; font-size: 18px; color: #fff; padding: 10px;" id="the_title_stat"></div>
                    <div class="solution_ide" id="the_solution"></div>
                </article>
            </section>

            
            <div class="descriptif" style="font-size: 40px;margin-top: 70px;margin-bottom: 10px;">
                Parameters
            </div>
            

            <!-- Users -->
            <section class="selector">
                <!-- Header -->
                <header class="header_selector">
                    <div class="vertical-align">
                        Users
                    </div>
                </header>

                <!-- Content -->
                <section class="content_selector">
                    <input class="search_bar" onkeyup="filter('users')" placeholder="Username OR ID...">
                    <div class="box_selector" onclick="newOption(0, -1)" value="-1" title="All best score">
                        🌎GLOBAL
                    </div>
                    <?php

                        include_once "connectToDatabase.php";

                        $result = $conn->query("SELECT id, username FROM Users ORDER BY golf_score DESC");

                        for ( $i = 0; $row = $result -> fetch_assoc() ; $i ++) {
                    ?>
                        
                        <div class="box_selector" onclick="newOption(0, <?= $i ?>)" value="<?= $row['id'] ?>" title="<?= $row['username'] ?>">
                            <?= $row['username'] ?>
                        </div>
                        
                    <?php
                        }
                    ?>
                </section>
            </section>


            <!-- Lang -->
            <section class="selector">
                <!-- Header -->
                <header class="header_selector">
                    <div class="vertical-align">
                        Languages
                    </div>
                </header>

                <!-- Content -->
                <section class="content_selector">
                    <input class="search_bar" onkeyup="filter('lang')" placeholder="Language...">
                    <?php

                    $result = $conn->query("SELECT lang FROM CurrentLang ORDER BY lang");

                    for ( $i = 0 ; $row = $result -> fetch_assoc() ; $i++ ) {

                    ?>

                        <div class="box_selector" onclick="newOption(1,<?= $i ?>)" title="<?= $row['lang'] ?>"><?= ucfirst(str_replace("cs","c#",$row['lang'])) ?></div>

                    <?php
                        }
                    ?>
                </section>
            </section>


            <!-- Problems -->
            <section class="selector">
                <!-- Header -->
                <header class="header_selector">
                    <div class="vertical-align">
                        Problems
                    </div>
                </header>

                <!-- Content -->
                <section class="content_selector">
                    <input class="search_bar" onkeyup="filter('problem')" placeholder="Problem OR ID...">
                    <?php

                    $result = $conn->query("SELECT id,title FROM Problem WHERE date_enable <= NOW() ORDER BY id DESC");

                    for ($i = 0; $row = $result -> fetch_assoc(); $i++ ) {

                    ?>

                        <div class="box_selector" onclick="newOption(2,<?= $i ?>)" value="<?= $row["id"] ?>" title="<?= $row['title'] ?>">
                            <?= $row['title'] ?>
                        </div>

                    <?php
                        }
                    ?>
                </section>
            </section>

        </main>

        <?php
            include_once "footer.html";
        ?>




        <!--
                ____.                     _________            .__        __   
                |    |____ ___  _______   /   _____/ ___________|__|______/  |_ 
                |    \__  \\  \/ /\__  \  \_____  \_/ ___\_  __ \  \____ \   __\
            /\__|    |/ __ \\   /  / __ \_/        \  \___|  | \/  |  |_> >  |  
            \________(____  /\_/  (____  /_______  /\___  >__|  |__|   __/|__|  
                          \/           \/        \/     \/         |__|    
        -->
        <!-- IDE -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script src="includes/ace/ace.js"></script>
        <script src="includes/ace/theme-monokai.js"></script>


        <!-- GLOBAL VAR -->
        <script>
            <?php
                // Is there params ?
                //////////////////////////////
                    
                // User
                if (isset($_GET["id"])){
                    $id = $_GET["id"];
                    $result = rsql("SELECT username FROM Users WHERE id = ?", [$id], "i");
                    if ($result -> num_rows > 0){
                        $username = $result -> fetch_assoc()["username"];
                    }
                }

                // Lang
                if (isset($_GET["lang"])){
                    $lang = rawurldecode($_GET['lang']);
                }

                // Problem
                if (isset($_GET["pb"])){
                    $pb = rawurldecode($_GET["pb"]);
                    $result = rsql("SELECT id FROM Problem WHERE title = ?", [$pb], "s");
                    if ($result -> num_rows > 0){
                        $pid = $result -> fetch_assoc()["id"];
                    }
                }

            ?>
            let username_global = "<?= isset($username) ? $username : '' ?>";
            let id_global = "<?= isset($id) ? $id : '' ?>";
            let lang_global =  "<?= isset($lang) ? $lang : 'Python' ?>";
            <?php
                if (!isset($pb) || !isset($pid)){
                    $result = $conn -> query("SELECT title, id FROM Problem WHERE date_end <= NOW() ORDER BY date_end DESC LIMIT 1");
                    $result = $result -> fetch_assoc();
                }
            ?>
            let problem_global = "<?= isset($pb) && isset($pid) ? $pb : $result["title"] ?>";
            let pid_global = "<?= isset($pb) && isset($pid) ? $pid : $result["id"] ?>";

            let users_global = [];
            let answers_global = [];
            let points = [];


            function numberToRank(n){
                nb = "" + n;
                return (parseInt(nb.slice(-1))<4 && parseInt(nb.slice(-1))>0 && (nb[-2] != "1" || nb == '1'))?["st","nd","rd"][parseInt(nb.slice(-1))-1]:"th";
            }
        </script>
        

        <!-- Initialize global var -->
        <script>
            if (username_global == ""){
                // ID + USERNAME
                ///////////////////////////
                // ID
                const xhttp = new XMLHttpRequest();
                xhttp.open("POST", "https://week.golf/getIdbyToken.php", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send(`t=${localStorage.token}`);

                xhttp.onload = function() {
                    const rep = JSON.parse(xhttp.responseText);
                    id_global = new URL(window.location.href).searchParams.get("id") != null ? new URL(window.location.href).searchParams.get("id") : rep["id"];


                    // USERNAME
                    const xhttp2 = new XMLHttpRequest();
                    xhttp2.open("POST", "https://week.golf/getInfosById.php", true);
                    xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhttp2.send(`id=${id_global}`);

                    xhttp2.onload = function() {
                        username_global = JSON.parse(xhttp2.responseText)["username"];
                    }
                }
            }
        </script>


        <!-- Initializing the graph -->
        <script>
            // Initializing graph
            ///////////////////////////////////
            let textContent = "";
            const nb_temp_bar = 4;
            const height_graph = parseInt(window.getComputedStyle(document.getElementById("stat_graph")).height);
            const width_graph = parseInt(window.getComputedStyle(document.getElementById("stat_graph")).width);

            
            // Generate temp bar
            ////////////////////////////
            function generateTempBar(){
                for (let i = 1; i <= nb_temp_bar; i++){
                    textContent += `<div class="temp_bar" style="margin-bottom: ${ i * height_graph / (nb_temp_bar + 1) }px"></div>`;
                }
                document.getElementById("stat_graph").innerHTML += textContent;
            }


            // Initializing Flex sub
            ////////////////////////////////////
            function initFlexSub(points){
                document.getElementById("flex_sub").innerHTML = "";
                for (let i = 1; i <= points.length; i++){
                    document.getElementById("flex_sub").innerHTML += `<div> ${i} </div>`;
                }
            }


            // Get Min and Max
            //////////////////////////////
            function getMiniMaxi(points){

                // Get mini and maxi //

                let mini = 10 * Math.floor(Math.min(...points)/10);
                let maxi = 10 * Math.ceil(Math.max(...points)/10);

                return [mini, maxi];
            }


            // Initialize Score Axe
            ////////////////////////////////////
            function initScore(points){

                // Init the score axes //
                

                // Filtering things that alreadt exists
                ///////
                let textContent = `<div id="bar_left"></div>
                <div id="bar_down"></div>`;
                let textContentWithScoreEvolution = document.getElementById("stat_graph").innerHTML.split("\n");
                for (line of textContentWithScoreEvolution){
                    if (!line.includes("score_evolution")){
                        textContent += line;
                    }
                }

                let mini, maxi;
                [mini, maxi] = getMiniMaxi(points);
                console.log(mini, maxi);
                const height_graph = parseInt(window.getComputedStyle(document.getElementById("stat_graph")).height);

                for (let i = 0; i < nb_temp_bar + 2; i ++){
                    textContent += `\n<div class="score_evolution" style="margin-bottom: ${ i * height_graph / (nb_temp_bar + 1) - 10 }px"> ${i * (maxi - mini) / (nb_temp_bar + 1) + mini} </div>`
                }

                document.getElementById("stat_graph").innerHTML = textContent;
                generateTempBar();
            }

            

            // Set points
            ////////////////////////////////
            function loadPoints(points){

                // Add points to the graph //

                const height_graph = parseInt(window.getComputedStyle(document.getElementById("stat_graph")).height);
                const width_graph = parseInt(window.getComputedStyle(document.getElementById("stat_graph")).width);
                const color_users = ["#3C3","#CC3","#cc5933", "#C33", "#cc33a6", "#a633cc", "#5933cc", "#3380cc","3CC", "#33cc80"];
                const temp_users = users_global != null ? [...new Set(users_global)] : [];

                let textContentWithPoints = document.getElementById("stat_graph").innerHTML.split("\n");
                let mini, maxi;
                [mini, maxi] = getMiniMaxi(points);

                // Get rid of points already here
                let textContent = textContentWithPoints[0].includes("bar_down")?'':'<div id="bar_down"></div>';
                for (line of textContentWithPoints){
                    if (!line.includes("a_point")){
                        textContent += line;
                    }
                }



                for (let i = 0; i < points.length; i++){
                    let margin_left =  15 + (width_graph - 35) * i / (points.length - 1)  - 7.5; // - 7.5 is radius of point
                    let margin_bottom = height_graph * (points[i] - mini) / (maxi - mini) - 7.5 + 3; // - 7.5 is radius of point && + 5 is due to axe
                    textContent += `
                    <div class="a_point" title="${points[i]} bytes${users_global != null ?" by "+users_global[i]:""}" style="margin-left: ${ margin_left }px; margin-bottom: ${ margin_bottom }px; ${users_global != null ? "background-color:"+color_users[temp_users.indexOf(users_global[i])] : ""}" onclick="showAnswers(force_open = true);setContentIDE([].concat(answers_global).reverse()[${i}]);setTitle('${username_global}','${lang_global}',${i+1},'${problem_global}'${users_global != null ? ",'"+users_global[i]+"'" : ""});"></div>`
                }


                document.getElementById("stat_graph").innerHTML = textContent;
            }
            loadPoints(points);
            window.addEventListener("resize", function(){
                loadPoints(points);
            })

        </script>




        <!-- Adding sub - sections  &&  title -->
        <script>

            // Creates buttons at the left
            //////////////////////////////////
            function setButtonSelector(rep){

                // Create all buttons at the right of answers //

                let textContent = `<div class="little_box_index" onclick="setContentIDE(noSelected())">
                    <div class="vertical-align">
                        Ø   
                    </div>
                </div>`;

                for (let i = 0; i < rep.length; i++){
                    textContent += `
                    <div class="little_box_index" onclick="setContentIDE(answers_global[${i}]);setTitle(username_global,lang_global,${rep.length - i},problem_global ${users_global != null ? ",'" +users_global[rep.length - i  - 1]+"'" : ""});">
                        <div class="vertical-align">
                            ${rep.length - i} 
                        </div>
                    </div>`
                }
                
                document.getElementById("selector_answer").innerHTML = textContent;
            }

            // Set title
            ////////////////////////////////////
            function setTitle(username, lang, n, problem, users=null){
                if (users === null){
                    n = n != "NaN" ? n + numberToRank(n) : "NaN";
                    document.getElementById("the_title_stat").innerHTML = `${username}'s ${n} answer with ${lang} on ${problem}`;
                } else {
                    document.getElementById("the_title_stat").innerHTML = `Global answer N°${n} with ${lang} on ${problem} by ${users}`;
                }
            }


            setButtonSelector(answers_global);

            setTitle(username_global,lang_global,"NaN",problem_global);
        </script>



        <!-- IDE -->
        <script>
            let the_solution = ace.edit(document.getElementById("the_solution"));


            window.onload = function(){
                the_solution = ace.edit("the_solution");
                the_solution.setTheme("ace/theme/monokai");
                the_solution.session.setUseWorker(false);
                the_solution.setShowPrintMargin(false);
                the_solution.setReadOnly(true);
                setContentIDE(noSelected());
                setLangIDE(localStorage.selectedLanguage);


                the_solution.setOptions ({
                    fontFamily: "monospace",
                    fontSize: 20,
                    animatedScroll: true,
                    maxLines: Infinity
                });
            }

            // Setting lang of IDE
            //////////////////////////////
            function setLangIDE(lang){

                // Change the lang of the current IDE //

                lang = lang.toLowerCase()
                const correspondance = {
                    "apl": "apl",
                    "bash": "sh",
                    "c++": "c_cpp",
                    "c": "c_cpp",
                    "c#": "csharp",
                    "cs": "csharp",
                    "clojure":"clojure",
                    "elixir":"elixir",
                    "go":"golang",
                    "golfscript":"golfscript",
                    "haskell":"haskell",
                    "j":"j",
                    "java":"java",
                    "jelly":"jelly",
                    "julia":"julia",
                    "k":"k",
                    "kotlin":"kotlin",
                    "lua":"lua",
                    "javascript": "javascript",
                    "ocaml":"ocaml",
                    "perl": "perl",
                    "php": "php",
                    "prolog": "prolog",
                    "python": "python",
                    "r": "r",
                    "raku": "raku",
                    "ruby": "ruby",
                    "rust": "rust",
                    "vyxal": "vyxal"
                }

                the_solution.session.setMode(`ace/mode/${lang in correspondance ? correspondance[lang] : lang}`);
            }

            // When void clicked
            //////////////////////////////
            function noSelected(){
                
                // If selected is void //

                let str =  `User selected: ${username_global}\nLang selected: ${lang_global}\nProblem selected: ${problem_global}\nAnswer selected: NaN`;
                
                setTitle(username_global, lang_global, "NaN", problem_global);

                return str; 
            }

            // Setting content of IDE
            /////////////////////////////
            function setContentIDE(content){

                // Set content for the IDE //

                the_solution.setValue(content, 1);
            }
        </script>



        <!-- Show answers -->
        <script>

            // Function when you click on the ANSWERS button
            //////////////////////////////////////////////////////////
            function showAnswers(force_open = false){

                let content_answer = document.getElementById("content_answer");
                const b = content_answer.getAttribute("value") == 0;
                let stat_graph = document.getElementById("stat_graph");
                let flex_sub = document.getElementById("flex_sub");
                let green_left = document.getElementById("green_left");


                // Showing answer
                if (b){
                    content_answer.style.marginTop = "0px";
                    setContentIDE(noSelected());
                    
                    // Added delay for more style
                    setTimeout(function(){
                        content_answer.style.width = "90%"; // Deploy 
                        green_left.style.width = "100px"; // Deploy 
                        green_left.style.borderBottomRightRadius = "0px"; // BorderRad
                        green_left.style.borderTopRightRadius = "0px"; // BorderRad
                        // Graph
                        stat_graph.style.marginLeft = "5%";
                        stat_graph.style.width = "90%";
                        flex_sub.style.marginLeft = "5%";
                        flex_sub.style.width = "calc(90% - 30px)";
                    }, 150);

                    // Changing value
                    content_answer.setAttribute("value", b?"1":"0");

                } else if (!force_open) { // Not showing

                    
                    // Added delay for more style
                    setTimeout(function(){
                        content_answer.style.marginTop = "-470px";
                    }, 150);
                    
                    content_answer.style.width = "80px"; // Hide answers
                    green_left.style.width = "80px"; // Border Radius
                    green_left.style.borderRadius = "5px"; // Border Radius
                    stat_graph.style.marginLeft = "calc(5% + 120px)";
                    stat_graph.style.width = "calc(90% - 120px)";
                    flex_sub.style.marginLeft = "calc(5% + 120px)";
                    flex_sub.style.width = "calc(90% - 30px - 120px)";

                    // Changing value
                    content_answer.setAttribute("value", b?"1":"0");
                }

                

                // Loading points
                setTimeout(function(){
                    const height_graph = parseInt(window.getComputedStyle(document.getElementById("stat_graph")).height);
                    const width_graph = parseInt(window.getComputedStyle(document.getElementById("stat_graph")).width);
                    loadPoints(points);
                }, 200);
            }
            
            document.getElementById("green_left").addEventListener("click", function(){
                showAnswers();
            });
        </script>

        
        <!-- Click on a new choice -->
        <script>
            function newOption(section, selected, send_request = true){

                // Put a box to the top + send request //

                const boxes = document.getElementsByClassName("content_selector")[section].getElementsByClassName("box_selector");

                for (let i = 0; i < boxes.length; i++){
                    boxes[i].style.order = "0";
                    boxes[i].style.backgroundColor = "#222";
                }

                if (section != 0){
                    boxes[selected].style.order = "-2";
                    boxes[selected].style.backgroundColor = "var(--main-color)";
                } else if (selected >= 0) {
                    boxes[selected + 1].style.order = "-2";
                    boxes[selected + 1].style.backgroundColor = "var(--main-color)";
                } else {
                    boxes[0].style.order = "-2";
                    boxes[0].style.backgroundColor = "var(--main-color)";
                }

                switch (section) {
                    case 0:
                        if (selected >= 0){
                            id_global = boxes[selected + 1].getAttribute("value");
                            username_global = boxes[selected + 1].textContent.replaceAll(" ","").replaceAll("\n","").replaceAll("\t","");
                        } else {
                            id_global = -1;
                            username_global = "global";
                        }
                        break;
                    case 1:
                        lang_global = boxes[selected].textContent;
                        setLangIDE(lang_global);
                        break;
                    case 2:
                        pid_global = boxes[selected].getAttribute("value");
                        problem_global = boxes[selected].textContent.replaceAll(" ","").replaceAll("\n","").replaceAll("\t","");
                        break;
                }


                // Score of user
                if (send_request) {
                    let xhttp = new XMLHttpRequest();
                    
                    // If GLOBAL
                    if ((section == 0 && selected == -1) || (id_global == -1 && section != 0)){
                        xhttp.open("POST", "https://week.golf/getEvolutionGlobal.php", true);
                        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhttp.send(`pid=${pid_global}&lang=${encodeURIComponent(lang_global)}`);
                    } else { 
                    // If User
                        xhttp.open("POST", "https://week.golf/getGolfOfUser.php", true);
                        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhttp.send(`id=${id_global}&pid=${pid_global}&lang=${encodeURIComponent(lang_global)}`);
                    }


                    xhttp.onload = function() {
                        const rep = JSON.parse(xhttp.responseText);
                        const size = rep["size"];
                        const users = rep["users"];
                        const code = rep["code"].reverse();

                        const height_graph = parseInt(window.getComputedStyle(document.getElementById("stat_graph")).height);
                        const width_graph = parseInt(window.getComputedStyle(document.getElementById("stat_graph")).width);

                        users_global = users;
                        answers_global = code;
                        points = size;
                        
                        loadPoints(size);
                        initScore(size.length !== 0 ? size : [0]);
                        initFlexSub(size);


                        setButtonSelector(answers_global);


                        setContentIDE(noSelected());
                        // If not global
                        if (users == null)
                            setTitle(username_global, lang_global, "NaN", problem_global);
                        else 
                            setTitle(username_global, lang_global, "NaN", problem_global, "NaN");
                    }
                } 
            }
        </script>

        <!-- Filtering -->
        <script>
            function filter(str){
                const sectionIndex = ["users",'lang','problem'].indexOf(str);
                const text = document.getElementsByClassName("search_bar")[sectionIndex].value.toLowerCase();
                const boxes = document.getElementsByClassName("content_selector")[sectionIndex].getElementsByClassName("box_selector");

                for (let i = 0; i < boxes.length; i++)
                    if (!boxes[i].textContent.toLowerCase().includes(text) && boxes[i].getAttribute("value") != text)
                        boxes[i].style.display = "none";
                    else
                        boxes[i].style.display = "flex";

            }
        </script>


        <!-- Sending request -->
        <script>

            // Default IDE content
            setContentIDE(noSelected());
            

            function setUp(){

                // Set up things //

                // If every thing is defined
                if (problem_global != "" && username_global != "" && id_global != "" && lang_global != "" && pid_global != ""){

                    // Default option
                    ////////////////////////////
                    let nb_user = -1;
                    let nb_lang = -1;
                    let nb_problem = -1;
                    let found = 0;
                    let elem_user = document.getElementsByClassName("content_selector")[0].getElementsByClassName("box_selector");
                    let elem_lang = document.getElementsByClassName("content_selector")[1].getElementsByClassName("box_selector");
                    let elem_problem = document.getElementsByClassName("content_selector")[2].getElementsByClassName("box_selector");

                    // While we didn't found the User ID and the Lang and the Problem ID, search
                    for (let i = 0; found < 3; i++){
                        // If correspond to 
                        /////////////////////
                        // User ID
                        if (i < elem_user.length && elem_user[i].getAttribute("value") == id_global){
                            nb_user = i;
                            found ++;
                        }
                        
                        // Lang
                        if (i < elem_lang.length && elem_lang[i].textContent.toLowerCase().replace("#","s") == lang_global.toLowerCase()){
                            nb_lang = i;
                            found++
                        }
                        
                        // Problem id
                        if (i < elem_problem.length && elem_problem[i].getAttribute("value") == pid_global){
                            found++
                            nb_problem = i;
                        }
                    }
                    console.log(nb_user, nb_lang, nb_problem)

                    newOption(0, nb_user - 1, false);
                    newOption(1, nb_lang, false);
                    newOption(2, nb_problem);
                } else {
                    setTimeout(setUp, 50);
                }
            }

            setUp();
        </script>
    </body>
</html>