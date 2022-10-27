<?php

// Entry: \
// Purpose: Get the mean of all languages for the discord bot
// Output: The mean of all languages in a JSON


// Connect to Database
require_once "connectToDatabase.php";


// Arrays
$from = ["javascript", "c++"];
$to   = ["node", "cpp",];
$lang_name = [];
$lang_mean = [];


// Get all current languages
$result    = $conn->query("SELECT lang FROM CurrentLang");

while ($row = $result -> fetch_assoc()) {

    $temp_lang   = str_replace($from, $to, $row["lang"]); // Temporary lang (change each iteration)
    $lang_name[] = ucfirst($row["lang"]); // Adding the lang name to the array $lang_name
    $result2     = $conn->query("SELECT id FROM Problem WHERE date_enable <= NOW()"); // Get the ID of the problems which are enable
    $mean_size   = []; // Array with all the golf

    // Adding each best answer to the array
    for ($i = 1; $row2 = $result2 -> fetch_assoc(); $i++) {
        $result3 = rsql("SELECT size FROM Golf WHERE lang = ? AND problem_id = ? ORDER BY size ASC LIMIT 1", [$temp_lang, $i], "si");
        if ($result3 -> num_rows > 0)
            $mean_size[] = intval($result3->fetch_assoc()["size"]);
    }

    // Adding the mean to $lean_mean
    $lang_mean[] = array_sum($mean_size) / sizeof($mean_size);
}




// Function that sorts an array and return a new one
function sort_without_new($params) {
    sort($params);
    return $params;

}

// Ordering by the size
$sort_lang_mean = sort_without_new($lang_mean);
$sort_lang_name = [];
for ($i = 0; $i < sizeof($sort_lang_mean); $i++) {
    for ($j = 0; $j < sizeof($sort_lang_mean); $j++) {
        if ($sort_lang_mean[$i] === $lang_mean[$j]) {
            $sort_lang_name[] = $lang_name[$j];
            break;
        }
    }
}



// Sending reponse
$json = new stdClass();
for ($i = 0; $i < sizeof($sort_lang_mean); $i++)
    $json -> {$sort_lang_name[$i]} = $sort_lang_mean[$i];

$JSON = json_encode($json);
echo $JSON;

exit;
