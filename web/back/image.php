<?php

// Entry: token, image type 
// Purpose: Update the image
// Output: The state of the image

// Client ID of Imgur App 
include_once "secret.php";


$statusMsg = $valErr = ''; 
$status = 'danger'; 
$imgurData = array();


$token = $_POST["t"];
$type_img = $_POST["type"];


 
// If the form is submitted 
if (isset($_POST['submit']) && isset($token) && isset($type_img)) { 

     
    // Validate form input fields 
    if (empty($_FILES["file"]["name"])) { 
        $valErr .= 'Please select a file to upload.<br/>'; 
    } 
     
    // Check whether user inputs are empty 
    if (empty($valErr)) { 
        // Get file info 
        $fileName = basename($_FILES["file"]["name"]); 
        $fileType = pathinfo($fileName, PATHINFO_EXTENSION); 
         
        // Allow certain file formats 
        $allowTypes = array('jpg', 'png', 'jpeg', 'gif'); 
        if (in_array($fileType, $allowTypes)) { 
            // Source image 
            $image_source = file_get_contents($_FILES['file']['tmp_name']); 
             
            // API post parameters 
            $postFields = array('image' => base64_encode($image_source)); 
             
            if (!empty($_POST['title'])) { 
                $postFields['title'] = $_POST['title']; 
            } 
             
            if (!empty($_POST['description'])) { 
                $postFields['description'] = $_POST['description']; 
            }

            // Connect to DataBase
            include_once "connectToDatabase.php";


            if ($type_img === 'pp')
                $sql = "SELECT (UNIX_TIMESTAMP(NOW()) - pp_date > 86400) OR pp_date IS NULL FROM Users WHERE token = ?;";
            else 
                $sql = "SELECT (UNIX_TIMESTAMP(NOW()) - banner_date > 86400) OR banner_date IS NULL FROM Users WHERE token = ?;";
            

            $result = rsql($sql, [$token], "s");
            // If result correct
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    if ($type_img === 'pp')
                        $bool = $row["(UNIX_TIMESTAMP(NOW()) - pp_date > 86400) OR pp_date IS NULL"];
                    else
                        $bool = $row["(UNIX_TIMESTAMP(NOW()) - banner_date > 86400) OR banner_date IS NULL"];
                }
                // If it's been 24hours
                if ($bool == '1') {
                    // Post image to Imgur via API 
                    $ch = curl_init();

                    curl_setopt($ch, CURLOPT_URL, 'https://api.imgur.com/3/image'); 
                    curl_setopt($ch, CURLOPT_POST, TRUE); 
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE); 
                    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Client-ID ' . $IMGUR_CLIENT_ID)); 
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields); 
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    $response = curl_exec($ch);

                    if(curl_errno($ch))
                        echo 'Curl error: '.curl_error($ch);

                    curl_close($ch); 
                    echo $response;
                    
                    // Decode API response to array 
                    $responseArr = json_decode($response); 
                    
                    // Check image upload status 
                    if(!empty($responseArr->data->link)){ 
                        // Here, if everything is correct
                        $imgurData = $responseArr; 

                        $status = 'success'; 
                        $statusMsg = 'The image has been uploaded to Imgur successfully.'; 
                    
                        if ($type_img == 'pp')
                            $sql = "UPDATE Users SET pp = ?, pp_date = UNIX_TIMESTAMP(NOW()) WHERE token = ?;";
                        else
                            $sql = "UPDATE Users SET banner = ?, banner_date = UNIX_TIMESTAMP(NOW()) WHERE token = ?;";

                        $result = rsql($sql, [$imgurData->data->link, $token], "ss");

                    }else{ 
                        echo "<br>".$responseArr."<br>";
                        $statusMsg = 'Image upload failed, please try again after some time.'; 
                    } 
                } else {
                    $statusMsg = "Too recent. You can change your pp every 24h";
                }
            } else {
                $statusMsg = "Bad token"; 
            }
        } else { 
            $statusMsg = 'Sorry, only an image file is allowed to upload.'; 
        } 
    } else { 
        $statusMsg = '<p>Please fill all the mandatory fields:</p>'.trim($valErr, '<br/>'); 
    } 
} else {
    echo "PROBLEM!";
}

echo $statusMsg;

exit;
die;