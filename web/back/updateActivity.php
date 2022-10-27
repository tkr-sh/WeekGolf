<?php

// Entry: :/
// Purpose: Get the new activity to update the activity
// Output: The new activity

// Connect to DataBase
require_once "connectToDatabase.php";

// Get the new activity
$result = $conn->query("SELECT UNIX_TIMESTAMP(activity_date), activity_date, id, title, content, major, owner_id FROM Activity WHERE UNIX_TIMESTAMP(activity_date) + 30 > UNIX_TIMESTAMP(NOW()) ORDER BY activity_date DESC");

// Arrays
$owner_id      = [];
$title         = [];
$content       = [];
$major         = [];
$activity_date = [];

// Adding result to arrays
if ($result -> num_rows > 0) {
    while ($row = $result -> fetch_assoc()) {
        $owner_id[]       = $row["owner_id"];
        $title[]          = $row["title"];
        $content[]        = $row["content"];
        $major[]          = $row["major"];
        $activity_date[]  = $row["activity_date"];
        $unix_timestamp[] = $row["UNIX_TIMESTAMP(activity_date)"];
    }
}




// Sending reponse
$rep = new stdClass();

$rep->owner_id       = $owner_id;
$rep->title          = $title;
$rep->content        = $content;
$rep->major          = $major;
$rep->activity_date  = $activity_date;
$rep->unix_timestamp = $unix_timestamp;

$JSON = json_encode($rep);

echo $JSON;
