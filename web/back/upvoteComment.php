<?php

// Entry: Token, comment id
// Purpose: Upvote a comment
// Output:  "Upvoted" or "Unvoted" if valid.

$token      = $_POST["t"];
$comment_id = $_POST["id"];


if (isset($token) && isset($comment_id)) {
    // Connect to DataBase
    include_once "connectToDatabase.php";



    // Get the ID of the User By Token
    $result = rsql("SELECT id FROM Users WHERE token = ?;", [$token], "s");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $user_id = $row["id"];
        }
    }

    // Get the ID of the User By the comment ID
    $result = rsql("SELECT owner_id FROM Commentaire WHERE id = ?;", [$comment_id], "s");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $owner_of_comment_id = $row["owner_id"];
        }
    }

    if (isset($user_id) && isset($owner_of_comment_id) && $user_id !== $owner_of_comment_id) {
        $sql    = "SELECT * FROM UpvoteCommentaire WHERE owner_id=$user_id AND $comment_id = commentaire_id;";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) { // If there is already an upvote
            $sql = "UPDATE Commentaire SET upvote = upvote - 1 WHERE $comment_id = id";
            $conn->query($sql);
            $sql = "DELETE FROM UpvoteCommentaire WHERE $comment_id = commentaire_id AND owner_id = $user_id";
            $conn->query($sql);
            $sql = "UPDATE Users SET coop_score = coop_score - 75 WHERE id = $owner_of_comment_id";
            $conn->query($sql);
            echo "Unvoted";
        } else { // If there is no upvote
            try {
                $sql = "INSERT INTO UpvoteCommentaire (commentaire_id ,owner_id) VALUES ($comment_id, $user_id);";
                $conn->query($sql);
                $sql = "UPDATE Commentaire SET upvote = upvote + 1 WHERE $comment_id = id";
                $conn->query($sql);
                $sql = "UPDATE Users SET coop_score = coop_score + 75 WHERE id = $owner_of_comment_id";
                $conn->query($sql);
                echo "Upvoted";
            } catch (Exception) {
                echo "This user doesn't exists.";
            }
        }
    } else {
        echo "This user doesn't exists.";
    }
}

exit;
die;
