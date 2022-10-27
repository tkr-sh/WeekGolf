<?php

// Entry: token, id, lang
// Purpose: get the best answer of somebody
// Output: the best answer of the person if no problems

$id    = $_POST["id"];
$lang  = $_POST["l"];
$token = $_POST["t"];

if (isset($id) && isset($lang) && isset($token)) {

    // Connecting to DataBase
    include_once "connectToDatabase.php";


    // Get user id
    $result = rsql("SELECT id FROM Users WHERE token = ?", [$token], "s");

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $owner_id = $row["id"];
        }
    } else {
        echo "Invalid token";
        exit;
    }

    // Get all the languages
    $languages = [];
    $result    = $conn -> query("SELECT * FROM CurrentLang"); // <-- Normal request

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($languages, $row["lang"]);
        }
    }

    $correspondance = [
        "c++"        => "cpp",
        "c#"         => "cs",
        "csharp"     => "cs",
        "javascript" => "node",
    ];



    $code = [];
    $lang = [];

    for ($i = 0; $i < sizeof($languages);$i++) {
        $the_lang = array_key_exists($languages[$i], $correspondance) ? $correspondance[$languages[$i]] : $languages[$i];

        // Get answer
        $result = rsql("SELECT code, lang FROM Golf WHERE owner_id = ? AND problem_id = ? AND lang = ? ORDER BY size ASC LIMIT 1", [$owner_id, $id, $the_lang], "iis");
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                array_push($code, $row["code"]);
                array_push($lang, str_replace("node", "javascript", $row["lang"]));
            }
        }
    }


    // Sending reponse
    $rep = new stdClass();

    if (sizeof($code) > 0) {
        $rep->code  = $code;
        $rep->lang  = $lang;
        $rep->error = "";
    } else {
        $rep->code  = "";
        $rep->error = "No code.";
    }

    $JSON = json_encode($rep);
    echo $JSON;
}

exit;
die;
