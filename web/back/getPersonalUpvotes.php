<?php

// Entry: token
// Purpose: Say which comments a user had upvote
// Output: A dictionnary with all the comments corresponding to true or false (liked or not)

$token = $_POST["t"];

if (isset($token)) {

    // Connect to DataBase
    include_once "connectToDatabase.php";

    // If the user is correct
    $result = rsql("SELECT id FROM Users WHERE token = ?", [$token], "s");
    if ($result -> num_rows > 0) {
        $user_id = $result -> fetch_assoc()["id"];
    } else {
        echo "Bad token";
        exit;
    }

    $comments = [];
    $result   = rsql("SELECT commentaire_id FROM UpvoteCommentaire WHERE owner_id = ?", [$user_id], "i");
    if ($result -> num_rows > 0) {
        while ($row = $result -> fetch_assoc()) {
            $comments[] = $row["commentaire_id"];
        }
    }


    // Sending reponse
    $rep           = new stdClass();
    $rep->comments = $comments;
    $JSON          = json_encode($rep);
    echo $JSON;
}

exit;
