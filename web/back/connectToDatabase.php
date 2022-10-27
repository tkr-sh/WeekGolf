<?php

    
    include_once "secretDatabase.php";

    $conn = new mysqli($server, $user, $pass, $db);

    if ($conn -> connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $conn->set_charset('utf8mb4');


    function esql($str, $params, $datatype) {

        // Execute SQL (ESQL) //

        // Datatype can have
        // 'i': int
        // 'd': decimal
        // 's': string
        global $conn;

        if (!isset($str) || !isset($params) || !isset($datatype) || sizeof($params) !== strlen($datatype)) {
            echo "Problem. Bad argument type.";
            return false;
        }


        $sql = $conn->prepare($str);
        $sql->bind_param($datatype, ...$params);
        $sql->execute();
    }


    function rsql($str, $params, $datatype) {

        // Return SQL (RSQL) //

        // Datatype can have
        // 'i': int
        // 'd': decimal
        // 's': string
        global $conn;

        if (!isset($str) || !isset($params) || !isset($datatype) || sizeof($params) !== strlen($datatype)) {
            echo "Problem. Bad argument type.";
            return false;
        }


        $sql = $conn->prepare($str);
        $sql->bind_param($datatype, ...$params);
        $sql->execute();

        $result = $sql->get_result();

        return $result;
    }

?>