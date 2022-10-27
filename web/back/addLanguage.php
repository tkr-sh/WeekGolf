<?php

// Entry: Token, lang (the name of the lang to be added)
// Purpose: Add a language (in phase 1)
// Output:  "Added language whitout Problem" if language valid.

$token     = $_POST["t"];
$name_lang = $_POST["lang"];

if (isset($token) && isset($name_lang)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";


    // Verify if the user has a valid token + the right to add a language
    $result = rsql("SELECT id FROM Users WHERE token = ? AND vote_right = 1;", [$token], 's');

    if ($result->num_rows > 0) {
        $id = $result->fetch_assoc()["id"];
        try {
            // Verify if the user didn't add more than 3 languages + that we are in phase1
            $id_phase = $conn->query("SELECT id FROM Phases WHERE phase1 < NOW() AND phase2 > NOW()")->fetch_assoc()["id"];
            $sql = rsql("SELECT * FROM Suggestion WHERE owner_id = ? AND phase_id = ?", [$id, $id_phase], 'ii');
            $i = 0;

            while ($row = $sql->fetch_assoc()) {
                $i++;
            }

            // If there is more than 3 languages
            if ($i > 2) {
                echo "You already added 3 languages";
            } else {
                // If lang already here
                $b = true;
                // If it is in languages
                $b &= rsql("SELECT * FROM CurrentLang WHERE LOWER(lang) = ?;", [strtolower($name_lang)], "s")->num_rows == 0;
                // If it is in the suggestions
                $b &= rsql("SELECT * FROM Suggestion WHERE LOWER(lang) = ? AND phase_id = ?;", [strtolower($name_lang), $id_phase], "si")->num_rows == 0;
                if ($b) {
                    // Verification of bad wors
                    $bad_words = ["fdp", "pute", "merde", "connard", "bitch", "salope", "bastard", "cunt", "motherfucker"];
                    $bool = false;
                    for ($i = 0; $i < count($bad_words); $i++) {
                        $bool |= str_contains(strtolower($name_lang), $bad_words[$i]);
                    }

                    // If bad words
                    if (!$bool) {
                        $color = "NULL";
                        // Get the color
                        $sql = rsql("SELECT * FROM ColorLang WHERE lang = ?;", [strtolower($name_lang)], "s");
                        if ($sql->num_rows > 0) {
                            $color = "'".$sql->fetch_assoc()["color"]."'";
                        }

                        esql("INSERT INTO Suggestion (phase_id, owner_id, lang, color) VALUES ($id_phase, $id, ?, $color);", [ucfirst(strtolower($name_lang))], "s");
                        echo "Added language whitout Problem";
                    } else {
                        esql("UPDATE Users SET vote_right = 0 WHERE id = ?", [$id], "i");
                        echo "We detected that you tried to put innapropriate words and not a language.<br>You don't have the right to add languages anymore. If you think that this is an error, contact an administrator.";
                    }
                } else {
                    echo "Language already exists";
                }//end if
            }//end if
        } catch (Exception $e) {
            echo "You can't do that now.";
        }//end try
    } else {
        echo "No user with that token OR the user doesn't have the right to add a language.";
    }//end if
} else {
    echo "Bad format";
}//end if

exit;
die;
