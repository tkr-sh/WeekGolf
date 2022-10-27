<?php

// Entry: problem_id, lang
// Purpose: Get the evolution of score in a lang
// Output: Size and Users and Performances (if challenge is over)

$problem_id = $_POST["pid"];
$lang       = strtolower(rawurldecode($_POST["lang"]));

if (isset($problem_id) && isset($lang)) {

    // Connect to DataBase
    include_once "connectToDatabase.php";

    
    // If the problem exists
    $result = rsql("SELECT id FROM Problem WHERE id = ?;", [$problem_id], "i");

    if ($result -> num_rows == 1) {
        $result       = rsql("SELECT id FROM Problem WHERE id = ? AND date_end <= NOW()", [$problem_id], "i");
        $problem_over = $result -> num_rows == 1;
    } else {
        echo "No problem with that id";
        exit;
    }


    // Get the evolution
    $code   = [];
    $size   = [];
    $uers   = [];
    $from   = ["c++", "javascript", "c#"];
    $to     = ["cpp", "node", "cs"];
    $lang   = str_replace($from, $to, $lang);
    $result = rsql("SELECT code, size, owner_id FROM Golf WHERE problem_id = ? AND lang = ? ORDER BY date_submit ASC;", [$problem_id, $lang], "is");


    // Best result
    $current_best = 9999999;

    if ($result -> num_rows > 0) {
        while ($row = $result -> fetch_assoc()) {
            if ($row["size"] < $current_best) {
                if ($problem_over) {
                    $code[] = $row["code"];
                }

                $size[]       = $row["size"];
                $users[]      = rsql("SELECT username FROM Users WHERE id = ?", [$row["owner_id"]], "i") -> fetch_assoc()["username"];
                $current_best = $row["size"];
            }
        }
    }


    
    // Sending reponse
    $rep = new stdClass();

    $rep->size  = $size;
    $rep->users = $users;
    $rep->code  = $code;


    $JSON = json_encode($rep);
    echo $JSON;
}



exit;
