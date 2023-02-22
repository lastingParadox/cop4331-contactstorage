<?php

error_reporting(E_ALL);
ini_set('display_errors', 'on');

if(isset($_FILES['picture']['name'])){
   // file name
   $filename = $_FILES['picture']['name'];

   // file extension
   $file_extension = pathinfo($filename, PATHINFO_EXTENSION);
   $file_extension = strtolower($file_extension);

   // Valid extensions
   $valid_ext = array("jpg","png","jpeg");

   $response = 0;
   if(in_array($file_extension,$valid_ext)) {
      $location = "/var/www/html/static/images/media/".$filename;
      // Upload file
      header('Content-type: application/json');
      if(move_uploaded_file($_FILES['picture']['tmp_name'], $location)) {
        echo '{"success":"' . $filename . '"}';
      }
      else {
        echo '{"error":"Unable to send file."}';
      }
   }
   exit;
}

echo '{"error":"Unable to find file."}';

exit;
?>
