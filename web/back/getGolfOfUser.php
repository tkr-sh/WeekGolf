<?php

// Entry: user_id, problem_id, lang
// Purpose: Get the evolution of somebody
// Output: Size and Performances (if challenge is over)

$user_id    = $_POST["id"];
$problem_id = $_POST["pid"];
$lang       = strtolower(rawurldecode($_POST["lang"]));

if (isset($user_id) && isset($problem_id) && isset($lang)) {

    // Connect to Database
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
    


    // Variables
    $code = [];
    $size = [];
    $from = ["c++", "javascript", "c#"];
    $to   = ["cpp", "node", "cs"];
    $lang = str_replace($from, $to, $lang);

    // Get size and code of the user
    $result = rsql("SELECT code, size FROM Golf WHERE problem_id = ? AND owner_id = ? AND lang = ?;", [$problem_id, $user_id, $lang], "iis");

    if ($result -> num_rows > 0) {
        while ($row = $result -> fetch_assoc()) {
            if ($problem_over) {
                $code[] = $row["code"];
            }

            $size[] = $row["size"];
        }
    }

    

    // Sending reponse
    $rep = new stdClass();

    $rep->size = $size;
    $rep->code = $code;


    $JSON = json_encode($rep);
    echo $JSON;
}


exit;
