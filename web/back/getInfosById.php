<?php

// Entry: id (user)
// Purpose: Get informations of an user by it's id
// Output: The infos

$id = $_POST["id"];

if (isset($id)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";

    $result = rsql("SELECT * FROM Users WHERE id = ?", [$id], "i");

    $rep = new stdClass();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $id         = $row["id"];
            $username   = $row["username"];
            $bio        = $row["bio"];
            $pp         = $row["pp"];
            $banner     = $row["banner"];
            $discord    = $row["discord_display"] == '1' ? $row["discord"] : null;
            $discord_id = $row["discord_display"] == '1' ? $row["discord_id"] : null;
            $country    = $row['country'];
        }

        $rep->id         = $id;
        $rep->username   = $username;
        $rep->bio        = $bio;
        $rep->pp         = $pp;
        $rep->banner     = $banner;
        $rep->country    = $country;
        $rep->discord    = $discord;
        $rep->discord_id = $discord_id;
        $rep->error      = "";
    } else {
        $rep->id    = "";
        $rep->error = "No user with that ID";
    }//end if

    $JSON = json_encode($rep);
    echo $JSON;
}//end if

exit;
die;
