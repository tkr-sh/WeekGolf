<?php

include_once "secret.php";

$authorizeURL = 'https://github.com/login/oauth/authorize';
$tokenURL = 'https://github.com/login/oauth/access_token';
$apiURLBase = 'https://api.github.com/';

session_start();

// Start the login process by sending the user to Github's authorization page
if(get('action') == 'login') {
    // Generate a random hash and store in the session for security
    $_SESSION['state'] = hash('sha256', microtime(TRUE).rand().$_SERVER['REMOTE_ADDR']);
    unset($_SESSION['access_token']);

    $params = array(
    'client_id' => OAUTH2_CLIENT_ID,
    'redirect_uri' => 'https://week.golf/loginWithGithub.php',
    'scope' => 'read:user, user:email',
    'state' => $_SESSION['state']
    );

    // Redirect the user to Github's authorization page
    header('Location: ' . $authorizeURL . '?' . http_build_query($params));
    die();
}

// When Github redirects the user back here, there will be a "code" and "state" parameter in the query string
if(get('code')) {
    // Verify the state matches our stored state
    if(!get('state') || $_SESSION['state'] != get('state')) {
        header('Location: ' . $_SERVER['PHP_SELF']);
        die();
    }

    // Exchange the auth code for a token
    $token = apiRequest($tokenURL, array(
        'client_id' => OAUTH2_CLIENT_ID,
        'client_secret' => OAUTH2_CLIENT_SECRET,
        'redirect_uri' => 'https://week.golf/loginWithGithub.php',
        'code' => get('code')
    ));

    
    $_SESSION['access_token_github'] = $token->access_token;
    $access_token =  $token->access_token;

}


if(session('access_token_github')) {
    $final_rep = apiRequest($apiURLBase . 'user', $post=NULL, $headers=array(), $final=true);

    if ($final_rep !== null && $final_rep) {

        // Connect to DataBase
        include_once "connectToDatabase.php";


        $final_rep = json_decode($final_rep);


        $email = verifyThatNotNull($final_rep->email);
        $email = $email == "" ? generateRandomString(64) : $email;
        $github_id = $final_rep->id;
        $username = $final_rep->login;
        $avatar = verifyThatNotNull($final_rep->avatar_url);
        $bio = verifyThatNotNull($final_rep->bio);


        $sql = "SELECT * FROM Users WHERE github_id = $github_id";
        $result = $conn->query($sql);


        if ($result->num_rows > 0){ // If already have an account
            $fetchAssoc = $result->fetch_assoc();
            $token = $fetchAssoc["token"];
            $user_id = $fetchAssoc["id"];

            header("Location: https://week.golf/stockToken.html?t=$token&id=$user_id");
            exit();
        } else { // Else create account

            // Create token
            $token;
            // Detect if a Token is already taken:
                do {
                    $token = generateRandomString(64);
                    $sql = "SELECT token FROM Users WHERE token = '$token'";
                    $unique_token = true;
                    
                    $result = $conn->query($sql);
                    $unique_token = $result->num_rows == 0;
                    
            } while (!$unique_token);
            
            // Create pwd
            $pwd = generateRandomString(32);


            $sql = "INSERT INTO Users (email, bio, pwd, pp, username, country, github, github_id, token, verified) 
            VALUES ( ?, ?, ?, ?, ?, 'XX', ?, ?, ?, 1 );";

            esql($sql, [$email, $bio, $pwd, $avatar, $username, $username, $github_id, $token], "ssssssss");


            $fetchAssoc = $conn->query("SELECT * FROM Users WHERE github_id = $github_id")->fetch_assoc();
            $token = $fetchAssoc["token"];
            $user_id = $fetchAssoc["id"];


            // Languages
            $sql = "INSERT INTO Languages (owner_id) VALUES($user_id)";
            $conn->query($sql);

            # Activity
            esql("INSERT INTO Activity (title, content, owner_id, activity_date)
                  VALUES(CONCAT(?, ' created an Account!'),'Happy to see you! Hope you will like Weekgolf!', $user_id, NOW())", [$username], "s");


            header("Location: https://week.golf/stockToken.html?t=$token&id=$user_id");

            exit();
            die();
        }
    }

} else {
    // Generate a random hash and store in the session for security
    $_SESSION['state'] = hash('sha256', microtime(TRUE).rand().$_SERVER['REMOTE_ADDR']);
    unset($_SESSION['access_token']);

    $params = array(
    'client_id' => OAUTH2_CLIENT_ID,
    'redirect_uri' => 'https://week.golf/loginWithGithub.php',
    'scope' => 'user',
    'state' => $_SESSION['state']
    );

    // Redirect the user to Github's authorization page
    header('Location: ' . $authorizeURL . '?' . http_build_query($params));
    die();
}


function apiRequest($url, $post=NULL, $headers=array(), $final=false) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

    if($post)
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));

    $headers[] = 'Accept: application/json';

    if ($final){
        $headers[] = 'Authorization: Bearer ' . session('access_token_github');
        $headers[] = 'User-Agent: WeeKGolf';
    }


    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    // Curl SSL
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);

    if ($final){
        return $response;
    }

    return json_decode($response);
}

function get($key, $default=NULL) {
  return array_key_exists($key, $_GET) ? $_GET[$key] : $default;
}

function session($key, $default=NULL) {
  return array_key_exists($key, $_SESSION) ? $_SESSION[$key] : $default;
}

function generateRandomString($length) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function verifyThatNotNull($str){
    if ($str == null){
        return "";
    } else {
        return $str;
    }
}
?>