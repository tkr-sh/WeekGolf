<?php

// Entry: id (user)
// Purpose: Get the scores of a person by it's id
// Output: The scores

$id = $_POST["id"];

if(isset($id)) {
    
    // Connect to DataBase
    include_once "connectToDatabase.php";

    
    // Scores GUC
    $result = rsql("SELECT golf_score, upgrade_score, coop_score FROM Users WHERE id = ?;", [$id], "i");
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $golf = $row["golf_score"];
            $up = $row["upgrade_score"];
            $coop = $row["coop_score"];
        }
    }

    
    //Scores by languages
    $result = rsql("SELECT * FROM Languages WHERE owner_id = ?;", [$id], "i");
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $dic = $row;
        }
    }


    // Ranking total
    $total = $golf + $up + $coop;
    $rank = 1;
    $same_score = 0;
    $nb_user = 0;
    $sql = "SELECT golf_score, upgrade_score, coop_score FROM Users;";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $rank += ($row["golf_score"] + $row["upgrade_score"] + $row["coop_score"] > $total);
            $same_score += ($row["golf_score"] + $row["upgrade_score"] + $row["coop_score"] == $total);
            $nb_user++;
        }
    }
    error_reporting(E_ERROR | E_PARSE);

    $rep = new stdClass();

    $rep->golf = $golf;
    $rep->up = $up; 
    $rep->coop = $coop;
    $rep->lang = $dic;
    $rep->rank = $rank;
    $rep->nb_user = $nb_user;
    $rep->same_score = $same_score;

    $JSON = json_encode($rep);
    echo $JSON;
}

exit;
die;
?>