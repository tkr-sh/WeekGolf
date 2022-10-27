<?php

// Entry: token
// Purpose: Get information about the finale phase
// Output: The infos

$token = $_POST["t"];

if (isset($token)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";


    $result = rsql("SELECT id FROM Users WHERE token = ?", [$token], "s");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $id = $row["id"];
        }
    } else {
        echo "No user with that token";
        exit;
    }

    try {
        $id_phase = $conn->query("SELECT id FROM Phases WHERE phase3 < NOW() AND phaseend > NOW()")->fetch_assoc()["id"]; // <-- Standard request
    } catch (Exception $e) {
        echo "Error phase.";
        exit;
    }

    if (isset($id) && isset($id_phase)) {
        try {
            $sql = "SELECT * FROM (SELECT * FROM Suggestion WHERE phase_id = $id_phase ORDER BY upvote DESC LIMIT 2) AS T1"; // <-- No need to do secure request
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $arr1 = [];
                $arr2 = [];

                // ROWS
                $row1   = $result->fetch_assoc();
                $arr1[] = $row1["color"];
                $arr1[] = $row1["lang"];
                $arr1[] = $row1["upvote_final"];
                $row2   = $result->fetch_assoc();
                $arr2[] = $row2["color"];
                $arr2[] = $row2["lang"];
                $arr2[] = $row2["upvote_final"];

                // If already votes
                //// 1
                $inttemp = 0;
                $result  = rsql("SELECT * FROM UpvoteLang WHERE lang = ? AND owner_id = ? AND phase_id = ? AND final = 1", [$arr1[1], $id, $id_phase], "sii");
                if ($result -> num_rows > 0) {
                    $inttemp = 1;
                }
                $arr1[] = $inttemp;

                //// 2
                $inttemp = 0;
                $result  = rsql("SELECT * FROM UpvoteLang WHERE lang = ? AND owner_id = ? AND phase_id = ? AND final = 1", [$arr2[1], $id, $id_phase], "sii");
                if ($result -> num_rows > 0) {
                    $inttemp = 1;
                }
                $arr2[] = $inttemp;


                // Sending reponse
                $rep = new stdClass();

                $rep->arr1 = $arr1;
                $rep->arr2 = $arr2;

                $JSON = json_encode($rep);
                echo $JSON;
            }//end if
        } catch (Exception $e) {
            echo "Error.";
        }//end try
    } else {
        echo "Invalid token or phase";
    }//end if
} else { // If not logged
    // Connecting to DataBase
    include_once "connectToDatabase.php";

    try {
        $id_phase = $conn->query("SELECT id FROM Phases WHERE phase3 < NOW() AND phaseend > NOW()")->fetch_assoc()["id"]; // <-- Standard request
    } catch (Exception $e) {
        echo "Error phase.";
        exit;
    }

    $sql = "SELECT * FROM (SELECT * FROM Suggestion WHERE phase_id = $id_phase ORDER BY upvote DESC LIMIT 2) AS T1"; // <-- No need to do secure request
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $arr1 = [];
        $arr2 = [];

        // ROWS
        $row1   = $result->fetch_assoc();
        $arr1[] = $row1["color"];
        $arr1[] = $row1["lang"];
        $row2   = $result->fetch_assoc();
        $arr2[] = $row2["color"];
        $arr2[] = $row2["lang"];

        if ($conn->query("SELECT id FROM Phases WHERE phase4 < NOW() AND phaseend > NOW()")->num_rows > 0) {
            $arr1[] = $row1["upvote_final"];
            $arr2[] = $row2["upvote_final"];
        }

        // Sending reponse
        $rep = new stdClass();

        $rep->arr1 = $arr1;
        $rep->arr2 = $arr2;

        $JSON = json_encode($rep);
        echo $JSON;
    }
}

exit;
die;
