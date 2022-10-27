<?php

// Entry: id (problem)
// Purpose: Get the leaderboard of a challenge
// Output: The leadeboard

$id = $_POST["id"];

if (isset($id)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";

    // Get the date of end of the problem
    $date_end_problem = rsql("SELECT UNIX_TIMESTAMP(date_end) FROM Problem WHERE id = ?;", [$id], "i")->fetch_assoc()["UNIX_TIMESTAMP(date_end)"];
    // Select * Golf answer when the problem wasnt over
    $result = rsql("SELECT * FROM Golf WHERE problem_id = ? AND date_submit < ? ORDER BY size ASC, date_submit ASC;", [$id, $date_end_problem], "is");



    $t = -1;
    $i = 0;

    $tot_arr       = [];
    $name_lang_arr = [];  // The array with Name + Lang already Seen
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $temp_arr = [];

            $temp_rep = rsql("SELECT pp, username FROM Users WHERE id = ?", [$row["owner_id"]], "i") -> fetch_assoc();

            $temp_arr[] = str_replace("csharp", "cs", $row["lang"]);
            $temp_arr[] = $row["owner_id"];
            $temp_arr[] = $temp_rep["username"];
            $temp_arr[] = $temp_rep["pp"];
            $temp_arr[] = $row["size"];

            $verification_arr = [
                $temp_rep["username"],
                $temp_arr[0],
            ];

            if (!in_array($verification_arr, $name_lang_arr)) {
                $tot_arr[$i] = [];
                for ($j = 0; $j < 5; $j++) {
                    $tot_arr[$i][$j] = $temp_arr[$j];
                }

                $name_lang_arr[] = $verification_arr;

                $i++;
            }
        }
    }


    // Sending reponse
    $rep = new stdClass();

    $rep->result = $tot_arr;

    $JSON = json_encode($rep);
    echo $JSON;
}

exit;
die;
