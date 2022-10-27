<?php

// Entry: name, pwd
// Purpose: Login a user
// Output: The token of the user is password is correct


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    include_once "secret.php"; // Import salt

    // Connect to DataBase
    include_once "connectToDatabase.php";


    $name = $_POST["name"];
    $pwd  = $_POST["pwd"];

    if (isset($name)) {
        $result = rsql("SELECT pwd, token FROM Users WHERE username = ? OR email = ?", [$name, $name], "ss");
        $tot    = '';
        $token  = '';


        $rep = new stdClass();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $tot   = $row['pwd'];
                $token = $row['token'];

                // If password is correct
                if ( $password_correct ) {
                    
                    // Send the JSON
                    $rep->token    = $token;
                    $rep->username = $name;
                    $rep->message  = "Logged in successfuly";
                    $rep->error    = "";

                    $JSON = json_encode($rep);

                    echo $JSON;
                    die;
                    exit;
                }
            }

            // Send the JSON
            $rep->token    = '';
            $rep->username = '';
            $rep->message  = "ERROR.";
            $rep->error    = "Bad Password";

            $JSON = json_encode($rep);

            echo $JSON;
        } else {
            $rep->token    = '';
            $rep->username = '';
            $rep->message  = "ERROR.";
            $rep->error    = "No user with that name or email";

            $JSON = json_encode($rep);

            echo $JSON;
        }
    }
}

exit;
die;
