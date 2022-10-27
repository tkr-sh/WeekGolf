<?php

// Entry: email, token
// Purpose: Change the e-mail of an user
// Output: If the mail has been changed

$email = urldecode($_POST["email"]);
$token = $_POST['t'];
$rep   = new stdClass();


if (isset($email) && isset($token) && strlen($email) < 321 && strlen($email) > 2) {

    // Connect to DataBase
    include_once "connectToDatabase.php";

    $result = rsql("SELECT UNIX_TIMESTAMP(NOW()) - email_date FROM Users WHERE token = ?", [$token], "s");

    if ($result -> num_rows > 0) {
        $time = intval($result -> fetch_assoc()["UNIX_TIMESTAMP(NOW()) - email_date"]);
        if ($time < 86400) {
            try {
                $result = rsql("SELECT * FROM Users WHERE email = ?", [$email], "s");
                if ($result -> num_rows == 0) {
                    esql("UPDATE Users SET email = ?, email_date = UNIX_TIMESTAMP(NOW()) WHERE token = ? AND (UNIX_TIMESTAMP(NOW()) - email_date > 86400 OR email_date IS NULL);", [$email, $token], "ss");
                    $rep->message = "E-mail updated Successfuly!";
                    $rep->error   = "";
                } else {
                    $rep->message = "ERROR.";
                    $rep->error   = "E-mail already taken";
                }
            } catch (Exception $e) {
                $rep->message = "ERROR.";
                $rep->error   = "An error has occurred. Feel free to contact the creator of WeekGolf on discord or by e-mail at admin@week.golf";
            }
        } else {
            $rep->message = "ERROR.";
            $rep->error   = "You can change your email every 24h. ".floor($time / 3600)." : ".(floor($time / 60) % 60)." : ".($time % 60)." remaining";
        }
    } else {
        $rep->message = "ERROR.";
        $rep->error   = "No user with that token";
    }//end if
} else {
    $rep->message = "ERROR";
    $rep->error   = "E-mail doesn't have the good length";
}//end if

// Send the JSON
$JSON = json_encode($rep);

echo $JSON;

exit;
die;
