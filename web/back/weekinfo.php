<?php

// Entry: :/
// Purpose: The info of the challenge of the week for the discord bot
// Output: The info of the challenge of the week


// Connect to Database
require_once "connectToDatabase.php";



// Request for info
$res = $conn -> query("SELECT title, id, sum_votes, voters, UNIX_TIMESTAMP(date_end) - UNIX_TIMESTAMP(NOW()), lotw FROM Problem WHERE date_enable < NOW() ORDER BY date_enable DESC LIMIT 1") -> fetch_assoc();


// LOTW && Color
$lotw =  $res["lotw"];
if (isset($lotw)) {
    $color = rsql("SELECT color FROM ColorLang WHERE lang = ?", [$lotw], "s") -> fetch_assoc()["color"];
} else {
    $color = "#333333";
    $lotw = "python";
}

// Note
$voters = floatval($res["voters"]);
if ($voters == 0){
    $note = 10.0;
} else {
    $note = floatval($res["sum_votes"]) / $voters;
}



// Send the JSON
$rep = new stdClass();

$rep->title = $res["title"];
$rep->id    = $res["id"];
$rep->note  = round($note, 2);
$rep->end   = $res["UNIX_TIMESTAMP(date_end) - UNIX_TIMESTAMP(NOW())"];
$rep->lotw  = $lotw;
$rep->color = $color;

$JSON = json_encode($rep);

echo $JSON;

die;