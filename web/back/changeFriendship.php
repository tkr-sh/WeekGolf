<?php

// Entry: token, id (the id of the other user), state (the state of the relationship)
// Purpose: Change the relation of two persons
// Output: "No problems" if no problems

$id    = $_POST["id"];
$token = $_POST["t"];
$state = $_POST['s'];

if (isset($id)) {

    // Connect to Data Base
    include_once "connectToDatabase.php";


    // Get the id of the two persons
    $result = rsql("SELECT id FROM Users WHERE token = ?;", [$token], "s");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $yid = $row["id"]; // yid for your_id
        }
    }

    if ($yid == $id) {
        echo "Hey ! It's you again!";
        exit;
    }


    $nb_rows = rsql("SELECT * FROM Users WHERE id = ?", [$id], "i") -> num_rows;

    if ($nb_rows > 0) {
        // Delete the relation
        esql("DELETE FROM Friends WHERE follower_id = ? AND following_id = ?;", [$yid, $id], "ii");
        // Add the relation if correct
        if ($state == 1 && $yid != $id) {
            esql("INSERT INTO Friends (follower_id,following_id) VALUES (?, ?);", [$yid, $id], "ii");
        }

        // Sending reponse
        echo "No problems";
    } else {
        echo "User doesn't exists";
    }
}//end if

exit;
die;
