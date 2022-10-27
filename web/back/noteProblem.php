<?php

// Entry: note, token, problem_id
// Purpose: Note a problem with a note in [1; 10]
// Output: \

$token      = $_POST["t"];
$note       = (intval($_POST["n"]) + 1);
$problem_id = $_POST["pid"];

if (isset($token) && isset($note) && isset($problem_id)) {
    if (($note > 0 && $note <= 10) || $note == 0) {

        // Connect To Database
        include_once "connectToDatabase.php";

        $res = rsql("SELECT id FROM Users WHERE token = ?", [$token], "s");
        if ($res -> num_rows > 0) {
            $user_id = $res -> fetch_assoc()["id"];

            $res = rsql("SELECT note FROM NoteProblem WHERE owner_id = ? AND problem_id = ?", [$user_id, $problem_id], "ii");

            // If the user already noted that problem
            if ($res -> num_rows > 0) {
                $note_previously_given = intval($res -> fetch_assoc()["note"]);

                if ($note_previously_given == $note) {
                    echo "Same note";
                    die;
                }

                if ($note == 0) {
                    esql("DELETE FROM NoteProblem WHERE owner_id = ? AND problem_id = ?", [$user_id, $problem_id], "ii");
                    esql("UPDATE Problem SET sum_votes = sum_votes - ?, voters = voters - 1 WHERE id = ?", [$note_previously_given, $problem_id], "ii");
                } else {
                    esql("UPDATE NoteProblem SET note = ? WHERE owner_id = ? AND problem_id = ?", [$note, $user_id, $problem_id], "iii");
                    esql("UPDATE Problem SET sum_votes = sum_votes - ? + ? WHERE id = ?", [$note_previously_given, $note, $problem_id], "iii");
                }
            } else { // Else if the user never noted that problem
                if ($note == 0) {
                    echo "No notes.";
                    die;
                }

                esql("INSERT INTO NoteProblem (note, problem_id, owner_id) VALUES (?, ?, ?);", [$note, $problem_id, $user_id], "iii");
                esql("UPDATE Problem SET sum_votes = sum_votes + ?, voters = voters + 1 WHERE id = ?", [$note, $problem_id], "ii");
            }
            echo "Success";
            
        } else {
            echo "Invalid token";
        }
    } else {
        echo "Note should be in [1; 10]";
    }
} else {
    echo "Invalid request";
}


die;
