<?php

// Entry: id (of the problem)
// Purpose: Show a valid challenge by his id
// Output: The bio and the title if correct

$id = $_POST["id"];

if (isset($id)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";


    // Get the problem
    $result = rsql("SELECT * FROM Problem WHERE date_enable < NOW() AND id = ?;", [$id], "i");

    $rep = new stdClass();

    $title    = '';
    $descript = '';

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $title    = $row["title"];
            $descript = $row["descript"];
        }
    }

    $rep->title    = $title;
    $rep->descript = $descript;

    $JSON = json_encode($rep);

    echo $JSON;
}//end if

exit;
die;
