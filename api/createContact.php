<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "ContactStorage", "contact_storage_pass", "ContactStorageDB");
    if( $conn->connect_error ) {
        returnWithError( $conn->connect_error );
    } else {

        // Note To Self: insert the below information into the key with userId userId
        $userId = $inData["userId"];

        $stmt = $conn->prepare("INSERT into CONTACTS (firstName, lastName, phoneNumber, email, occupation, address, notes) VALUES (?,?,?,?,?,?,?,?)");
        $stmt->bind_param("sssssss", 
            $inData["firstName"], 
            $inData["lastName"], 
            $inData["phoneNumber"], 
            $inData["email"],
            $inData["occupation"],
            $inData["address"],
            $inData["notes"],
        );
        $stmt->execute();    

        returnWithSuccess("Contact created successfully");

        $stmt->close();
        $conn->close();
    }

    function sendResultInfoAsJson( $obj ) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err ) {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithSuccess( $message ) {
        $retValue = '{"message":"' . $message . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>