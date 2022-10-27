<?php

// Entry: token, problem_id, lang
// Purpose: Get the history of golf of an user
// Output: The history of answers

$token = $_POST["t"];
$problem_id = $_POST["pid"];
$lang = $_POST["lang"];

if (isset($token) && isset($problem_id) && isset($lang)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";

    // Get ID of the user by his token
    $result = rsql("SELECT id FROM Users WHERE token = ?;", [$token], "s");

    /// If token is valid
    if ($result -> num_rows > 0){

        // Get the ID of the user
        $user_id = $result -> fetch_assoc()["id"];

        // Get his code sorted by size
        $result = rsql("SELECT code, size FROM Golf WHERE owner_id = ? AND lang = ? AND problem_id = ? ORDER BY size ASC;", [$user_id, $lang, $problem_id], "isi");
    
        // Declare ararys
        $code = [];
        $size = [];
        
        // Add  values to arrays
        while ($row = $result -> fetch_assoc()) {
            $code[] = $row["code"]; 
            $size[] = $row["size"]; 
        }

        // Send them
        $rep = new stdClass();
        $rep->code  = $code;
        $rep->size  = $size;
        $rep->error = "";

        $JSON = json_encode($rep);

        echo $JSON;

    } else {
        // ERROR in token
       echo "No user with that token";
       die;
    }
}

exit;
die;
