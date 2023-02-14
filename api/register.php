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
        $stmt = $conn->prepare("SELECT username FROM USERS WHERE username = ?");
        $stmt->bind_param("s", $inData["username"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if( $result->num_rows > 0 )
        {
            returnWithError("This username is already taken");
        }
        else
        {
            $hash = password_hash($inData["password"], PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT into USERS (firstName, lastName, username, password) VALUES (?,?,?,?)");
            $stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["username"], $hash);
            $stmt->execute();

            returnWithSuccess("User registered successfully");
        }

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
