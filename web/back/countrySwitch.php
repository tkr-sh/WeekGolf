<?php

// Entry: token, country
// Purpose: Switch the country of an user by it's token
// Output: The token and the id of the new person

$token   = $_POST["t"];
$country = $_POST["c"];
$rep     = new stdClass();

if (isset($token) && isset($country)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";

    $result = rsql("SELECT * FROM Users WHERE UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(country_date) > 5 AND token = ?", [$token], "s");

    if ($result->num_rows > 0) { // Valid time
        
        esql("UPDATE Users SET country = ?, country_date = NOW() WHERE token = ?", [$country, $token], "ss");
        $rep->message = "Country updated Successfuly!";
        $rep->error   = "";
    } else { // Too early
        $correct_token = rsql("SELECT * FROM Users WHERE token = ?", [$token], "s");

        if ($correct_token -> num_rows > 0) {
            $rep->message = "ERROR.";
            $rep->error   = "You already changed it less than 5sec ago";
        } else {
            // Invalid token
            $rep->message = "ERROR.";
            $rep->error   = "Invalid token";
        }
    }
} else {
    $rep->message = "ERROR.";
    $rep->error   = "Country isnt defined";
}//end if

// Send the JSON
$JSON = json_encode($rep);

echo $JSON;

exit;
die;
