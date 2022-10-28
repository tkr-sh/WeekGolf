<!DOCTYPE html>
<html lang="en" style="height: 100%">
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
        <link href="translation.css" rel="stylesheet" type="text/css" />

        <!-- Header Boucing -->
        <script src="header.js"></script>

        <!-- Scroll to Top -->
        <script src="scrolltop.js"></script>

        <!--Langage Support -->
        <meta charset="UTF-8">
    </head>
    <body style="height: 100%">     

  
        <!-- Header -->
        <?php
        include_once "header.html";
        ?>

        <!-- Main -->
        <main style="min-height: calc(100% - 350px); width: 100%; overflow-x: scroll;">
            <table id="translation">
                <?php
                $i = 0;
                $json = json_decode(file_get_contents("translation.json"));
                echo "<tr>";
                foreach($json as $key =>$elem) { //foreach element in $arr
                    if ($i == 0){
                        echo "<th>$key</th>";
                        foreach($elem as $key => $value) {
                            echo "<th>$value</th>";
                        }
                    } else {
                        echo "<td class='no_code'>$key</td>";
                        foreach($elem as $key => $value) {

                            # If boolean
                            if (is_bool($value)){
                                if (!$value)
                                    echo "<td style='background-color: #c33'></td>";
                                else
                                    echo "<td style='background-color: #3a3'></td>";
                            } else {
                                $value = str_replace(["<", ">"], ["&lt;", "&gt;"], $value);

                                if (!$value)
                                    echo "<td style='background-color: #c3c'>$value</td>";
                                else
                                    echo "<td>$value</td>";
                            }
                        } 
                    }
                    echo "</tr><tr>";
                    $i++;
                }
                echo "</tr>";
                ?>
            </table>
        </main>


       
        <!-- Footer -->
        <?php
        include_once "footer.html";
        ?>


        <script defer>
            document.getElementsByTagName("tr")[1].style.position = "sticky";
            document.getElementsByTagName("tr")[1].style.top = "0px";
            document.getElementsByTagName("tr")[1].style.zIndex = "999";
            let no_code = document.getElementsByClassName("no_code");

            function responsive(e) {
                const scrollY = window.scrollY;
                const scrollX = document.getElementsByTagName("main")[0].scrollLeft;

                if (scrollY < 70){
                    document.getElementsByTagName("tr")[1].style.top = "0px";
                } else {
                    document.getElementsByTagName("tr")[1].style.top = scrollY - 70 + "px";
                }

                if (scrollX < 10){
                    for (let i = 0; i < no_code.length; i++){
                        no_code[i].style.position = "relative";
                    }
                } else {
                    for (let i = 0; i < no_code.length; i++){
                        no_code[i].style.position = "sticky";
                    }
                }
            }


            window.addEventListener('scroll', responsive);
            document.getElementsByTagName("main")[0].addEventListener('scroll', responsive);
        </script>

    </body>
</html>