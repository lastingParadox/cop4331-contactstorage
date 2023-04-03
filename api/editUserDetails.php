<?php

    error_reporting(E_ALL);
    ini_set('display_errors', 'on');
    
    $inData = getRequestInfo();
    
    $conn = new mysqli("localhost", "ContactStorage", "contact_storage_pass", "ContactStorageDB");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        // If the clear image button was pressed, remove it
        if (array_key_exists("imageUrl", $inData) && $inData["imageUrl"] == "null") {
            $stmt = $conn->prepare("UPDATE USERS SET firstName = ?, lastName = ?, username = ?, email = ?, imageUrl = NULL WHERE id = ?");
            $stmt->bind_param("ssssi", $inData["firstName"], $inData["lastName"], $inData["username"], $inData["email"], $inData["userId"]);
        }
        // If an image was uploaded, change it
        else if (array_key_exists("imageUrl", $inData)) {
            $stmt = $conn->prepare("UPDATE USERS SET firstName = ?, lastName = ?, username = ?, email = ?, imageUrl = ? WHERE id = ?");
            $stmt->bind_param("sssssi", $inData["firstName"], $inData["lastName"], $inData["username"], $inData["email"], $inData["imageUrl"], $inData["userId"]);
        }
        // If no image was uploaded, leave it alone
        else {
            $stmt = $conn->prepare("UPDATE USERS SET firstName = ?, lastName = ?, username = ?, email = ? WHERE id = ?");
            $stmt->bind_param("ssssi", $inData["firstName"], $inData["lastName"], $inData["username"], $inData["email"], $inData["userId"]);
        }

        try {
            $stmt->execute();
        }
        catch(Exception $e) {
            return returnWithError("Cannot have duplicate username " . $inData["username"]);
        }
        

        returnWithSuccess("User <".$inData['userId']."> edited successfully");

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithSuccess( $message )
    {
        $retValue = '{"success":"' . $message . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>
