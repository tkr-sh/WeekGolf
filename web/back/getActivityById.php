<?php

// Entry: id
// Purpose: Get the activity of a person by id
// Output: The activity of this person

$id = $_POST["id"];

if (isset($id)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";


    // Searching all performances
    $title_arr   = [];
    $content_arr = [];
    $date_arr    = [];
    $i           = 0;
    $result      = rsql("SELECT * FROM Activity WHERE owner_id = ? ORDER BY UNIX_TIMESTAMP(activity_date) DESC;", [$id], "i");

    if ($result -> num_rows > 0) {
        while ($row = $result -> fetch_assoc()) {
            array_push($content_arr, $row["content"]);
            array_push($title_arr, $row["title"]);
            array_push($date_arr, $row["activity_date"]);
        }
    }


    // Sending reponse
    $rep = new stdClass();

    $rep->content = $content_arr;
    $rep->title   = $title_arr;
    $rep->date    = $date_arr;

    $JSON = json_encode($rep);
    echo $JSON;
}

exit;
die;
