<?php

// oAuth2 of discord
session_start();
$token = $_SESSION["token"]; // GET BACK THE TOKEN


$discord_code = $_GET["code"];

if (!isset($discord_code) || !isset($token)) {
    echo "No code or invalid token.";
    exit();
}

include_once "secret.php";

$payload = [
    "code" => $discord_code,
    "client_id" => "968576109060968529",
    "client_secret" => $client_secret,
    "grant_type" => "authorization_code",
    "redirect_uri" => "https://week.golf/discord.php",
    "scope" => "identify%20guilds"
];

$discord_token_url = "https://discordapp.com/api/oauth2/token";


// Sending Curl request for access_token
$ch = curl_init();

// Curl option
curl_setopt($ch, CURLOPT_URL, $discord_token_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($payload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Curl SSL
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// Result
$result = curl_exec($ch);
if (!$result) echo curl_error($ch);
$access_token =  json_decode($result, true)["access_token"];




$discord_token_url = "https://discordapp.com/api/users/@me";
$header = array("Authorization: Bearer $access_token", "Content-Type: application/x-www-form-urlencoded"); 

// Sending Curl request for access_token
$ch = curl_init();

// Curl option
curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
curl_setopt($ch, CURLOPT_URL, $discord_token_url);
curl_setopt($ch, CURLOPT_POST, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Curl SSL
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// Result
$result = curl_exec($ch);

if (!$result){
    echo curl_error($ch);
}

$result_json =  json_decode($result, true);

if (isset($result_json)){

    // Connecting to DataBase
    include_once "connectToDatabase.php";


    $discord_id = $result_json["id"];
    $discord = $result_json["username"] . "#" .$result_json["discriminator"];



    $result = rsql("SELECT * FROM Users WHERE discord = ? OR discord_id = ?;", [$discord, $discord_id], "ss");

    // Add discord to user
    if ($result->num_rows == 0){
        esql("UPDATE Users SET discord = ?, discord_id = ?, discord_date = DATE(NOW()) WHERE token = ?", [$discord, $discord_id, $token], "sss");
    }

    header("Location: https://week.golf/profile.php");
}


exit;
die;