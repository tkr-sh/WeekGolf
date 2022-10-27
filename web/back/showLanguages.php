<?php

// Entry: token
// Purpose: Get the languages, color and votes for phase 1 and 2
// Output: The languages, color and votes

$t = $_POST["t"];

if (isset($t)) {

    // Connect to DataBase
    include_once "connectToDatabase.php";


    $id_phase = $conn->query("SELECT id FROM Phases WHERE phase1 <= NOW() AND phase3 > NOW()");

    if ($id_phase -> num_rows > 0) {

        $id_phase = $conn->query("SELECT id FROM Phases WHERE phase1 <= NOW() AND phase3 > NOW()")->fetch_assoc()["id"];
        $sql      = "SELECT * FROM Suggestion WHERE phase_id = $id_phase";
        $result   = $conn->query($sql);
        $infos    = [];
        $i        = 0;
        
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $temp = [];

                $temp[] = $row["lang"];
                $temp[] = $row["color"];
                $temp[] = $row["upvote"];

                $infos[$i] = $temp;
                $i++;
                $temp = [];
            }
        }


        // Sending reponse
        $rep = new stdClass();

        $rep->infos = $infos;

        $JSON = json_encode($rep);

        echo $JSON;
    }
}

exit;
die;
