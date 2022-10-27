<?php

// Entry: note, token, problem_id
// Purpose: Get the note that a user gave to a problem
// Output: The note of the user if correct

$token      = $_POST["t"];
$problem_id = $_POST["pid"];

if (isset($token) && isset($problem_id)) {

    // Connect to Database
    include_once "connectToDatabase.php";

    $res = rsql("SELECT id FROM Users WHERE token = ?", [$token], "s");
    if ($res -> num_rows > 0) {
        $user_id = $res -> fetch_assoc()["id"];

        $res = rsql("SELECT note FROM NoteProblem WHERE owner_id = ? AND problem_id = ?", [$user_id, $problem_id], "ii");

        // If the user already noted that problem
        if ($res -> num_rows > 0) {
            echo $res->fetch_assoc()["note"];
        } else {
            // Else if the user never noted that problem
            echo -1;
        }
    } else {
        echo "Invalid token";
    }
} else {
    echo "Invalid request";
}


die;
