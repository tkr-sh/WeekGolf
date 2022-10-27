<?php
// Entry: token, lang
// Purpose: Upvote a lang in the final phase
// Output: If it was upvoted or not

$token = $_POST["t"];
$lang  = $_POST["lang"];

if (isset($token) && isset($lang)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";


    // Get id by token
    $result = rsql("SELECT id FROM Users WHERE token = ?", [$token], "s");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $id = $row["id"];
        }
    }

    if (!isset($id)) { // Invalid token
        echo "Bad ID";
        die;
    }

    try {
        $id_phase = $conn->query("SELECT id FROM Phases WHERE phase3 < NOW() AND phase4 > NOW()")->fetch_assoc()["id"];
    } catch (Exception $e) {
        echo "Error phase.";
        die;
    }

    if (isset($id) && isset($id_phase)) {
        // If the language is in the 3rd phase
        try { 
            // If langage is NOW upvoted
            if (rsql("SELECT * FROM (SELECT * FROM Suggestion WHERE phase_id = ? ORDER BY upvote DESC LIMIT 2) AS T1 WHERE lang = ?", [$id_phase, $lang], "is")->num_rows > 0) {
                // If the other language was upvoted before
                if (rsql("SELECT * FROM UpvoteLang WHERE lang = ? AND owner_id = ? AND phase_id = ? AND final = 1", [$lang, $id, $id_phase], "sii")->num_rows == 0) {
                    if (rsql("SELECT * FROM UpvoteLang WHERE NOT lang = ? AND owner_id = ? AND phase_id = ? AND final = 1;", [$lang, $id, $id_phase], "sii")->num_rows > 0) {
                        esql("DELETE FROM UpvoteLang WHERE NOT lang = ? AND owner_id = ? AND phase_id = ? AND final = 1;", [$lang, $id, $id_phase], "sii");
                        esql("UPDATE Suggestion SET upvote_final = GREATEST(upvote_final, 1) - 1 WHERE NOT lang = ? AND phase_id = ?", [$lang, $id_phase], "si");
                    }

                    esql("INSERT INTO UpvoteLang (lang, owner_id, phase_id, final) VALUES (?, ?, ?, 1);", [$lang, $id, $id_phase], "sii");
                    esql("UPDATE Suggestion SET upvote_final = upvote_final + 1 WHERE lang = ? AND phase_id = ?;", [$lang, $id_phase], "si");
                    echo "ADDED";
                } else {
                    esql("DELETE FROM UpvoteLang WHERE lang = ? AND owner_id = ? AND phase_id = ? AND final = 1;", [$lang, $id, $id_phase], "sii");
                    esql("UPDATE Suggestion SET upvote_final = upvote_final - 1 WHERE lang = ? AND phase_id = ?;", [$lang, $id_phase], "si");
                    echo "REMOVED";
                }
            } else {
                echo "This language isn't in the third phase.";
            }
        } catch (Exception $e) {
            echo "Error.";
        }
    } else {
        echo "Invalid token or phase";
    }
} else {
    echo "Invalid request";
}

exit;
die;
