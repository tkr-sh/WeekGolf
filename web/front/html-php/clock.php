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
        <link href="profile.css" rel="stylesheet" type="text/css" />

        <!-- Embed HTML -->
        <script src="lib/csi.js"></script>

        <!-- Header Boucing -->
        <script src="header.js"></script>

        <!-- Scroll to Top -->
        <script src="scrolltop.js"></script>


        <style>
            .date_activity{
                margin-top: -5px;
            }

            .content_activity{
                height: auto;
                padding-bottom: 10px;
            }
        </style>
    </head>
    <body>     

  
        <!-- Header -->
        <?php
            include_once "header.html";
        ?>

        <div id = "filter_activity">
            Filters
            <section id="content_filter_activity">
                <div class="div_filter_activity" onclick="changeActivity(0)">
                    <div class="vertical-align">
                        New personal score 
                    </div>
                </div>
                <div class="div_filter_activity"  onclick="changeActivity(1)">
                    <div class="vertical-align">
                        Points
                    </div>
                </div>
                <div class="div_filter_activity" style="margin-right: 0Px"  onclick="changeActivity(2)">
                    <div class="vertical-align">
                        New best score
                    </div>
                </div>
            </section>
        </div>
       

       <section id="last_activity"><title id="activity_title">Latest activity</title>

            <?php
                error_reporting(E_ERROR | E_PARSE);

                // Connecting to DataBase
                include_once "connectToDatabase.php";

                // Get String between $start and $end
                function get_string_between($string, $start, $end){
                    $string = ' ' . $string;
                    $ini = strpos($string, $start);
                    if ($ini == 0) return '';
                    $ini += strlen($start);
                    $len = strpos($string, $end, $ini) - $ini;

                    return substr($string, $ini, $len);
                }

                $color_arr = array();
                $sql = "SELECT * FROM ColorLang";
                $i = 0;
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        $color_arr[$i] = array($row["lang"], $row["color"]);
                        $i++;
                    }
                }

                $sql = "SELECT UNIX_TIMESTAMP(activity_date), activity_date, id, title, content, major, owner_id FROM Activity ORDER BY activity_date DESC LIMIT 1000";
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        $bool = intval($row["major"]) === 2;
                        $bool_bis = intval($row["major"]) === 1;
                        if ($bool){
                            $j = 0;
                            $temp_s = get_string_between($row["title"], '[', ']');
                            $temp_s = str_replace("#", "s", $temp_s);
                            for( ; $color_arr[$j][0] !== strtolower($temp_s) && $j < 1000; $j++);
                        }

            ?>
                <a href="https://week.golf/profile.php?id=<?= $row["owner_id"]?>" value="<?=$row["major"]?>">
                    <article class="content_activity" gmt="<?= $row["UNIX_TIMESTAMP(activity_date)"] ?>">
                        <div class="header_activity" <?=$bool?"style='background-color: ".$color_arr[$j][1]."'": ""?>   <?=($bool_bis?"style=' background-image: linear-gradient(#333 0%, #343 40%,#353 60%, #383 80%, #3c3 100% );'": "")?>>
                            <div class="the_title">
                                <?php
                                    if ($bool){
                                        echo "<img src='img/".strtolower($temp_s)."_white.svg' style='margin-bottom: -5px; width: 30px'>";
                                    }
                                ?>
                                <?= $row["title"] ?>
                            </div>
                            <div class="date_activity"> <?= $row["activity_date"] ?></div>
                        </div>
                        <div class="main_activity" style="font-size: 20px">
                            <?= $row["content"] ?>
                        </div>
                    </article>
                </a>

            <?php
                    }
                }
            ?>
       </section>
        
        <div style="height:100px; background: rgb(126, 11, 119, 0)"></div>
        
        <div class="uwuwu" id="uwuwu"></div>


        <!-- Footer -->
        <?php
            include_once "footer.html";
        ?>



        <script>
            let global_arr = [true, true, true];

            function changeActivity(n){
                const div_filter_activity = document.getElementsByClassName("div_filter_activity");

                if (global_arr[n]){
                    div_filter_activity[n].style.backgroundImage = "linear-gradient(#555,#222)";
                    div_filter_activity[n].style.border = "7px solid #222";
                } else {
                    div_filter_activity[n].style.backgroundImage = "linear-gradient(#3d3,#1a1)";
                    div_filter_activity[n].style.border = " 7px solid #181";
                }

                global_arr[n] = !global_arr[n];
                
                let a = document.getElementById("last_activity").getElementsByTagName("a");
                console.log(a.length)
                for (let i = 0; i < a.length; i++){
                    a[i].style.display = global_arr[parseInt(a[i].getAttribute("value"))]?"block":"none";
                }

                footer();
            }
        </script>

        <script>
            const content_activity = document.getElementsByClassName("content_activity");
            const timeZoneOffset = new Date().getTimezoneOffset() * 60;
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


            function changeDate(n){
                const GMT = parseInt(content_activity[n].getAttribute("gmt"));
                const time = GMT + timeZoneOffset;
                let stringDate = "" + new Date(GMT * 1000);
                stringDate = stringDate.split` `.slice(1, 5)
                stringDate = `${stringDate[2]}-${ parseInt(1 + months.indexOf(stringDate[0])).toString().padStart(2, '0')}-${stringDate[1]} ${stringDate[3]}`
                document.getElementsByClassName("date_activity")[n].innerHTML = stringDate;
            }


            for (let i = 0; content_activity.length; i++){
                try {
                    changeDate(i);
                } catch {
                    break;
                }
            }
        </script>


        <script>
            function getNewActivity(){

                // Get the New Activity every 30 s //

                const xhttp = new XMLHttpRequest();

                xhttp.open("POST", "https://week.golf/updateActivity.php", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send();

                xhttp.onload = function() {
                    const rep = JSON.parse(xhttp.responseText);

                    const owner_id = rep["owner_id"];
                    const title = rep["title"];
                    const content = rep["content"];
                    const major = rep["major"];
                    const activity_date = rep["activity_date"];
                    const unix_timestamp = rep["unix_timestamp"];
                    <?php
                        $only_color = [];
                        $only_lang = [];
                        foreach($color_arr as $elem){
                            $only_color[] = $elem[1];
                            $only_lang[] = $elem[0];
                        }
                    ?>
                    const color_arr = [<?= "'" . join("','", $only_color) . "'" ?>];
                    const lang_arr = [<?= "'" . join("','", $only_lang) . "'" ?>];
                    let textContent = '<title id="activity_title">Latest activity</title>\n';
                    let tempLang = "";
                    let img = "";

                    
                    for (let i = 0; i < owner_id.length; i++){
                        bool = parseInt(major[i]) === 2;
                        if (bool){
                            tempLang = title[i].substring(title[i].indexOf("[") + 1, title[i].indexOf("]"));
                            img = "<img src='img/"+tempLang.replace("#","s").toLowerCase()+"_white.svg' style='margin-bottom: -5px; width: 30px'>"
                        } else {
                            img = "";
                        }
                        bool_bis = parseInt(major[i]) === 1;
                        textContent += `
                        <a href="https://week.golf/profile.php?id=${owner_id[i]}" value="${major[i]}">
                            <div class="content_activity" gmt="${unix_timestamp[i]}">
                                <div class="header_activity" ${bool?"style='background-color: "+color_arr[lang_arr.indexOf(tempLang.toLowerCase())]+"'": ""}   ${bool_bis ? "style=' background-image: linear-gradient(#333 0%, #343 40%,#353 60%, #383 80%, #3c3 100% );'": ""}>
                                    <div class="the_title">
                                        ${img}
                                        ${title[i]}
                                    </div>
                                    <div class="date_activity">${activity_date[i]}</div>
                                </div>
                                <div class="main_activity" style="font-size: 20px">
                                   ${content[i]}
                                </div>
                            </div>
                        </a>`
                    }
                    console.log(document.getElementById("last_activity").innerHTML.split("\n")[0])
                    document.getElementById("last_activity").innerHTML = textContent + document.getElementById("last_activity").innerHTML.split("\n").slice(1).join("\n");
                    
                    for (let i = 0; i < owner_id.length; i++){
                        changeDate(i);
                    }
                }
            }

            setInterval(getNewActivity, 30000);
        </script>
    </body>
</html>