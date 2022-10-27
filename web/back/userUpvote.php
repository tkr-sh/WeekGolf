<?php

// Entry: token
// Purpose: Get the upvotes of an user by it's token
// Output: The upvotes of an user

$token = $_POST["t"];

if (isset($token)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";


    $result = rsql("SELECT id FROM Users WHERE token = ? AND vote_right = 1;", [$token], "s");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $id = $row["id"];
        }
    }

    try {
        $id_phase = $conn->query("SELECT id FROM Phases WHERE phase2 < NOW() AND phase3 >NOW()")->fetch_assoc()["id"];
    } catch (Exception $e) {
        echo "Error phase.";
    }

    $upvotes = [];
    if (isset($id_phase) && isset($id)) {
        $sql    = "SELECT lang FROM UpvoteLang WHERE owner_id = $id AND phase_id=$id_phase;";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                array_push($upvotes, $row["lang"]);
            }
        }


        // Send the JSON
        $rep = new stdClass();

        $rep->upvotes = $upvotes;

        $JSON = json_encode($rep);

        echo $JSON;
    } else {
        echo "Invalid token or phase";
    }
} else {
    echo "Invalid req";
}

exit;
die;
