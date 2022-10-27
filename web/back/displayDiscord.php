<?php

// Entry: token
// Purpose: Change the display of the discord of the person
// Output: Nothing.

$token = $_POST["t"];

if (isset($token)) {

    // Connect to DataBase
    include_once "connectToDatabase.php";

    $result = rsql("SELECT discord_display FROM Users WHERE token = ?;", [$token], 's');

    if ($result -> num_rows > 0) {
        $state     = $result->fetch_assoc()["discord_display"];
        $new_state = $state == "0" ? 1 : 0;
        esql("UPDATE Users SET discord_display = ? WHERE token = ?;", [$new_state, $token], "is");
    }
}

exit;
die;
