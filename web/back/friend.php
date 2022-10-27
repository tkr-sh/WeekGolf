<?php

// Entry: id of the user
// Purpose: Get all the friends of somebody
// Output: The array of friends

$id = $_POST["id"];

if (isset($id)) {

    // Connect to DataBase
    include_once "connectToDatabase.php";

    $follower  = [];
    $following = [];


    // Get following
    $result = rsql("SELECT following_id FROM Friends WHERE follower_id = ?;", [$id], "i");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $following[] = $row["following_id"];
        }
    }

    // Get follower
    $result = rsql("SELECT follower_id FROM Friends WHERE following_id = ?;", [$id], "i");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $follower[] = $row["follower_id"];
        }
    }

    // Get all profile pictures and name of Friend's id
    $temp_arr_tot = array_unique(array_merge($follower, $following));

    $arr_tot = [];
    foreach ($temp_arr_tot as &$e) {
        $arr_tot[] = $e;
    }


    $req_sql = "";
    for ($i = 0; $i < sizeof($arr_tot); $i++) {
        $req_sql .= "id = " . $arr_tot[$i];
        if ($i != sizeof($arr_tot) - 1) {
            $req_sql .= " OR ";
        }
    }

    $infos = [];

    if ($req_sql != "") {
        $result = $conn->query("SELECT id, username, pp FROM Users WHERE $req_sql"); // <-- Regular SQL because not direct data
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $infos[] = [ intval($row["id"]), $row["username"], $row["pp"]];
            }
        }
    }



    // Sending reponse
    $rep = new stdClass();

    $rep->follower  = $follower;
    $rep->following = $following;
    $rep->infos     = $infos;
    $rep->message   = "Lists returned without Problems";
    $JSON           = json_encode($rep);

    echo $JSON;
}

exit;
die;
