<?php

include_once "secret.php";

$authorizeURL = 'https://stackoverflow.com/oauth';
$tokenURL = 'https://stackoverflow.com/oauth/access_token';
$apiURLBase = 'https://api.stackexchange.com/2.3/me';



session_start();

$_SESSION["depth"] = 0;

// Start the login process by sending the user to Github's authorization page
if (get('action') == 'login') {
    // Generate a random hash and store in the session for security
    $_SESSION['state'] = hash('sha256', microtime(TRUE).rand().$_SERVER['REMOTE_ADDR']);
    unset($_SESSION['access_token']);

    $params = array(
    'client_id' => OAUTH2_CLIENT_ID_STACK,
    'key' => OAUTH2_CLIENT_KEY_STACK,
    'redirect_uri' => 'https://week.golf/loginWithStack.php',
    'scope' => 'private_info',
    'state' => $_SESSION['state']
    );

    // Redirect the user to Github's authorization page
    header('Location: ' . $authorizeURL . '?' . http_build_query($params));
    die();
}


if(get('code')) {
    // Verify the state matches our stored state
    if(!get('state') || $_SESSION['state'] != get('state')) {
        header('Location: ' . $_SERVER['PHP_SELF']);
        die();
    }

    // Exchange the auth code for a token
    $token = apiRequest($tokenURL, $post=array(
        'client_id' => OAUTH2_CLIENT_ID_STACK,
        'client_secret' => OAUTH2_CLIENT_SECRET_STACK,
        'key' => OAUTH2_CLIENT_KEY_STACK,
        'redirect_uri' => 'https://week.golf/loginWithStack.php',
        'code' => get('code')
    ));

    $access_token = explode("=",explode("&",$token)[0])[1];

    if (isset($access_token) && $access_token != ""){
        $_SESSION['access_token'] = $access_token;
    }
}



if(session('access_token')) {
    

    $_SESSION["depth"] += 1;
    if ($_SESSION["depth"] > 3){
        echo 'Depth problem';
        die;
        exit;
    }

    $params = array(
        'key' => OAUTH2_CLIENT_KEY_STACK,
        'site' => "stackoverflow",
        'order' =>  'desc',
        'sort' => 'reputation',
        'access_token' => $_SESSION["access_token"]
    );

    unset($_SESSION['access_token']);

    $final_rep = gzdecode(file_get_contents($apiURLBase . '?'. http_build_query($params)));


    $final_rep = str_replace("\n","",$final_rep);
    $json = json_decode($final_rep);


    if (isset($json) && $json !== NULL){

        include_once "connectToDatabase.php";

        $json = $json -> items [0];

        $stack_id = $json->account_id;
        $username = substr($json->display_name, 0, 24);
        $pp = verifyThatNotNull($json->profile_image);
        $email = generateRandomString(64)."NOADRESS";


        $sql = "SELECT * FROM Users WHERE stack_id = '$stack_id';";
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


            $result = rsql("SELECT id FROM Users WHERE username = ?", [$username], "s");
            if ($result -> num_rows > 0){
                do {
                    $username = substr($username, 0, min(strlen($username),20)) . generateRandomString(4);
                    $new_result = rsql("SELECT id FROM Users WHERE username = ?", [$username], "s");
                } while ( $new_result->num_rows > 0 );
            }

            if (strlen($pp) > 64){
                $pp = "NULL";
            }


            rsql("INSERT INTO Users (email, bio, pwd, pp, username, country, stack, stack_id ,token, verified) 
            VALUES ( ?, '', ?, ?, ?, 'XX', ?, ?, ?, 1 );", [$email, $pwd, $pp, $username, $username, $stack_id, $token], "sssssis");


            $conn->query("UPDATE Users SET pp = NULL WHERE pp = 'NULL'");
            $sql = "SELECT * FROM Users WHERE stack_id = $stack_id";
            $result = $conn->query($sql);
            $fetchAssoc = $result->fetch_assoc();
            $token = $fetchAssoc["token"];
            $user_id = $fetchAssoc["id"];


            // Languages
            $sql = "INSERT INTO Languages (owner_id) VALUES($user_id)";
            $conn->query($sql);

            // Activity
            esql("INSERT INTO Activity (title, content, owner_id, activity_date)
                  VALUES(CONCAT(?, ' created an Account!'),'Happy to see you! Hope you will like Weekgolf!', $user_id, NOW())", [$username], "s");


            session_destroy();

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
    'client_id' => OAUTH2_CLIENT_ID_STACK,
    'key' => OAUTH2_CLIENT_KEY_STACK,
    'redirect_uri' => 'https://week.golf/loginWithStack.php',
    'scope' => 'private_info',
    'state' => $_SESSION['state']
    );

    // Redirect the user to Github's authorization page
    header('Location: ' . $authorizeURL . '?' . http_build_query($params));
    die();
}


function apiRequest($url, $post=NULL, $headers=array(), $final=false) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

    if($post){
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
    }

    $headers[] = 'Accept: application/json';
    $headers[] = 'Accept-Encoding: UTF-8';
    $headers[] = 'Content-Encoding: UTF-8';
    $headers[] = 'User-Agent: WeekGolf';


    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    # Curl SSL
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);

    return $response;
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
        return "NULL";
    } else {
        return $str;
    }
}
?>