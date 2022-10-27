<?php


// TOKEN
/////////


// Connecting to DataBase
include_once "connectToDatabase.php";
include_once "secret.php";

session_start();

function generateRandomString($length) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

$token;
// Detect if a Token is already taken:
do {
    $token = generateRandomString(64);
    $sql = "SELECT token FROM Users WHERE token = '$token'";
    $unique_token = true;
    
    $result = $conn->query($sql);
    $unique_token = $result->num_rows == 0;
        
} while (!$unique_token);
    
$_SESSION["token"] = $token;





$discord_code = $_GET["code"];

if (!isset($discord_code)){
    echo "No code or invalid token.";
    exit();
}


$payload = [
    "code" => $discord_code,
    "client_id" => "968576109060968529",
    "client_secret" => $client_secret,
    "grant_type" => "authorization_code",
    "redirect_uri" => "https://week.golf/loginWithDiscordProcess.php",
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
$result =curl_exec($ch);

if (!$result) 
    echo curl_error($ch);

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

if (!$result)
    echo curl_error($ch);

$result_json =  json_decode($result, true);




if (isset($result_json)){

    
    // Get the informations
    $pwd = generateRandomString(32);
    $username = $result_json["username"];
    $country = $result_json["locale"];
    $email = $result_json["email"];
    $id = $result_json["id"];
    $discriminator = $result_json["discriminator"];


    // SQL
    $result = $conn -> query("SELECT token, id FROM Users WHERE discord_id = $id;");

    // If there is already a user with that discord id
    if ($result -> num_rows > 0){
        while($row = $result->fetch_assoc()) {
            $token = $row["token"];
            $user_id = $row["id"];
        }

        header("Location: https://week.golf/stockToken.html?t=$token&id=$user_id");
        exit();
    }


    // Users
    $sql = "INSERT INTO Users (email, bio, pwd, username, country, github, discord, discord_id, token, verified) 
            VALUES ( ?, '', ?, ?, ?, NULL, ?, ?, ?, 1 );";
    esql($sql, [$email, $pwd, substr($username,0,24), $country, "$username#$discriminator", $id, $token], "sssssis");



    // SQL
    $result = $conn -> query("SELECT token, id FROM Users WHERE discord_id = $id;");

    if ($result -> num_rows > 0 ){
        while($row = $result->fetch_assoc()) {
            $token = $row["token"];
            $user_id = $row["id"];
        }
    }
    

    // Languages
    $sql = "INSERT INTO Languages (owner_id) VALUES($user_id)";
    $conn->query($sql);

    // Activity
    esql("INSERT INTO Activity (title, content, owner_id, activity_date)
          VALUES(CONCAT(?, ' created an Account!'),'Happy to see you! Hope you will like Weekgolf!', $user_id, NOW())", [$username], "s");

    // Redirect to a place where they can stock their token
    header("Location: https://week.golf/stockToken.html?t=$token&id=$user_id");
}

exit();
?>