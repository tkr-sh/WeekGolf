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
        <link href="newLanguage.css" rel="stylesheet" type="text/css" />

        <!-- Embed HTML -->
        <script src="lib/csi.js"></script>

        <!-- Header Boucing -->
        <script src="header.js"></script>

        <!-- Scroll to Top -->
        <script src="scrolltop.js"></script>

        <style>
            #footer {
                clear: both;
                position: relative;
            }
        </style>
    </head>
    <body style="height: 100%">  
        <!-- Header -->
        <?php
         include_once "header.html";
        ?>

        
        <?php
            function returnPhase($conn) {
                for ($i = 1; $i < 5;$i++){
                    if ($conn->query("SELECT * FROM Phases WHERE phase$i < NOW() AND phase".(max(($i+1)%6,1)!=5?max(($i+1)%6,1):'end')." > NOW();")->num_rows > 0) 
                        return $i; 
                }

            }

            
            // Connecting to DataBase
            include_once "connectToDatabase.php";

            $phase = returnPhase($conn);
        ?>


        <!-- Need to log in -->
        <div id="accountToVote">
            You need an account to vote
            <a href="https://week.golf/createAccount.html">
                <button id="createAccountVote" >
                    Create an account
                </button>
            </a>
        </div>


        <?php
        if ($phase === 1) {
        ?>

        <!-- First phase -->
        <div id="phase1">
            <div class="section_title">
                PHASE 1 - CREATING
            </div>
            <img src="img/question.svg" class="infos_button" onclick ="showInfos(0)">
            <div class="infos_txt">
                > We are in the first phase<br>
                > There are 4 phases<br>
                > Phase 1: You can enter up to 3 languages that aren't on WeekGolf <br>
                > Phase 2: You can vote for the languages that you want to be in WeekGolf<br>
                > Phase 3: The 2 languages with the most upvotes during Phase 2 are on Phase 3. The language with the most upvote on Phase 3 will be added to WeekGolf<br>
                > Phase 4: The winning language will be added to WeekGolf<br><br>
                > Restrictions:<br>
                >> In phase 1 you can't add more than 3 languages<br>   
                >> In phase 3 you can only vote for 1 language

            </div>
            <time id="time">
                <div class="vertical-align">    
                    Loading time...
                </div>
            </time>
            <table style="width: 100%;height:100%">
                <tr style="width: 100%;height:100%">
                    <td style="width: 5%;height:100%">
                    </td>
                    <td style="width: 79%; height:100%; max-width: 79%;">
                        <textarea class="text_area_comment" placeholder="Add a language..."  oninput="this.value = this.value.replace(/\n/g,'')"></textarea>
                    </td>
                    <td style="width: 1%;height:100%"></td>
                    <td style="width: 5%;height:70px">
                        <div class="send_comment" onclick="addLanguage()">
                            <div class="vertical-align">
                                <img src="img/paper_plane.svg" class="paper_plane">
                            </div>
                        </div>
                    </td>
                    <td style="width: 5%;height:100%"></td>
                </tr>
            </table>

            <div id="error_msg"></div>

            <div class="content_proposed_language">
                <div class="proposed_language">
                    <div class="header_proposed_phase1">
                        Python
                    </div>
                    <div class="circle_lang_phase1">
                        <img src="Img/python.svg" class="lang_img">
                    </div>
                </div>
                <div class="proposed_language">
                    <!-- Phase 2 -->
                    <div class="header_proposed">
                        Python
                    </div>
                    <div class="circle_lang">
                        <img src="Img/python.svg" class="lang_img">
                    </div>
                </div>
            
            
            </div>
        </div>

        <?php
        }



        if ($phase === 2) {
        ?>

        <div id="phase2"  style="height: calc(100% - 350px)">
            <div class="section_title">
                PHASE 2 - VOTE
            </div>
            <img src="img/question.svg" class="infos_button" onclick ="showInfos(1)">
            <div class="infos_txt">
                > We are in the second phase<br>
                > There are 4 phases<br>
                > Phase 1: You can enter up to 3 languages that aren't on WeekGolf <br>
                > Phase 2: You can vote for the languages that you want to be in WeekGolf<br>
                > Phase 3: The 2 languages with the most upvotes during Phase 2 are on Phase 3. The language with the most upvote on Phase 3 will be added to WeekGolf<br>
                > Phase 4: The winning language will be added to WeekGolf<br><br>
                > Restrictions:<br>
                >> In phase 1 you can't add more than 3 languages<br>   
                >> In phase 3 you can only vote for 1 language
            </div>
            <time id="time2">
                <div class="vertical-align">    
                    Loading time...
                </div>
            </time>

            <div id="error_msg"></div>

            <div class="content_proposed_language">
                <div class="proposed_language">
                    <!-- Phase 2 -->
                    <div class="header_proposed">
                        Python
                    </div>
                    <div class="circle_lang">
                        <img src="img/python.svg" class="lang_img">
                    </div>
                </div>
            
            
            </div>
        </div>

        <?php
        }



        if ($phase === 3) {
        ?>

        <div id="phase3" style="min-height: 100%">
        <div class="section_title">
                PHASE 3 - FINAL
            </div>
            <img src="img/question.svg" class="infos_button" onclick ="showInfos(2)">
            <div class="infos_txt" style="background-color: #10101010">
                > We are in the third phase<br>
                > There are 4 phases<br>
                > Phase 1: You can enter up to 3 languages that aren't on WeekGolf <br>
                > Phase 2: You can vote for the languages that you want to be in WeekGolf<br>
                > Phase 3: The 2 languages with the most upvotes during Phase 2 are on Phase 3. The language with the most upvote on Phase 3 will be added to WeekGolf<br>
                > Phase 4: The winning language will be added to WeekGolf<br><br>
                > Restrictions:<br>
                >> In phase 1 you can't add more than 3 languages<br>   
                >> In phase 3 you can only vote for 1 language

            </div>
            <time id="time3">
                <div class="vertical-align">    
                    Loading time...
                </div>
            </time>


            <div style="height:auto;width: 50%; float: left;">
                <img src="img/upvotewhite.svg" class="finalUpvote" onclick="finalUpvote(0)" value="notup">
                <div class="nb_vote"> ? vote(s)</div>
                <img src="img/question.svg" class="final_language">
                <div class="lang_name">?</div>
            </div>
            <div style="height:auto;width: 50%; float: left;">
                <img src="img/upvotewhite.svg" class="finalUpvote" onclick="finalUpvote(1)" value="notup">
                <div class="nb_vote"> ? vote(s)</div>
                <img src="img/question.svg" class="final_language">
                <div class="lang_name">?</div>
            </div>
            
            <div id="graph">
                <div id="PartA"></div>
                <div id="PartB"></div>
            </div>
        </div>
        <?php
        }



        if ($phase === 4) {
        ?>

        <div id="phase4">
            <div class="section_title">
                PHASE 4 - END
            </div>
            <img src="img/question.svg" class="infos_button" onclick ="showInfos(3)">
            <div class="infos_txt" style="background-color: #10101010">
                > We are in the last phase<br>
                > There are 4 phases<br>
                > Phase 1: You can enter up to 3 languages that aren't on WeekGolf <br>
                > Phase 2: You can vote for the languages that you want to be in WeekGolf<br>
                > Phase 3: The 2 languages with the most upvotes during Phase 2 are on Phase 3. The language with the most upvote on Phase 3 will be added to WeekGolf<br>
                > Phase 4: The winning language will be added to WeekGolf<br><br>
                > Restrictions:<br>
                >> In phase 1 you can't add more than 3 languages<br>   
                >> In phase 3 you can only vote for 1 language

            </div>
            <time id="time4">
                <div class="vertical-align">    
                    Loading time...
                </div>
            </time>
            
            <div id="win_text">? won!</div>
            <img src="img/question.svg" id="win_lang">
            <div id="win_votes">with ? votes</div>

            
            <div id="graph2">
                <div id="PartC"></div>
                <div id="PartD"></div>
            </div>

            <div id="lang_will_be_added_soon">
                This language will be soonly available in WeekGolf! 
            </div>
        </div>
        <?php
        }
        ?>


        <!-- Footer -->
        <?php
         include_once "footer.html";
        ?>

        <!-- Get the phase-->
        <script>
            let phase = <?= $phase ?>;
        </script>

        <!-- Script resize info txt-->
        <script>
            function showInfos(n){
                const info = document.getElementsByClassName("infos_txt")[0];
                const b = window.getComputedStyle(info).width == "0px";
                info.style.width = b?"70%":"0px";
                info.style.height = b?"260px":"0px";
                info.style.marginLeft = b?"15%":"50%";
                info.style.padding = b?"15px":"0px";
                console.log(b,info,window.getComputedStyle(info).width)
                document.getElementById("phase3").style.height = Math.max(1000,(b?350+window.innerHeight:50+window.innerHeight)) + "px";
                document.getElementById("phase4").style.height = Math.max(1000,(b?350+window.innerHeight:50+window.innerHeight)) + "px";
            }

            function resizeContent(){
                <?php
                if ($phase === 1) {
                ?>
                const height = Math.ceil((document.getElementById("phase1").getElementsByClassName("proposed_language").length/5))
                let cont = document.getElementsByClassName("content_proposed_language");
                const heightPx = Math.max(height*80, 500)+ "px";
                
                for (let i = 0; i < cont.length; i++){
                    cont[i].style.height = heightPx;
                }
                <?php
                }
                ?>
            }
        </script>

        <!-- Add language in Phase 1 -->
        <script>
            <?php
            if ($phase === 1){
            ?>
            function addLanguage(){
                const xhttp = new XMLHttpRequest();

                xhttp.open("POST", "https://week.golf/addLanguage.php", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                xhttp.send(`t=${localStorage.token}&lang=${document.getElementsByTagName("textarea")[0].value}`);
                xhttp.onload = function() {
                    const rep = xhttp.responseText;
                    if (!rep.includes("Added language whitout Problem")){
                        const err = document.getElementById("error_msg");
                        err.style.height = "auto";
                        err.style.marginTop = "10px";
                        err.style.marginBottom = "10px";
                        err.innerHTML = rep;
                    }
                }
            }
            <?php
            }
            ?>
        </script>

        <!-- Showing languages for Phase1 AND 2-->
        <script>
            let global_arr = [];
            let global_rep = [];
            let global_arr2 = [];
            let global_rep2 = [];
            let upvoted_arr = [];
            const xhttp = new XMLHttpRequest();
            xhttp.open("POST", "https://week.golf/showLanguages.php", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(`t=${localStorage.token}`);
            xhttp.onload = function() {
                
                const rep = JSON.parse(xhttp.responseText)["infos"];
                global_rep = rep;

                <?php
                if ($phase === 1) {
                ?>
                  ////////////////////////////////////
                 // PHASE 1
                /////////////////////////////////////
                console.log(rep,rep.length);
                let textContent = "";
                for (let i = 0; i < rep.length; i++){
                    textContent += `
                    <div class="proposed_language">
                        <div class="header_proposed_phase1" style="background-color: ${rep[i][1]};filter: brightness(90%);">
                            ${rep[i][0]}
                        </div>
                        <div class="circle_lang_phase1" style="background-color: ${global_rep[i][1]}; filter: brightness(100%);">
                            <img src="img/${rep[i][0].replace("#","s").replace("><>","fish").toLowerCase()}_white.svg" class="lang_img" onerror="next(${i}) ">
                        </div>
                    </div>` 
                }
                document.getElementsByClassName("content_proposed_language")[0].innerHTML = textContent;
                <?php
                }
                ?>

                resizeContent();

                <?php
                if ($phase === 2) {
                ?>
                const xhttp6 = new XMLHttpRequest();
                xhttp6.open("POST", "https://week.golf/userUpvote.php", true);
                xhttp6.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp6.send(`t=${localStorage.token}`);
                
                function upVoteDisplay(){
                    const rep = JSON.parse(xhttp6.responseText)["upvotes"];
                    for (let i = 0; i < proposed.length; i++){
                        if (rep.includes(proposed[i])){
                            imgFatherDiv[i].getElementsByClassName("upvote")[0].style.display = "none";
                            imgFatherDiv[i].getElementsByClassName("upvote")[1].style.display = "block";
                        } else {
                            console.log(imgFatherDiv[i])
                            imgFatherDiv[i].getElementsByClassName("upvote")[0].style.display = "block";
                            imgFatherDiv[i].getElementsByClassName("upvote")[1].style.display = "none";

                        }
                    }
                }

                xhttp6.onload = function() {
                    upvoted_arr = JSON.parse(xhttp6.responseText)["upvotes"];

                    
                      ////////////////////////////
                     // PHASE 2
                    ////////////////////////////
                    const rep2 = rep.sort(function(a, b) {return b[2] - a[2];});
                    global_rep2 = rep.sort(function(a, b) {return b[2] - a[2];});
                    console.log(rep2+"UWUU")
                    textContent = "";
                    for (let i = 0; i < rep2.length; i++){
                        textContent += `
                        <div class="proposed_language">
                            <div class="header_proposed" style="background-color: ${global_rep2[i][1]};  filter: brightness(90%);">${global_rep2[i][0]}</div>
                            <div class="circle_lang" style="background-color: ${global_rep2[i][1]}; filter: brightness(100%);">
                                <img class="lang_img">
                            </div>
                            <img src="img/upvotewhite.svg" class="upvote" onclick="upvoteLang(${i})" style="display: ${upvoted_arr.includes(global_rep2[i][0])?'none':'block'}">
                            <img src="img/upvotegreen.svg" class="upvote" onclick="upvoteLang(${i})" style="display: ${upvoted_arr.includes(global_rep2[i][0])?'block':'none'}">
                            <div class="textUpvote">${global_rep2[i][2]} vote${global_rep2[i][2]==1?"":"s"}</div>
                        </div>`

                    }
                    document.getElementsByClassName("content_proposed_language")[0].innerHTML = textContent;

                    console.log(document.getElementsByClassName("lang_img").length, rep2.length, ">>>>>>><<<<<<<<<<<<<<<<<<")
                    
                    for (let i = 0; i < rep2.length; i++){
                        let img = new Image();
                        const src = `img/${global_rep[i][0].replaceAll("#","s").replaceAll("><>","fish").toLowerCase()}_white.svg`
                        img.src = src;
                        img.onerror = function(){
                            document.getElementsByClassName("lang_img")[i].src = `img/question.svg`;
                        }
                        img.onload = function(){
                            document.getElementsByClassName("lang_img")[i].src = src;
                        }
                    }
                }
                <?php
                    }
                ?>
            }

                

            <?php
                if ($phase === 1) {
            ?>
            ////////////////////////////////////
            // PHASE 1
            /////////////////////////////////////
            function next(n){
                global_arr.push(n);
                let textContent = "";
                for (let i = 0; i < global_rep.length; i++){
                    let temp = (global_arr.includes(i)?"question.svg":`${global_rep[i][0].replace("C#","cs").replace("><>","fish").toLowerCase()}_white.svg`)
                    textContent += `
                    <div class="proposed_language">
                        <div class="header_proposed_phase1" style="background-color: ${global_rep[i][1]};  filter: brightness(90%);">${global_rep[i][0]}</div>
                        <div class="circle_lang_phase1" style="background-color: ${global_rep[i][1]}; filter: brightness(100%);">
                            <img src="img/${temp.replace("#","s").replace("><>","fish")}" class="lang_img" ${(global_arr.includes(i)?'':'onerror="next('+i+')"')}">
                        </div>
                    </div>` 
                }
                setTimeout(console.log(), 1);
                document.getElementsByClassName("content_proposed_language")[0].innerHTML = textContent;               
            }
            <?php
                }
            ?>
            
            
            <?php
                if ($phase === 2) {
            ?>
            //////////////////////////////
            // PHASE 2
            ////////////////////////////
            function next2(n){
                global_arr2.push(n);
                let textContent = "";
                for (let i = 0; i < global_rep2.length; i++){
                    let temp = (global_arr2.includes(i)?"question.svg":`${global_rep2[i][0].replace("C#","cs").replace("><>","fish").toLowerCase()}_white.svg`)
                    textContent += `
                    <div class="proposed_language">
                        <div class="header_proposed" style="background-color: ${global_rep2[i][1]};  filter: brightness(90%);">${global_rep2[i][0]}</div>
                        <div class="circle_lang" style="background-color: ${global_rep2[i][1]}; filter: brightness(100%);">
                            <img src="img/${temp.replace("#","s").replace("><>","fish")}" class="lang_img" ${(global_arr2.includes(i)?'':'onerror="next('+i+')"')}">
                        </div>
                        <img src="img/upvotewhite.svg" class="upvote" onclick="upvoteLang(${i})" style="display: ${upvoted_arr.includes(global_rep2[i][0])?'none':'block'}">
                        <img src="img/upvotegreen.svg" class="upvote" onclick="upvoteLang(${i})" style="display: ${upvoted_arr.includes(global_rep2[i][0])?'block':'none'}">
                        <div class="textUpvote">${global_rep2[i][2]} vote${global_rep2[i][2]==1?"":"s"}</div>
                    </div>` 
                    
                }
                setTimeout(console.log(), 1);
                document.getElementsByClassName("content_proposed_language")[1].innerHTML = textContent;
            }
            <?php
                }
            ?>
                
        </script>

        <!-- Remaining time -->
        <script>
            function getRemainingTimeByPhase(){
                const xhttp2 = new XMLHttpRequest();

                xhttp2.open("POST", "https://week.golf/getRemainingTimeByPhase.php", true);
                xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp2.send(`p=${phase}`);
                
                // Remaining time
                xhttp2.onload = function(){
                    const rep = JSON.parse(xhttp2.responseText);

                    let t = parseInt(rep["t"]);

                    function wait(){
                        let d = Math.floor(t /86400); 
                        let h = Math.floor(t / 3600)%24;
                        let m = Math.floor(t / 60)%60;
                        let s = t%60;
                        document.getElementById("time<?= $phase > 1 ? $phase : '' ?>").getElementsByClassName("vertical-align")[0].textContent = t>0?`Remaining time: ${d}d ${h}h ${m}m ${s}s`:"FINISHED!";
                        t--;

                    }
                    setInterval(wait, 1000);
                }
            }

            getRemainingTimeByPhase();
        </script>

        <!-- Upvote a language -->
        <script>
            function upvoteLang(n){
                const proposed = document.getElementById("phase2").getElementsByClassName("proposed_language")[n];
                let str = document.getElementsByClassName("header_proposed")[n].textContent;
                let b = window.getComputedStyle(proposed.getElementsByClassName("upvote")[0]).display == "block"; 
                
                console.log(b,window.getComputedStyle(document.getElementsByClassName("upvote")[0]).display )
                proposed.getElementsByClassName("upvote")[0].style.display = b?"none":"block";
                proposed.getElementsByClassName("upvote")[1].style.display = b?"block":"none";
                document.getElementsByClassName("textUpvote")[n].textContent = parseInt(document.getElementsByClassName("textUpvote")[n].textContent.split(" ")[0])+(b?1:-1)+" vote"+((parseInt(document.getElementsByClassName("textUpvote")[n].textContent.split(" ")[0])+(b?1:-1))==1?"":"s");
                
                
                const xhttp5 = new XMLHttpRequest();
                xhttp5.open("POST", "https://week.golf/upvoteLanguage.php", true);
                xhttp5.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp5.send(`t=${localStorage.token}&lang=${str}`);
            }
        </script>

        <!-- Get correct height for phase 3 -->
        <script>
            <?php
            if ($phase === 3) {
            ?>
            document.getElementById("phase3").style.height = 50+window.innerHeight+"px";
            <?php
            } else if ($phase === 4) {
            ?>
            document.getElementById("phase4").style.height = "auto";
            <?php
            }
            ?>
        </script>

        <!-- Get infos for phase 3 -->
        <script>
            const xhttp8 = new XMLHttpRequest();
            <?php
            if ($phase >= 3) {
            ?>
            const logged = localStorage.token != undefined;

            xhttp8.open("POST", "https://week.golf/getFinalePhase.php", true);
            xhttp8.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp8.send(!logged ? "" : `t=${localStorage.token}`);

            xhttp8.onload = function() {
                const rep = JSON.parse(xhttp8.responseText);
                const arr = [rep["arr1"],rep["arr2"]];


                <?php
                if ($phase == 3) {
                ?>

                  /////////////////
                 // PHASE 3
                ///////////////////
                const langName = document.getElementsByClassName("lang_name");
                const nbVote = document.getElementsByClassName("nb_vote");

                document.getElementById("phase3").style.background = `linear-gradient(90deg, ${(arr[0][0]!==null?arr[0][0]:"#333")} 50%, ${(arr[1][0]!==null)?arr[1][0]:"#333"} 50%)`;
                    
                document.getElementById("PartA").style.backgroundColor = (arr[0][0]!==null?arr[0][0]:"#333");
                document.getElementById("PartB").style.backgroundColor = (arr[1][0]!==null?arr[1][0]:"#333");
                
                let percentage = Number.isNaN(parseFloat(arr[0][2]) / (parseFloat(arr[0][2])+parseFloat(arr[1][2]))*100)? 50 : parseFloat(arr[0][2]) / (parseFloat(arr[0][2])+parseFloat(arr[1][2]))*100;
                document.getElementById("PartA").style.width = `${percentage}%`;
                document.getElementById("PartB").style.width = `${100 - percentage}%`;

                // If not logged, show `?` for percentage
                if (logged){
                    document.getElementById("PartA").innerHTML = `${(0 -  parseFloat(percentage).toFixed(2)) * -1}%`;
                    document.getElementById("PartB").innerHTML = `${100.00 - percentage.toFixed(2)}%`;
                } else {
                    document.getElementById("PartA").innerHTML = "?";
                    document.getElementById("PartB").innerHTML = "?";
                }

                for (let i = 0; i < 2 ;i++){
                    let img = new Image();

                    langName[i].textContent = arr[i][1];
                    nbVote[i].textContent = (logged ? arr[i][2] : "?")+" vote" + (parseInt(arr[i][2])==1?"":"s");

                    img.src = `img/${arr[i][1].replace("#","s").replace("><>","fish").toLowerCase()}_white.svg`;
                    img.onerror = function(){
                        document.getElementsByClassName("final_language")[i].src = `img/question.svg`;
                    }
                    img.onload = function(){
                        document.getElementsByClassName("final_language")[i].src = `img/${arr[i][1].replace("#","s").replace("><>","fish").toLowerCase()}_white.svg`;
                    }

                    const up = document.getElementsByClassName("finalUpvote")[i];
                    const b = arr[i][3] !== 1;
                    console.log("2 " +up.getAttribute('value'))
                    up.setAttribute('value',b?"notup":"up");
                    up.style.width = b? "100px":"150px";
                    up.style.marginLeft = b?"calc(50% - 50px)":"calc(50% - 75px)";
                    up.style.marginTop = b?"0px":"-30px"
                    up.style.filter = b?"drop-shadow(0px 0px 0px #FFF)":"drop-shadow(0px 0px 30px #FFF)";
                }

                <?php
                } else {
                ?>

                  /////////////////
                 // PHASE 4
                ///////////////////
                winner = [rep["arr1"],rep["arr2"]].sort(function(a, b) {return parseInt(b[2]) - parseInt(a[2]);})[0];

                document.getElementById("phase4").style.backgroundColor = winner[0];
                console.log(winner[0])
                 
                document.getElementById("PartC").style.backgroundColor = (arr[0][0]!==null?arr[0][0]:"#333");
                document.getElementById("PartD").style.backgroundColor = (arr[1][0]!==null?arr[1][0]:"#333");

                percentage = parseFloat(arr[0][2]) / (parseFloat(arr[0][2])+parseFloat(arr[1][2]))*100;
                document.getElementById("PartC").style.width = `${percentage}%`;
                document.getElementById("PartC").innerHTML = `${(0 -  parseFloat(percentage).toFixed(2)) * -1}%`;
                document.getElementById("PartD").style.width = `${100 - percentage}%`;
                document.getElementById("PartD").innerHTML = `${100.00 - percentage.toFixed(2)}%`;


                document.getElementById("win_text").textContent = `${winner[1]} won!`;
                document.getElementById("win_lang").src = `img/${winner[1].replace("#","s").replace("><>","fish").toLowerCase()}_white.svg`;
                document.getElementById("win_votes").textContent = `with ${winner[2]} votes!`;
                <?php
                }
                ?>
            }
            <?php
            }
            ?>
        </script>

        <?php
        if ($phase == 3) {
        ?>
        <!-- Final Upvote -->
        <script>
            function finalUpvote(n){
                const uptot = document.getElementsByClassName("finalUpvote");
                for (let i = 0; i < 2;i++){
                    if (uptot[i].getAttribute('value') === 'up' && i !== n ){
                        document.getElementsByClassName("nb_vote")[i].innerHTML = (parseInt(document.getElementsByClassName("nb_vote")[i].innerHTML.split()[0])-1+" vote")+((parseInt(document.getElementsByClassName("nb_vote")[i].innerHTML.split()[0])-1==1)?"":"s");
                        uptot[i].setAttribute('value',"notup");
                    }
                    uptot[i].style.width = "100px";
                    uptot[i].style.marginLeft = "calc(50% - 50px)";
                    uptot[i].style.marginTop = "0px";
                    uptot[i].style.filter = "drop-shadow(0px 0px 0px #FFF)";
                }

                const up = document.getElementsByClassName("finalUpvote")[n];
                const b = ""+up.getAttribute('value') != "notup";
                console.log(b, up.getAttribute('value'))
                up.setAttribute('value',b?"notup":"up");
                console.log("2 " +up.getAttribute('value'))
                up.style.width = b? "100px":"150px";
                up.style.marginLeft = b?"calc(50% - 50px)":"calc(50% - 75px)";
                up.style.marginTop = b?"0px":"-30px"
                up.style.filter = b?"drop-shadow(0px 0px 0px #FFF)":"drop-shadow(0px 0px 30px #FFF)";
                console.log(b)
                document.getElementsByClassName("nb_vote")[n].innerHTML = parseInt(document.getElementsByClassName("nb_vote")[n].innerHTML.split()[0])+(b?-1:1)+" vote"+((parseInt(document.getElementsByClassName("nb_vote")[n].innerHTML.split()[0])+(b?-1:1)==1)?"":"s");
                
                const percentage = Number.isNaN(parseFloat(document.getElementsByClassName("nb_vote")[0].innerHTML.split()[0]) / (parseFloat(document.getElementsByClassName("nb_vote")[0].innerHTML.split()[0])+parseFloat(document.getElementsByClassName("nb_vote")[1].innerHTML.split()[0]))*100)? 50: parseFloat(document.getElementsByClassName("nb_vote")[0].innerHTML.split()[0]) / (parseFloat(document.getElementsByClassName("nb_vote")[0].innerHTML.split()[0])+parseFloat(document.getElementsByClassName("nb_vote")[1].innerHTML.split()[0]))*100;
                
                console.log(percentage,percentage == NaN)
                document.getElementById("PartA").style.width = `${percentage}%`;
                document.getElementById("PartA").innerHTML = `${(0 -  parseFloat(percentage).toFixed(2)) * -1}%`;
                document.getElementById("PartB").style.width = `${100 - percentage}%`;
                document.getElementById("PartB").innerHTML = `${100 - percentage.toFixed(2)}%`;

                const xhttp7 = new XMLHttpRequest();
                xhttp7.open("POST", "https://week.golf/upvoteLanguageFinal.php", true);
                xhttp7.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp7.send(`t=${localStorage.token}&lang=${document.getElementsByClassName("lang_name")[n].textContent}`);
            }
        </script>

        
        <script>
            document.getElementById("phase3").style.height = document.body.scrollHeight + "px";
        </script>
        <?php
        }
        ?>

        <script>
            if (localStorage.token == "" || localStorage.token == null){
                document.getElementById("accountToVote").style.display = "block";

                const finalUpvote = document.getElementsByClassName("finalUpvote");

                for (let i = 0 ; i < finalUpvote.length; i++){
                    finalUpvote[i].onclick = "";
                }
            }
        </script>

    </body>
</html>
