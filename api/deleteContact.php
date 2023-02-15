<?php

    error_reporting(E_ALL);
    ini_set('display_errors', 'on');

    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "ContactStorage", "contact_storage_pass", "ContactStorageDB");
    if( $conn->connect_error )
    {
        returnWithError( "!" . $conn->connect_error );
    }
    else
    {
        $id = intval($inData["id"]);

        $stmt = $conn->prepare("DELETE FROM CONTACTS WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();

        returnWithSuccess("Contact <" . $id . "> deleted successfully");

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
