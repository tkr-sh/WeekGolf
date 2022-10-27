<?php

// Entry: password, token
// Purpose: Change the password
// Output: If the password was changed

$pwd   = urldecode($_POST["pwd"]);
$token = $_POST['t'];
$rep   = new stdClass();


if (isset($pwd) && isset($token) && strlen($pwd) < 33 && strlen($pwd) > 5) {

    include_once "connectToDatabase.php";  // Connect to Database
    include_once "secret.php";

    // Encrypting the password

    $result = rsql("SELECT UNIX_TIMESTAMP(NOW()) - pwd_date FROM Users WHERE token = ?", [$token], "s");

    if ($result -> num_rows > 0) {
        $time = intval($result -> fetch_assoc()["UNIX_TIMESTAMP(NOW()) - pwd_date"]);
        if ($time < 86400) {
            try {
                esql("UPDATE Users SET pwd = ?, pwd_date = UNIX_TIMESTAMP(NOW()) WHERE token = ? AND (UNIX_TIMESTAMP(NOW()) - pwd_date > 86400 OR pwd_date IS NULL);", [$pwd, $token], "ss");
                $rep->message = "Password updated Successfuly!";
                $rep->error   = "";
            } catch (Exception $e) {
                $rep->message = "ERROR.";
                $rep->error   = "An error has occurred. Feel free to contact the creator of WeekGolf on discord or by e-mail at admin@week.golf";
            }
        } else {
            $rep->message = "ERROR.";
            $rep->error   = "You can change your password every 24h. ".floor($time / 3600)." : ".(floor($time / 60) % 60)." : ".($time % 60)." remaining";
        }
    } else {
        $rep->message = "ERROR.";
        $rep->error   = "No user with that token";
    }
} else {
    $rep->message = "ERROR";
    $rep->error   = "Password doesn't have the good length";
}

// Send the JSON
$JSON = json_encode($rep);

echo $JSON;

exit;
die;
