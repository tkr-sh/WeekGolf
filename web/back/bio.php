<?php

// Entry: token, bio
// Purpose: Change the bio of the user by token
// Output: "Updated" if no problems

$token = $_POST['t'];
$bio   = urldecode($_POST["bio"]);

$rep = new stdClass();


if (isset($bio) && strlen($bio) < 1024 && isset($token)) {
    
    // Connecting to DataBase
    include_once "connectToDatabase.php";

    // Update bio
    try {
        esql("UPDATE Users SET bio = ? WHERE token = ?;", [$bio, $token], "ss");
        $rep->message = "Bio updated Successfuly!";
        $rep->error   = "";
    } catch (Exception) {
        $rep->message = "ERROR.";
        $rep->error   = "An error has occurred. Feel free to contact the creator of WeekGolf on discord or by e-mail at admin@week.golf";
    }
} else {
    $rep->message = "ERROR.";
    $rep->error   = "Bio is too long";
}

// Send the JSON
$JSON = json_encode($rep);

echo $JSON;


exit;
die;
