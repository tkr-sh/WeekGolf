<?php

// Entry: id (of other people), token
// Purpose: Get the relation of two persons
// Output: The state of the relation between 2 people

$id    = $_POST["id"];
$token = $_POST["t"];

if (isset($id)) {

    // Connect to DataBase
    include_once "connectToDatabase.php";

    // Get the id of the two persons
    $result = rsql("SELECT id FROM Users WHERE token = ?;", [$token], "s");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $yid = $row["id"]; // yid for your_id
        }
    }

    $friendship_state = 0;

    // Get following
    $result = rsql("SELECT * FROM Friends WHERE follower_id = ? AND following_id = ?;", [$yid, $id], "ii");
    $friendship_state += $result->num_rows > 0;

    // Get follower
    $result = rsql("SELECT * FROM Friends WHERE following_id = ? AND follower_id = ?;", [$yid, $id], "ii");
    $friendship_state += ($result->num_rows > 0) * 2;
    $friendship_state += ($id === $yid) * 4;



    // Sending reponse
    $rep = new stdClass();

    $rep->state   = $friendship_state;
    $rep->message = "Lists returned whitout Problems";
    $JSON         = json_encode($rep);

    echo $JSON;
}

exit;
die;
