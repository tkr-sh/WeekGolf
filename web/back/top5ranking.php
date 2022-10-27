<?php

// Entry: :/
// Purpose: TOP 5 of rankings for the discord bot
// Output: Depend on the phase, but the infos about top languages


// Connect to Database
require_once "connectToDatabase.php";


// PHASE 1 && 2
///////////////
// If phase ID is correct
$id_phase = $conn->query("SELECT id FROM Phases WHERE phase1 <= NOW() AND phase3 > NOW()");

if ($id_phase -> num_rows > 0) {

    // SQL
    $id_phase = $id_phase->fetch_assoc()["id"]; // Phase id
    $result   = $conn->query("SELECT * FROM Suggestion WHERE phase_id = $id_phase ORDER BY upvote DESC LIMIT 5"); // get the top 5

    // Arrays
    $lang  = [];
    $color = [];
    $up    = [];
    $img   = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $lang[]  = $row["lang"];
            $color[] = $row["color"];
            $up[]    = $row["upvote"];
            $img[]   = strtolower($row["lang"])."_white.svg";
        }
    }


    // Send the JSON
    $rep = new stdClass();

    $rep->lang  = $lang;
    $rep->color = $color;
    $rep->up    = $up;
    $rep->img   = $img;

    $JSON = json_encode($rep);

    echo $JSON;
}



// PHASE 3 && 4
///////////////
$id_phase = $conn->query("SELECT id FROM Phases WHERE phase3 <= NOW() AND phaseend > NOW()");
if ($id_phase -> num_rows > 0) {

    // SQL
    $id_phase = $id_phase->fetch_assoc()["id"]; // Get the phase ID
    $result   = $conn->query("SELECT * FROM Suggestion WHERE phase_id = $id_phase ORDER BY upvote DESC, upvote_final DESC LIMIT 2"); // Get the top 2

    // Arrays
    $lang  = [];
    $color = [];
    $up    = [];
    $img   = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $lang[]  = $row["lang"];
            $color[] = $row["color"];
            $up[]    = $row["upvote_final"];
            $img[]   = strtolower($row["lang"])."_white.svg";
        }
    }


    // Send the JSON
    $rep = new stdClass();

    $rep->lang  = $lang;
    $rep->color = $color;
    $rep->up    = $up;
    $rep->img   = $img;

    $JSON = json_encode($rep);

    echo $JSON;
}

exit;
