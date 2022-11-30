<?php

# Entry: lang, code, id (problem), token
# Purpose: Execute some code and update things
# Output: The success of the code and other informations

$lang = $_POST["lang"];
$code = $_POST["code"];
$problem_id = $_POST["id"];
$token = $_POST["t"];

$lang = str_replace("javascript", "node", $lang);
$lang = str_replace("golang", "go", $lang);

error_reporting(E_ERROR | E_PARSE); // Cancel Warnings

if (isset($code) && isset($problem_id) && isset($lang)){


    // Connecting to DataBase
    include_once "connectToDatabase.php";
    include_once "secret.php";


    $last_challenge_id = $conn->query("SELECT id FROM Problem WHERE UNIX_TIMESTAMP(date_enable) <= UNIX_TIMESTAMP(NOW()) ORDER BY id DESC LIMIT 1")->fetch_assoc()["id"];

    // If the ID is invalid
    if ($last_challenge_id < $problem_id || $problem_id < 1){
        echo "Invalid ID";
        exit;
    }


    $case_nb = rsql("SELECT show_case, random_case FROM Problem WHERE id = ?;", [$problem_id], "i") -> fetch_assoc();
    $show_case = $case_nb["show_case"];
    $random_case = $case_nb["random_case"];


    // Get all inputs
    $result = rsql("SELECT * FROM Solutions WHERE problem_id = ?;", [$problem_id], "i");

    $arr =        array();
    $t_arr =      array();
    $expected =   array();
    $t_expected = array();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            array_push($t_expected, $row["expected_output"]);
            array_push($t_arr, $row["input"]);
        }
    }

    for ($i = 0; $i < $show_case; $i++){
        $arr[] = $t_arr[$i];
        $expected[] = $t_expected[$i];

        unset($t_arr[$i]);
        unset($t_expected[$i]);
    }


    for ($i = 0; $i < $random_case && !empty($t_arr); $i++){
        $t_arr = array_values($t_arr);
        $t_expected = array_values($t_expected);
        $random_nb_arr = rand(0, sizeof($t_arr) - 1);
        $arr[] = $t_arr[$random_nb_arr];
        $expected[] = $t_expected[$random_nb_arr];

        array_splice($t_arr, $random_nb_arr, 1);
        array_splice($t_expected, $random_nb_arr, 1);
    }
    
    
    $success = true;
    $output =      array();
    $error_arr =   array();
    $success_arr = array();
    $nb_input =    sizeof($arr);
    
    // Sending request to the vm that executes the code
    $rep = new stdClass();
    $request = "https://vmtest.week.golf/?lang=$lang&countInput=$nb_input&code=".noCarriage(rawurlencode($code));
    
    for ($i = 0; $i < $nb_input; $i++){
        $request .= "&input$i=".rawurlencode($arr[$i]);
    }

    
    // Get the answer of the request
    $ret =  file_get_contents($request);
    $json = json_decode($ret);
    $data = $json -> data;
    
    // See if the answers are correct
    for ($i = 0; $i <  $nb_input && isset($ret); $i++){
        // Deleting the last char if its a \n or \0 or space
        $ouput_txt = @deleteLastChar(str_replace([" \n", " \0"], ["\n", "\0"],@deleteLastChar(rawurldecode($data[$i]->out))));
        
        $output[] = $ouput_txt;
        $error_arr[] = $data[$i]->err == null ? rawurldecode($data[$i]->err) : $data[$i]->err;
        
        $success_arr[] = $ouput_txt === $expected[$i];
        $success &= ($ouput_txt === $expected[$i]);
    }

    if (!isset($ret)){
        $success = false;
        for ($i = 0; $i < $nb_input; $i++){
            $error_arr[$i] = "Compilation error.\nTry to see if there is no compilation problems like ';' missing for example";
        }
    }

    // Custom ASCII table if the language has its own encoding table
    if ($lang != "vyxal" && $lang != "jelly" && $lang != "apl" && $lang != "bqn"){
        $length_of_code = mb_strlen(str_replace("\r\n","\n",$code), '8bit');
    } else {
        $length_of_code = 0;

        switch ($lang) {
            case "vyxal":
                $SBCS = "λƛ¬∧⟑∨⟇÷×«\n»°•ß†€½∆ø↔¢⌐æʀʁɾɽÞƈ∞¨ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]`^_abcdefghijklmnopqrstuvwxyz{|}~↑↓∴∵›‹∷¤ð→←βτȧḃċḋėḟġḣḭŀṁṅȯṗṙṡṫẇẋẏż√⟨⟩‛₀₁₂₃₄₅₆₇₈¶⁋§ε¡∑¦≈µȦḂĊḊĖḞĠḢİĿṀṄȮṖṘṠṪẆẊẎŻ₌₍⁰¹²∇⌈⌊¯±₴…□↳↲⋏⋎꘍ꜝ℅≤≥≠⁼ƒɖ∪∩⊍£¥⇧⇩ǍǎǏǐǑǒǓǔ⁽‡≬⁺↵⅛¼¾Π„‟";
                break;
            case "apl":
                $SBCS = "⌶%'⍺⍵_abcdefghijklmnopqrstuvwxyz¯.⍬0123456789⊢\$∆ABCDEFGHIJKLMNOPQRSTUVWXYZ?⍙ÁÂÃÇÈÊËÌÍÎÏÐÒÓÔÕÙÚÛÝþãìðòõ{}⊣⌷¨ÀÄÅÆ⍨ÉÑÖØÜßàáâäåæçèéêëíîïñ[/⌿\\⍀<≤=≥>≠∨∧-+÷×?∊⍴~↑↓⍳○*⌈⌊∇∘(⊂⊃∩∪⊥⊤|;,⍱⍲⍒⍋⍉⌽⊖⍟⌹!⍕⍎⍫⍪≡≢óôöø\"#&┘┐┌└┼─├┤┴┬│@ùúû^ü`:⍷⋄←→⍝)]⎕⍞⍣\n ⊆⍠⍤⌸⌺⍸⍥⍢√⊇…⌾⍮⍭⍧⍛";
                break;
            case "jelly":
                $SBCS = "¡¢£¤¥¦©¬®µ½¿€ÆÇÐÑ×ØŒÞßæçðıȷñ÷øœþ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¶\n°¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ƁƇƊƑƓƘⱮƝƤƬƲȤɓƈɗƒɠɦƙɱɲƥʠɼʂƭʋȥẠḄḌẸḤỊḲḶṂṆỌṚṢṬỤṾẈỴẒȦḂĊḊĖḞĠḢİĿṀṄȮṖṘṠṪẆẊẎŻạḅḍẹḥịḳḷṃṇọṛṣṭ§Äẉỵẓȧḃċḋėḟġḣŀṁṅȯṗṙṡṫẇẋẏż«»‘’“”";
                break;
            case "bqn":
                $SBCS = "\n\r\t !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~×÷⋆√⌊⌈¬∧∨≠≤≥≡≢⊣⊢⥊∾≍⋈↑↓↕«»⌽⍉⍋⍒⊏⊑⊐⊒∊⍷⊔˙˜˘¨⌜⁼´˝∘○⊸⟜⌾⊘◶⎉⚇⍟⎊⋄⇐←↩⟨⟩‿·𝕊𝕏𝕎𝔽𝔾𝕤𝕩𝕨𝕗𝕘π∞¯•";
                break;
        }

        foreach (preg_split('//u', $code, -1, PREG_SPLIT_NO_EMPTY) as $char){
            if (strpos($SBCS, $char) !== false){
                $length_of_code += 1;
            } else {
                $length_of_code += 2;
            }
        }
    }

    
    // Select the id of the user by its token
    $result = rsql("SELECT id, username FROM Users WHERE token = ?;", [$token], "s");
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $user_id = $row["id"];
            $username = $row["username"];
        }
    }
    

    // C# problem...
    $lang = str_replace("sharp","s",$lang);

    // Get previous best answer
    $best_size = 9999999;
    $result = rsql("SELECT size, owner_id FROM Golf WHERE problem_id = ? AND lang = ? ORDER BY size ASC, date_submit ASC LIMIT 1;", [$problem_id, $lang], "is");
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $best_size = $row["size"];
            $best_score_user = rsql("SELECT username FROM Users WHERE id = ?", [$row["owner_id"]], "i")->fetch_assoc()["username"];
        }
    }
    
    // Get the name of the problem
    $problem_name = rsql("SELECT title FROM Problem WHERE id = ?", [$problem_id], "i")->fetch_assoc()["title"];

    if ($success){
        $result = rsql("SELECT * FROM Golf WHERE problem_id = ? AND owner_id = ? AND size <= ? AND lang = ?;", [$problem_id, $user_id, $length_of_code, $lang], "iiis");
        if ($result->num_rows == 0) {
            // $code = str_replace("'", "\'",$code);
            $code = str_replace("\r\n","\n",$code);

            // Compute the numbers of players
            $already_seen = array();
            $result = rsql("SELECT owner_id FROM Golf WHERE problem_id = ? AND lang = ?;", [$problem_id, $lang], "is");
            $total_players = 0;
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    if (!in_array($row["owner_id"], $already_seen)){
                        $already_seen[] = $row["owner_id"];
                        $total_players++;
                    }
                }
            }

            $sql_arr = [$code, $length_of_code, $lang, $user_id, $problem_id, $total_players];
            esql("INSERT INTO Golf (code, size, lang, owner_id, problem_id, date_submit, nb_players) VALUES(?, ?, ?, ?, ?, UNIX_TIMESTAMP(NOW()), ?);", $sql_arr, "sisiii");


            $tranform = ["cpp", "cs","node"];
            $to = ["c++","c#","JavaScript"];
            $temp_lang = ucfirst(str_replace($tranform,$to,$lang));
            esql("INSERT INTO Activity (title, content, owner_id, activity_date) VALUES( CONCAT( ?  , ' made a new score with $temp_lang!'), CONCAT('New personal score on \"$problem_name\" with $temp_lang by ', ? ,' ! With a total of: $length_of_code bytes! '), $user_id, NOW())", [$username, $username], "ss");
        }
    }




    // If it's a new best size
    $result = rsql("SELECT date_end FROM Problem WHERE id = ? AND UNIX_TIMESTAMP(date_end) <= UNIX_TIMESTAMP(NOW())", [$problem_id], "i");
    if ($result -> num_rows > 0 && $success) { // If it's the end

        if ($length_of_code < $best_size){ // If it's the new best ! => add points to this person

            // First, get date of end
            $result = rsql("SELECT UNIX_TIMESTAMP(date_end) FROM Problem WHERE id = ?;", [$problem_id], 'i');
            $date_end = -1;
            if ( $result -> num_rows > 0 ) {
                while( $row = $result -> fetch_assoc() ) {
                    $date_end = $row["UNIX_TIMESTAMP(date_end)"];
                }
            }


            // Get solutions after date of end
            $size_arr = array();
            $owner_id_arr = array();
            $nb_players_arr = array();

            $code_size = 999999;
            $result = rsql("SELECT * FROM (SELECT * FROM Golf ORDER BY date_submit ASC) AS T1 WHERE problem_id = ? AND ? < date_submit AND lang = ?;", [$problem_id, $date_end, $lang], "iss");
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    if ($row["size"] < $code_size){
                        $code_size = $row["size"];
                        $size_arr[] = intval($row["size"]);
                        $owner_id_arr[] = intval($row["owner_id"]);
                        $nb_players_arr[] = intval($row["nb_players"]);
                    }
                }
            }


            // For no abuse of the algorithm
            if (!empty($size_arr)){
                $n = sizeof($size_arr) - 1;
                while ($owner_id_arr[$n] == $user_id && $n >= 0){
                    $n--;
                }
            }



            // Compute the points that will be added 
            if (empty($size_arr) || $n == sizeof($size_arr) - 1){ // If it's his/her first response in a row
                $points_add = calculateNumberOfPoint($length_of_code, $best_size, $total_players);
            } else if ($n == -1) { # If all responses come from him
                // Get Best solution before date of end
                $result = rsql("SELECT * FROM Golf WHERE problem_id = ? AND ? > date_submit AND lang = ? ORDER BY size ASC LIMIT 1", [$id, $date_end, $lang], "iss");
                $first_size = 0;
                $first_nb_players = 0;
                // Get solutions
                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    $first_size = intval($row["size"]);
                    $first_nb_players = intval($row["nb_players"]);
                }#            v-------- Calculate the new score                                     v---------  Calculate the initial score that have been added
                $points_add = calculateNumberOfPoint($length_of_code, $best_size, $total_players) - calculateNumberOfPoint($best_size, $first_size, $first_nb_players);
            } else { // If it's some responses in a row that this happen
                #             v-------- Calculate the new score                                     v---------  Calculate the previous score that have been added
                $points_add = calculateNumberOfPoint($length_of_code, $best_size, $total_players) - calculateNumberOfPoint($best_size, $size_arr[$n], $nb_players_arr[$n]);
                $rep -> moreinfo = "points add: $points_add\nNew:". calculateNumberOfPoint($length_of_code, $best_size, $total_players)."\nPrevious:".calculateNumberOfPoint($best_size, $size_arr[$n], $nb_players_arr[$n]);
            }

            $temp_lang = ucfirst(str_replace($tranform,$to,$lang));
            $diff = $best_size - $length_of_code;
            $diff = $diff > 1000 ? 0 : $diff;
            $best_size = $best_size > 10000 ? "None" : $best_size;
            $best_score_user = $best_size > 10000 ? "nobody" : $best_score_user;
            $bytes = "byte" . ($diff != 1 ? "s" : "");

            esql("INSERT INTO Activity (title, content, owner_id, activity_date, major) VALUES(CONCAT('[$temp_lang] - ', ? ,' made an upgrade with $temp_lang!'), CONCAT('An upgrade on \"$problem_name\" with $temp_lang by ',  ?, ' has been made! With a total of: $length_of_code bytes! The previous score was $best_size bytes by ', ?, ' (Diff: $diff bytes)'),$user_id, NOW(), 2)", [$username, $username, $best_score_user], "sss");


            esql("UPDATE Users SET upgrade_score = upgrade_score + ? WHERE id = ?;", [$points_add, $user_id], "ii");
            $sql = "UPDATE Languages SET ".str_replace("node","js",$lang)."_score = ".str_replace("node","js",$lang)."_score + $points_add WHERE owner_id = $user_id;";
            $conn->query($sql);


            // Set post fields
            $post = [
                'dev_code' => DEV_CODE,
                'title' => "$username made an upgrade with $temp_lang!",
                'params' => [
                    "lang" => strtolower($temp_lang),
                    "username" => $username,
                    "new_size" => $length_of_code,
                    "problem_name" => $problem_name,
                    "before_size" => $best_size,
                    "before_username" => $best_score_user,
                    "diff" => $diff
                ],
                "upgrade" => 1
            ];

            discordWebHook($post);
        }

    } else if ($length_of_code < $best_size  && $success){ // Not the end but record
        $tranform = ["cpp", "cs", "node"];
        $to = ["c++", "c#", "javascript"];
        $temp_lang = ucfirst(str_replace($tranform,$to,$lang));
        $diff = $best_size - $length_of_code; // Difference
        $diff = $diff > 1000 ? 0 : $diff; // Case no previous score
        $best_size = $best_size > 10000 ? "None" : $best_size; // Case no previous score
        $bytes = "byte" . ($diff > 1 ? "s" : "");
        $best_score_user = $best_size > 10000 ? "nobody" : $best_score_user;



        esql("INSERT INTO Activity (title, content, owner_id, activity_date, major) VALUES(CONCAT('[$temp_lang] - ', ?, ' made a new best score with $temp_lang!'),CONCAT('New record on the puzzle of the week, \"$problem_name\", with $temp_lang by ', ? ,' ! With a total of: $length_of_code bytes! The previous score was $best_size bytes by ', ?, ' (Diff: $diff $bytes)'),$user_id, NOW(), 2)", [$username, $username, $best_score_user], "sss");

        // Set post fields
        $post = [
            'dev_code' => DEV_CODE,
            'title' => "$username made a new best score with $temp_lang!",
            'params' => [
                "lang" => strtolower($temp_lang),
                "username" => $username,
                "new_size" => $length_of_code,
                "problem_name" => $problem_name,
                "before_size" => $best_size,
                "before_username" => $best_score_user,
                "diff" => $diff
            ],
            "upgrade" => 0
        ];

        discordWebHook($post);
    }

    if (!isset($ret)) $success = false;

    $rep -> success = $success?"SUCCEED":"FAIL";
    $rep -> inputs = array_slice($arr, 0, $show_case);
    $rep -> expected = array_slice($expected, 0, $show_case);
    $rep -> obtained = array_slice($output, 0, $show_case);
    $rep -> success_arr = array_slice($success_arr, 0, $show_case);
    $rep -> error = array_slice($error_arr, 0, $show_case);
    $rep -> len = $show_case;


    $JSON = json_encode($rep);
    echo $JSON;
}


function deleteLastChar($str){
    if ($str[-1] == "\n" || $str[-1] == "\0" || $str[-1] == " "){
        if ($str[-2] == "\n" || $str[-2] == "\0" || $str[-2] == " "){
            return @deleteLastChar(substr($str, 0, strlen($str) - 1));
        } else {
            return substr($str, 0, strlen($str) - 1);
        }
    } else {
        return $str;
    }
}


function calculateNumberOfPoint($new_bytes_nb, $before_bytes_nb, $total){

    $diff = $before_bytes_nb - $new_bytes_nb;
    $score = log(min($diff, 100) + 10, 5) * 3600 * log(1 + $total/150);

    return max($score, 0);
}


function noCarriage($str){
    return str_replace("%0D","",$str);
}


function discordWebHook($post){
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://week.golf/discordNote.php");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));

    curl_exec($ch);

    curl_close($ch);
}

exit;
die;
