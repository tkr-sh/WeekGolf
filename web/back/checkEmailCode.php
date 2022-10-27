<?php

// Entry: email, code
// Purpose: Check if the email and code correspond. Create an account if they did.
// Output: The token and the id of the new person

$email = $_POST["email"];
$code  = $_POST["code"];

include_once "secret.php";


// Create a Random string
function generateRandomString($length) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';

    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, ($charactersLength - 1))];
    }

    return $randomString;
}


if (isset($email) && isset($code)) {

    // Connect To Database
    include_once "connectToDatabase.php";

    $response = rsql("SELECT username, pwd, country FROM TempUser WHERE email = ? AND code = ?", [$email, $code], "ss");

    if ($response -> num_rows > 0) {
        while ($row = $response->fetch_assoc()) {
            $name    = $row["username"];
            $pwd     = $row["pwd"];
            $country = $row["country"];
        }

        if (strlen($country) !== 2) {
            $country = "XX";
        }


        $token;
        // Detect if a Token is already taken:
        do {
            $token        = generateRandomString(64);
            $sql          = "SELECT token FROM Users WHERE token = '$token'";
            $unique_token = true;

            $result       = $conn->query($sql);
            $unique_token = $result->num_rows == 0;
        } while (!$unique_token);


        $rep = new stdClass();
        if (isset($email) && isset($name) && isset($pwd)) {
            if (strlen($pwd) > 5 && strlen($pwd) < 33 && strlen($user) > 2 && strlen($user) < 32) {
                // Verification that Email and name arent taken.
                $result = rsql("SELECT * FROM Users WHERE username = ? OR email = ?;", [$name, $email], "ss");

                if ($result->num_rows > 0) {
                    // If already exists
                    $rep->token    = '';
                    $rep->username = '';
                    $rep->message  = "ERROR.";
                    $rep->error    = "Name or E-mail already taken.";

                    $JSON = json_encode($rep);

                    echo $JSON;
                } else {
                    // Else, if every thing OK
                    
                    // Encrypting the password //


                    $t = rsql("INSERT INTO Users (email, bio, pwd, username, country, github, discord ,token, verification_code)
                    VALUES( ?, '', ?, ?, ?, NULL, NULL, ?, ?)", [$email, $hash, str_replace("<","",$name), $country, $token, $code], "ssssss");


                    // Get the ID Of account
                    $result = rsql("SELECT id, token FROM Users WHERE username = ?;", [$name], "s");

                    if ($result->num_rows > 0) {
                        while ($row = $result->fetch_assoc()) {
                            $id    = $row["id"];
                            $token = $row["token"];
                        }
                    }

                    // Languages
                    esql("INSERT INTO Languages (owner_id) VALUES(?)", [$id], "i");

                    // Activity
                    esql("INSERT INTO Activity (title, content, owner_id, activity_date) VALUES (CONCAT(?,' created an Account!'), 'Happy to see you! Hope you will like Weekgolf!', $id, NOW())", [$name], "s");
                    esql("DELETE FROM TempUser WHERE email = ? AND code = ?", [$email, $code], "ss");


                    $rep->token    = $token;
                    $rep->id       = $id;
                    $rep->username = $name;
                    $rep->message  = "New Account created successfuly";
                    $rep->error    = "";

                    $JSON = json_encode($rep);

                    echo $JSON;
                }//end if
            } else {
                $rep->token    = '';
                $rep->username = '';
                $rep->message  = "ERROR.";
                $rep->error    = "Not the good size and you know it";

                $JSON = json_encode($rep);

                echo $JSON;
            }//end if
        }//end if
    } else {
        echo "Bad code.";
    }//end if
} else {
    echo "Invalide Request.";
}//end if

exit();
