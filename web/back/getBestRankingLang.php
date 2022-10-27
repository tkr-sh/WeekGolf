<?php

// Entry: id (user)
// Purpose: Get the ranking of the user in languages
// Output: The result with information: lang, user_rank, total_players

$id = $_POST["id"];

if (isset($id)) {

    // Connect to DataBase
    include_once "connectToDatabase.php";

    // Get Columns/Languages name
    $columns = [];
    $result  = $conn->query("SHOW COLUMNS FROM Languages");
    while ($row = $result->fetch_assoc()) {
        if ($row["Field"] != "owner_id") { // If it's a language and not the id of the user
            $columns[] = $row["Field"];
        }
    }
    sort($columns);


    // Store the score of the user in languages in an Array
    $result = rsql("SELECT * FROM Languages WHERE owner_id = ?", [$id], 'i');
    $langs = [];
    $rank  = [];
    $score = [];
    $tot   = [];
    if ($result -> num_rows > 0) {
        while ($row = $result -> fetch_assoc()) {
            foreach ($columns as &$col) {
                if ($row[$col] != 0) {
                    $langs[] = explode("_", $col)[0];
                    $score[] = $row[$col];
                    $rank[]  = 0;
                }
            }
        }
    } else {
        echo "Not a valid id.";
        die;
    }


    // Compare it's rank to the global
    $result = $conn->query("SELECT * FROM Languages");
    if ($result -> num_rows > 0) {
        while ($row = $result -> fetch_assoc()) {
            for ($i = 0; $i < sizeof($langs); $i++) {
                // If your score is less, your ranking is "higher"
                $rank[$i] += $score[$i] < $row[$langs[$i]."_score"];

                // If the person never played this language, he/she doesnt count as a player
                $tot[$i] += $row[$langs[$i]."_score"] != 0;
            }
        }
    }



    // Sending reponse
    $rep = new stdClass();

    $rep->langs = $langs;
    $rep->rank  = $rank;
    $rep->tot   = $tot;

    $JSON = json_encode($rep);
    echo $JSON;
}


exit;
