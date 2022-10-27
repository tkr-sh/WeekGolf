<?php

// Entry: Phase
// Purpose: Get the remaining time of a phase (for vote languages)
// Output: The remaining time

$p = $_POST["p"];

if (isset($p) && is_numeric($p)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";

    $sql    = "SELECT UNIX_TIMESTAMP(phase".(max(($p + 1), 1) != 5 ? max(($p + 1), 1) : 'end').")-UNIX_TIMESTAMP(NOW()) FROM Phases WHERE phase$p <NOW() AND phase".(($p + 1) != 5 ? ($p + 1) : 'end')." > NOW();";
    $result = $conn->query($sql);


    $t = -1;

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $t = $row["UNIX_TIMESTAMP(phase".(max(($p + 1), 1) != 5 ? max(($p + 1), 1) : 'end').")-UNIX_TIMESTAMP(NOW())"];
        }
    }


    // Sending reponse
    $rep    = new stdClass();
    $rep->t = $t;
    $JSON = json_encode($rep);
    echo $JSON;
}

exit;
die;
