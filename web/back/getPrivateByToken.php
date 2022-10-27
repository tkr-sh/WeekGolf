<?php

// Entry: token
// Purpose: Get the Private infos of a person by it's token
// Output: The private (or not) infos

$token = $_POST["t"];

if (isset($token)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";

    $result = rsql("SELECT bio, email, username, pp, banner, discord, country, discord_display FROM Users WHERE token = ?;", [$token], "s");

    $rep = new stdClass();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $email    = $row["email"];
            $username = $row["username"];
            $pp       = $row["pp"];
            $banner   = $row["banner"];
            $bio      = $row["bio"];
            $discord  = $row["discord"];
            $discord_display = intval($row["discord_display"]);
            $country  = $row["country"];
        }

        $rep->email   = $email;
        $rep->discord = $discord;
        $rep->discord_display = $discord_display;
        $rep->username = $username;
        $rep->pp      = $pp;
        $rep->banner  = $banner;
        $rep->bio     = $bio;
        $rep->country = $country;
        $rep->error   = "";
    } else {
        $rep->id    = "";
        $rep->error = "No user with that Token";
    }

    $JSON = json_encode($rep);
    echo $JSON;
}

exit;
die;
