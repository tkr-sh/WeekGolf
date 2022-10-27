<?php

// Entry: ip
// Purpose: Get the country of somebody by ip
// Output: The country

$ip = $_POST["ip"];

if (isset($ip)) {
    $json = json_decode(file_get_contents("http://ipwho.is/".$ip), true);


    $country_code = $json['country_code'];


    $rep = new stdClass();

    $rep->country = $country_code;

    $JSON = json_encode($rep);
    echo $JSON;
}

exit;
die;
