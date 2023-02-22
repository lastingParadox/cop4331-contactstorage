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
        if ($inData["imageURL"]) {
            $stmt = $conn->prepare("UPDATE CONTACTS SET firstName = ?, lastName = ?, phoneNumber = ?, email = ?, occupation = ?, address = ?, imageUrl = ? WHERE id = ?");
            $stmt->bind_param("sssssssi", $inData["firstName"], $inData["lastName"], $inData["phoneNumber"], $inData["email"], $inData["occupation"], $inData["address"], $inData["imageUrl"], $inData["id"]);
        }
        else {
            $stmt = $conn->prepare("UPDATE CONTACTS SET firstName = ?, lastName = ?, phoneNumber = ?, email = ?, occupation = ?, address = ? WHERE id = ?");
            $stmt->bind_param("ssssssi", $inData["firstName"], $inData["lastName"], $inData["phoneNumber"], $inData["email"], $inData["occupation"], $inData["address"], $inData["id"]);
        }
        $stmt->execute();

        returnWithSuccess("Contact <".$inData['id']."> edited successfully");

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
