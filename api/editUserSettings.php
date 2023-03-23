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
        $stmt = $conn->prepare("UPDATE SETTINGS SET colorSide = ?, colorDash = ?, contactView = ? WHERE userId = ?");
        $stmt->bind_param("sssi", $inData["colorSide"], $inData["colorDash"], $inData["contactView"], $inData["userId"]);
        $stmt->execute();

        returnWithSuccess($inData["colorDash"], $inData["colorSide"], $inData["contactView"]);

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

    function returnWithSuccess( $colorDash, $colorSide, $contactView )
    {
        $retValue = '{"colorDash":"' . $colorDash . '","colorSide":"' . $colorSide . '","contactView":"' . $contactView . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>
