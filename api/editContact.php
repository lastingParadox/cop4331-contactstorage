<?php
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "ContactStorage", "contact_storage_pass", "ContactStorageDB");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("UPDATE CONTACTS SET firstName = ?, lastName = ?, phoneNumber = ?, email = ?, occupation = ?, address = ?, notes = ? WHERE userId = ?");
        $stmt->bind_param("sssssssi", $inData["firstName"], $inData["lastName"], $inData["phoneNumber"], $inData["email"], $inData["occupation"], $inData["address"], $inData["notes"], $inData["userId"]);
        $stmt->execute();

        returnWithSuccess("Contact edited successfully");

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
        $retValue = '{"message":"' . $message . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>
