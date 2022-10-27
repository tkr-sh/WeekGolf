<?php

// Entry: token, lang
// Purpose: Upvote a lang in phase
// Output: If it was upvoted or not

$token = $_POST["t"];
$lang  = $_POST["lang"];

if (isset($token) && isset($lang)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";


    $result = rsql("SELECT id FROM Users WHERE token = ? AND vote_right = 1;", [$token], "s");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $id = $row["id"];
        }
    }

    try {
        $id_phase = $conn->query("SELECT id FROM Phases WHERE phase2 < NOW() AND phase3 > NOW()")->fetch_assoc()["id"];
    } catch (Exception $e) {
        echo "Error phase.";
    }

    if (isset($id) && isset($id_phase)) {
        try {
            if (rsql("SELECT * FROM UpvoteLang WHERE lang = ? AND owner_id = ? AND phase_id = ?", [$lang, $id, $id_phase], "sii")->num_rows == 0) {
                esql("INSERT INTO UpvoteLang (lang, owner_id, phase_id) VALUES (?, ?, ?);", [$lang, $id, $id_phase], "sii");
                esql("UPDATE Suggestion SET upvote = upvote + 1 WHERE lang = ? AND phase_id = ?;", [$lang, $id_phase], "si");
                echo "ADDED";
            } else {
                esql("DELETE FROM UpvoteLang WHERE lang = ? AND owner_id = ? AND phase_id = ?;", [$lang, $id, $id_phase], "sii");
                esql("UPDATE Suggestion SET upvote = upvote - 1 WHERE lang = ? AND phase_id = ?;", [$lang, $id_phase], 'si');
                echo "REMOVED";
            }
        } catch (Exception $e) {
            echo "Error.";
        }
    } else {
        echo "Invalid token or you dont have the right to vote anymore.";
    }
} else {
    echo "Invalid req";
}

exit;
die;
