<?php

    error_reporting(E_ALL);
    ini_set('display_errors', 'on');

    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "ContactStorage", "contact_storage_pass", "ContactStorageDB");
    if( $conn->connect_error ) {
        returnWithError( $conn->connect_error );
    } else {
        // userId who is inserting this information
        $userId = intval($inData["userId"]);

        $stmt = $conn->prepare("INSERT into CONTACTS (userId, firstName, lastName, phoneNumber, email, occupation, address, imageUrl) VALUES (?,?,?,?,?,?,?,?)");
        $stmt->bind_param("isssssss",
            $userId,
            $inData["firstName"], 
            $inData["lastName"],
            $inData["phoneNumber"],
            $inData["email"],
            $inData["occupation"],
            $inData["address"],
            $inData["imageUrl"]
        );
        $stmt->execute();

        $stmt->close();

        $id = $conn->insert_id;

        $conn->close();

        returnWithSuccess("Contact created successfully [userId: " . $userId . "]", $id);
    }

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj ) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err ) {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithSuccess( $message, $id ) {
        $retValue = '{"success":"' . $message . '","contactId":"' . $id . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>
