<?php

// Entry: lang
// Purpose: Get the color of a language
// Output: The color

$lang = $_POST["lang"];

if (isset($lang)) {

    // Connect to Database
    require_once "connectToDatabase.php";

    // Request for info
    $result = rsql("SELECT color FROM ColorLang WHERE lang = ?", [$lang], "s");

    if ($result -> num_rows > 0){
        $color = $result -> fetch_assoc()["color"];
        echo $color;
    } else {
        echo "Bad language name";
    }
} else {
    echo "Bad request";
}



die;