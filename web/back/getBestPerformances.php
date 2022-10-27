<?php

// Entry: id (user)
// Purpose: Get Performances of a user (sorted by the best ranking)
// Output: The array of results

$id = $_POST["id"];

if (isset($id)) {

    // Connect to DataBase
    include_once "connectToDatabase.php";


    // Searching all performances
    $already_seen = [];
    $results      = [];
    $i            = 0;
    $result  = rsql('SELECT Golf.problem_id, Golf.lang, Golf.size, Problem.title FROM Golf, Problem WHERE Golf.owner_id = ? AND Golf.date_submit < UNIX_TIMESTAMP(Problem.date_end) AND Golf.problem_id = Problem.id ORDER BY SIZE ASC;', [$id], "i");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            if (!in_array([$row["problem_id"], $row["lang"]], $already_seen)) { // If already seen
                $already_seen[$i] = [ $row["problem_id"], $row["lang"] ]; // [problem_id, lang]
                $results[$i] = [ intval($row["problem_id"]), $row["lang"], intval($row["size"]), $row["title"] ]; // [problem_id, lang, size, title]
                $i++;
            }
        }
    }


    // Get the rank
    for ($j = 0; $j < sizeof($results); $j++) {
        $rank    = 1;
        $nb_user = 0;
        $user_already_seen = [];

        $result = rsql("SELECT Golf.size, Golf.owner_id FROM Golf, Problem WHERE Golf.date_submit < UNIX_TIMESTAMP(Problem.date_end) AND Golf.problem_id = Problem.id AND problem_id = ? AND lang = ? ORDER BY SIZE ASC;", [$results[$j][0], $results[$j][1]], "is");

        while ($row = $result->fetch_assoc()) {
            if (!in_array($row["owner_id"], $user_already_seen)) {
                $rank += $row["size"] < $results[$j][2];
                $user_already_seen[] = $row["owner_id"];
                $nb_user++ ;
            }
        }

        array_push($results[$j], $rank, $nb_user);
    }


    // Sending reponse
    $rep = new stdClass();

    $rep->res = $results;

    $JSON = json_encode($rep);
    echo $JSON;
}
exit;
die;
