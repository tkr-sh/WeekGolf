<?php

// Entry: dev_code, title, parameters
// Purpose: Send the Webhook
// Output: If sent or there is an error

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    include_once "secret.php";

    $dev_code = $_POST["dev_code"];
    $title = $_POST["title"];
    $params = $_POST["params"];
    $upgrade = intval($_POST["upgrade"]);

    if (isset($dev_code) && $dev_code == DEV_CODE && isset($title) && isset($params) && isset($upgrade)) {

        // Connect to Database
        include_once "connectToDatabase.php";

        $lang = str_replace("#", "s", $params["lang"]);

        $color = '#33DD33';
        $result = rsql("SELECT * FROM ColorLang WHERE lang = ?", [$lang], "s");
        if ($result -> num_rows > 0){
            while ($row = $result -> fetch_assoc()){
                $color = $row["color"];
            }
        }

        $webhook = $upgrade == 1 ? $webhook_url_up : $webhook_url; 

        function discordmsg($msg, $webhook) {
            if ($webhook != "") {
                $ch = curl_init( $webhook );

                curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
                curl_setopt( $ch, CURLOPT_POST, 1);
                curl_setopt( $ch, CURLOPT_POSTFIELDS, $msg);
                curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
                curl_setopt( $ch, CURLOPT_HEADER, 0);
                curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
    
                curl_exec( $ch );
                curl_close( $ch );
            }
        }
    
        // URL FROM DISCORD WEBHOOK SETUP
        $timestamp = date("c", strtotime("now"));
        $msg = json_encode([
        
            // Username
            "username" => "WeekGolf",

            // text-to-speech
            "tts" => false,
            "embeds" => [
                [
                    // Title
                    "title" =>  $title,
        
                    // Embed Type, do not change.
                    "type" => "rich",
        
                    // Timestamp, only ISO8601
                    "timestamp" => $timestamp,
        
                    // Left border color, in HEX
                    "color" => hexdec( $color ),

                    "thumbnail" => [
                       "url" => "https://week.golf/img/". str_replace("c#", "cs", strtolower($params["lang"])) .".png"
                    ],

                    "fields" => [
                        [
                            "name" => "Problem",
                            "value" => $params["problem_name"],
                            "inline" => false
                        ],
                        [
                            "name" => "Previous size",
                            "value" => $params["before_size"],
                            "inline" => true
                        ],
                        [
                            "name" => "New size",
                            "value" => $params["new_size"],
                            "inline" => true
                        ],
                        [
                            "name" => "Difference",
                            "value" => $params["diff"],
                            "inline" => true
                        ],
                        [
                            "name" => "Previous author",
                            "value" => $params["before_username"],
                            "inline" => true
                        ],
                        [
                            "name" => "New author",
                            "value" => $params["username"],
                            "inline" => true
                        ],
                        [
                            "name" => "Language",
                            "value" => ucfirst($params["lang"]),
                            "inline" => true
                        ]
                        
                    ]
        
                ]
            ]
        
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
    
        discordmsg($msg, $webhook); // SENDS MESSAGE TO DISCORD
        echo "Sent";
    }
    else {
        echo "Invalid parameters.";
    }
} else {
    echo "Invalid type of request";
}


exit;