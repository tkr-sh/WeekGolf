<?php

// Entry: username, email, pwd, country, recaptcha
// Purpose: Redirect user for mail
// Output: A header location OR an error

require_once "secret.php";

$username = $_POST['username'];
$email    = $_POST['email'];
$pwd      = $_POST['pwd'];
$country  = $_POST['country'];
$captcha  = $_POST['g-recaptcha-response'];
$code     = generateRandomString(6);

if (strlen($country) !== 2) {
    $country = "XX";
}



if (isset($username) && isset($email) && isset($pwd) && isset($captcha)) {


    $ip           = $_SERVER['REMOTE_ADDR'];
    $url          = 'https://www.google.com/recaptcha/api/siteverify?secret='.urlencode(CLIENT_SECRET).'&response='.urlencode($captcha);
    $response     = file_get_contents($url);
    $responseKeys = json_decode($response, true);

    // If valid recaptcha
    if ($responseKeys["success"]) {
        include_once "connectToDatabase.php";


        function verifyNotTaken($table, $atr, $val) {
            $result = rsql("SELECT $atr FROM $table WHERE $atr = ?;", [$val], "s");
            if ($result -> num_rows > 0) {
                header("Location: https://week.golf/createAccount.html?err=".ucfirst($atr)."+already+taken");
                exit;
            }
        }

        // If username is already taken.
        verifyNotTaken("Users", "username", $username);
        verifyNotTaken("TempUser", "username", $username);

        // If Email is already taken.
        verifyNotTaken("Users", "email", $email);
        verifyNotTaken("TempUser", "email", $email);

        if (strlen($pwd) > 32 || strlen($pwd) < 6) {
            header("Location: https://week.golf/createAccount.html?err=Password+should+be+in+%5B6%3B32%5D");
            exit;
        }

        if (strlen($username) > 24 || strlen($username) < 3) {
            header("Location: https://week.golf/createAccount.html?err=Username+should+be+in+%5B3%3B24%5D");
            exit;
        }

        if (strlen($email) > 321 || strlen($email) < 3) {
            header("Location: https://week.golf/createAccount.html?err=Email+should+be+in+%5B3%3B320%5D");
            exit;
        }

        // Encrypting the password //

        if (isset($country) && strlen($country) == 2) {
            esql("INSERT INTO TempUser (code, email, pwd, username, country, created) VALUES (?, ?, ?, ?, ?, NOW());", [$code, $email, $pwd, $username, $country], "sssss");
        } else {
            esql("INSERT INTO TempUser (code, email, pwd, username, created) VALUES (?, ?, ?, ?, NOW());", [$code, $email, $pwd, $username], "ssss");
        }


        // Sending the e-mail
        file_get_contents("https://smtp.week.golf/?email=$email&code=$code");

        header("Location: https://week.golf/emailCode.html?email=$email");
    } else {
        header("Location: https://week.golf/createAccount.html?err=Invalid+ReCaptcha");
    }
} else if (!$captcha) {
    header("Location: https://week.golf/createAccount.html?err=Fill+the+captcha");
}


// Create a Random string
function generateRandomString($length) {

    $characters       = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString     = '';

    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, ($charactersLength - 1))];
    }

    return $randomString;
}

exit;
die;
