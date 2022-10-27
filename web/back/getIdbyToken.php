<?php

// Entry: token
// Purpose: Get the id of this person
// Output: The id

$token = $_POST["t"];

if (isset($token)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";

    $result = rsql("SELECT id FROM Users WHERE token = ?;", [$token], "s");

    $rep = new stdClass();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $id = $row["id"];
        }
        $rep->id    = $id;
        $rep->error = "";
    } else {
        $rep->id    = "";
        $rep->error = "No user with that Token";
    }

    $JSON = json_encode($rep);
    echo $JSON;
}

exit;
die;
