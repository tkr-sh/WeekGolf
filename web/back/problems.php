<?php

// Entry: problem
// Purpose: Return the actual list of problems
// Output: The list of problems

$problems = $_POST["p"];

if (isset($problems)) {
    
    // Connecting to Database
    include_once "connectToDatabase.php";


    $sql = "SELECT title, id, sum_votes, voters, lotw FROM Problem WHERE date_enable <= NOW();";
    $result = $conn->query($sql);

    $title = [];
    $id    = [];
    $notes = [];
    $langs = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $title[] = $row["title"];
            $id[]    = $row["id"];
            $langs[] = $row["lotw"] === null ? "" : $row["lotw"];
            if (intval($row["voters"]) != 0)
                $notes[] = intval($row["sum_votes"]) / intval($row["voters"]);
            else 
                $notes[] = 10;

        }
    }


    $rep = new stdClass();

    $rep->id    = $id;
    $rep->title = $title;
    $rep->notes = $notes;
    $rep->langs = $langs;


    $JSON = json_encode($rep);
    echo $JSON;
}

exit;
die;
