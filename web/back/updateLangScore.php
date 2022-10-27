<?php

// Entry: NaN
// Purpose: Update the score of users
// Output: Nothing


// Connecting to DataBase
require_once "connectToDatabase.php";

$sql    = "SELECT id, lotw FROM Problem WHERE update_state = 0 AND NOW() >= date_end;";
$result = $conn->query($sql);

// If one problem isnt updated
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $problem_id = $row["id"];
    $lotw = $row["lotw"] == null ? null : strtolower($row["lotw"]);
    $sql = "UPDATE Problem SET update_state = 1 WHERE id = $problem_id;";

    $conn->query($sql);
}

// If one problem isnt updated
if (isset($problem_id)) {
    // Get all the languages
    $languages = [];
    $sql       = "SELECT * FROM CurrentLang";
    $result    = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($languages, $row["lang"]);
        }
    }

    $correspondance = [
        "c++"        => "cpp",
        "c#"         => "cs",
        "csharp"     => "cs",
        "javascript" => "js"
    ];

    if ($lotw != null)
        $lotw = array_key_exists($lotw, $correspondance) ? $correspondance[$lotw] : $lotw;

    for ($i = 0; $i < sizeof($languages); $i++) {
        $the_lang = array_key_exists($languages[$i], $correspondance) ? $correspondance[$languages[$i]] : $languages[$i];

        $sql    = "SELECT * FROM Golf WHERE problem_id = $problem_id AND lang='".str_replace("js", "node", $the_lang)."' ORDER BY size ASC;";
        $result = $conn->query($sql);

        $user_already_seen = [];
        $size_arr          = [];
        $user_arr          = [];
        $size_lang         = $result->num_rows;

        if ($size_lang > 0) {
            while ($row = $result->fetch_assoc()) {
                if (!in_array($row["owner_id"], $user_already_seen)) {
                    array_push($size_arr, $row["size"]);
                    array_push($user_arr, $row["owner_id"]);
                    array_push($user_already_seen, $row["owner_id"]);
                }
            }
        }

        for ($j = 0 ; $j < sizeof($size_arr); $j++) {
            // rank: The rank of the person
            // same_rank_nb: The nb of person with the same rank (usefull when rank == 1)
            // total: the total of people that tried
            // multiplier: the multiplier coefficient (usefull when rank == 1)
            $rank         = (array_search($size_arr[$j], $size_arr) + 1);
            $same_rank_nb = array_count_values($size_arr)[$size_arr[$j]];
            $total        = sizeof($size_arr);
            $multiplier   = 1;

            if ($rank === 1) {
                $multiplier = min(max((exp(($total / $same_rank_nb) / 70) / 6 + 0.8), 1), 1.25);
            }
            // same_rank < 1% => mutltiplier: 1.25
            // same_rank > 10% => mutltiplier: 1

            $score = round(( 1 + log10($total) / 6 ) * ( $total - $rank + 1 ) / ( $total ) * 1000 * $multiplier);

            if ($lotw != null && $lotw == $the_lang){
                $score = round($score * 2.25);
            }

            $sql = "UPDATE Users SET golf_score = golf_score + $score WHERE id = ".$user_arr[$j];
            $conn->query($sql);
            $sql = "UPDATE Languages SET ".$the_lang."_score = ".$the_lang."_score + $score WHERE owner_id = ".$user_arr[$j];
            $conn->query($sql);
            $sql      = "SELECT username FROM Users WHERE id=".$user_arr[$j];
            $username = $conn->query($sql)->fetch_assoc()["username"];
            $user_id  = $user_arr[$j];

            $from = [
                "cpp",
                "cs",
                "js",
            ];

            $to = [
                "c++",
                "c#",
                "JavaScript",
            ];

            $temp_lang = ucfirst(str_replace($from, $to, $the_lang));
            esql("INSERT INTO Activity (title, content, owner_id, activity_date, major) VALUES(CONCAT(?,' received some points in $temp_lang!'),CONCAT('The week is over! ', ? ,' received $score golf points for his or her performance with $temp_lang '),$user_id, NOW(), 1)", [$username, $username], "ss");
        }
    }
}

exit;
die;
