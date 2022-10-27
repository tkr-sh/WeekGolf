<?php

// Entry: id (user)
// Purpose: Get comments of a user (sorted by the most like)
// Output: The array of comments

$id = $_POST["id"];

if (isset($id)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";


    // Searching all performances
    $upvote_arr  = [];
    $content_arr = [];
    $result      = rsql('SELECT * FROM Commentaire WHERE owner_id = ? ORDER BY upvote DESC;', [$id], 'i');

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $content_arr[] = $row["content"];
            $upvote_arr[]  = $row["upvote"];
        }
    }


    // Sending reponse
    $rep = new stdClass();

    $rep->content = $content_arr;
    $rep->upvote  = $upvote_arr;

    $JSON = json_encode($rep);
    echo $JSON;
}

exit;
die;
