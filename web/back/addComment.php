<?php

// Entry: Token, content, id of the golf
// Purpose: Add a comment
// Output:  "Comment added :)" if comment valid.

$token   = $_POST["t"];
$content = urldecode($_POST["c"]);
$id      = $_POST["id"];


if (isset($token) && isset($content) && isset($id)) {

    // Connect to DataBase
    include_once "connectToDatabase.php";


    // Get the ID of the User By Token
    $result = rsql("SELECT id FROM Users WHERE token = ?;", [$token], "s");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $user_id = $row["id"];
        }
    }

    if (!isset($user_id)) {
        echo "User doesn't exists";
        exit;
    }

    $result = rsql("SELECT * FROM Golf WHERE id = ?;", [$id], "i");
    // If ID is valid
    if ($result->num_rows > 0) {
        // Every 5 minutes
        $result = rsql("SELECT * FROM Commentaire WHERE owner_id = ? AND UNIX_TIMESTAMP(date_send) > UNIX_TIMESTAMP(NOW()) - 300;", [$user_id], "i");
        if ($result->num_rows > 0) {
            echo "You can post a comment every 5 minutes";
        } else {
            esql("INSERT INTO Commentaire (date_send, golf_id, owner_id, content) VALUES (NOW(), ?, ?, ?)", [$id, $user_id, $content], "iis");
            echo "Comment added :)";
        }
    } else {
        echo "Invalid ID";
    }
} else {
    echo "Not a good value";
}//end if

exit;
die;
