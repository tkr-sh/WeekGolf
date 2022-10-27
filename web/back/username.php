<?php

// Entry: username, token
// Purpose: Change username of a user
// Output: If the username is correct or not

$username = urldecode($_POST["username"]);
$token    = $_POST['t'];
$rep      = new stdClass();


if (isset($username) && isset($token) && strlen($username) < 25 && strlen($username) > 2) {
    
    // Connect to Database
    include_once "connectToDatabase.php";

    $result = rsql("SELECT UNIX_TIMESTAMP(NOW()) - username_date FROM Users WHERE token = ?", [$token], "s");

    if ($result -> num_rows > 0) {
        $time = intval($result -> fetch_assoc()["UNIX_TIMESTAMP(NOW()) - username_date"]);
        if ($time < 86400) {
            try {
                $result = rsql("SELECT * FROM Users WHERE username = ?", [$username], "s");
                if ($result -> num_rows == 0) {
                    esql("UPDATE Users SET username = ?, username_date = UNIX_TIMESTAMP(NOW()) WHERE token = ? AND (UNIX_TIMESTAMP(NOW()) - username_date > 86400 OR username_date IS NULL);", [$username, $token], "ss");
                    $rep->message = "Username updated Successfuly!";
                    $rep->error   = "";
                } else {
                    $rep->message = "ERROR.";
                    $rep->error   = "Username already taken";
                }
            } catch (Exception $e) {
                $rep->message = "ERROR.";
                $rep->error   = "An error has occurred. Feel free to contact the creator of WeekGolf on discord or by e-mail at admin@week.golf";
            }
        } else {
            $rep->message = "ERROR.";
            $rep->error   = "You can change your username every 24h. ".floor($time / 3600)." : ".(floor($time / 60) % 60)." : ".($time % 60)." remaining";
        }
    } else {
        $rep->message = "ERROR.";
        $rep->error   = "No user with that token";
    }
} else {
    $rep->message = "ERROR";
    $rep->error   = "Username doesn't have the good length";
}

// Send the JSON
$JSON = json_encode($rep);

echo $JSON;

exit;
die;
