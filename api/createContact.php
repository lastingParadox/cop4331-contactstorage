<?php
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "ContactStorage", "contact_storage_pass", "ContactStorageDB");
    if( $conn->connect_error ) {
        returnWithError( $conn->connect_error );
    } else {
        // userId who is inserting this information
        $userId = intval($inData["userId"]);

        $stmt = $conn->prepare("INSERT into CONTACTS (userId, firstName, lastName, phoneNumber, email, occupation, address, notes) VALUES (?,?,?,?,?,?,?,?)");
        $stmt->bind_param("isssssss", 
            $userId,
            $inData["firstName"], 
            $inData["lastName"], 
            $inData["phoneNumber"], 
            $inData["email"],
            $inData["occupation"],
            $inData["address"],
            $inData["notes"],
        );
        $stmt->execute();    

        $stmt->close();
        $conn->close();

        returnWithSuccess("Contact created successfully");
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

    function returnWithSuccess( $message ) {
        $retValue = '{"message":"' . $message . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>