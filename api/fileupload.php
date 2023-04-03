<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

$url = "/var/www/html/static/images/media/";

if (isset($_POST["delete"]) && file_exists($url . $_POST["delete"])) {
    unlink($url . $_POST["delete"]);
}

if (isset($_FILES['picture']['name'])) {
    // file name
    $filename = $_FILES['picture']['name'];
    $tempfile = $_FILES['picture']['tmp_name'];

    // file extension
    $file_extension = pathinfo($filename, PATHINFO_EXTENSION);
    $file_extension = strtolower($file_extension);

    // Valid extensions
    $valid_ext = array("jpg","png","jpeg");

    $response = 0;
    if (in_array($file_extension,$valid_ext)) {
        header('Content-type: application/json');
        $location = $url . $filename;
        
        $maxDim = 125;
        list($width, $height, $type, $attr) = getimagesize($tempfile);
        $target_filename = $tempfile;
        $ratio = $width/$height;
        if ($ratio > 1) {
            $new_width = $maxDim;
            $new_height = (int) ($maxDim/$ratio);
        } else {
            $new_width = (int) ($maxDim*$ratio);
            $new_height = $maxDim;
        }
        $src = imagecreatefromstring(file_get_contents($tempfile));
        $dst = imagecreatetruecolor($new_width, $new_height);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
        imagedestroy($src);
        
        if (imagepng($dst, $location)) {
            imagedestroy($dst);

            if (isset($_POST["delete"]))
                echo '{"oldFile":"' . $_POST["delete"] . '","newFile":"' . $filename . '"}';
            else
                echo '{"newFile":"' . $filename . '"}';
        }
        else {
            echo '{"error":"Unable to send file."}';
        };
    }
    else {
        echo '{"error":"File is of wrong type."}';
    }
    
    exit;
}

echo '{"error":"Unable to find file."}';

exit;
?>
