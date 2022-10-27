<?php

// Entry: user_id, problem_id, username, points and code
// Purpose: Add points to somebody when they found a bug
// Output: Nothing

$user_id    = $_POST["id"];
$problem_id = $_POST["pid"];
$username   = $_POST["username"];
$points     = $_POST["pts"];
$code       = $_POST["c"];


if (isset($user_id) && isset($username) && isset($points) && isset($code)) {

    include_once "secret.php";

    if ($code == $found_bug_code) {
        
        // Connect to DataBase
        include_once "connectToDatabase.php";

        $problem_name = rsql("SELECT title FROM Problem WHERE id = ?", [$problem_id], "i") -> fetch_assoc()["title"];

        esql("INSERT INTO Activity (title, content, owner_id, activity_date, major) VALUES (CONCAT(?,' received some points because they found an abuse in the test cases'),CONCAT('The abuse was found on  ', ? ,'. ', ?, ' reported an abuse in the test case and was therefore rewarded with ', ?, ' points '), $user_id, NOW(), 1)", [$username, $problem_name, $username, $points], "ssss");
        esql("UPDATE Users SET upgrade_score = upgrade_score + ? WHERE id = ?", [$points, $user_id], "ii");
    }
}


exit;
