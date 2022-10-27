<?php

// Entry: token
// Purpose: Get the PFP of a person by it's Token
// Output: The pp url

$token = $_POST["t"];

if (isset($token)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";

    $result = rsql("SELECT pp FROM Users WHERE token = ?;", [$token], "s");

    $rep = new stdClass();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $pfp = $row["pp"];
        }
        $rep->pfp    = $pfp;
        $rep->error = "";
    } else {
        $rep->id    = "";
        $rep->error = "No user with that token";
    }

    $JSON = json_encode($rep);
    echo $JSON;
}

exit;
die;
