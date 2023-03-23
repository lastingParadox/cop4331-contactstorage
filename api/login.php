<?php

    error_reporting(E_ALL);
    ini_set('display_errors', 'on');

    $inData = getRequestInfo();
    
    $id = 0;
    $firstName = "";
    $lastName = "";

    $conn = new mysqli("localhost", "ContactStorage", "contact_storage_pass", "ContactStorageDB"); 	
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("SELECT u.id, u.firstName, u.lastName, u.password, s.colorDash, s.colorSide, s.contactView FROM USERS u INNER JOIN SETTINGS s ON u.ID = s.userId WHERE u.username=?;");
        $stmt->bind_param("s", $inData["login"]);
        $stmt->execute();
        $result = $stmt->get_result();

        $row = $result->fetch_assoc();
    
        if( $row && password_verify($inData['password'], $row['password']) )
        {
            returnWithInfo( $row['firstName'], $row['lastName'], $row['id'], $row['colorDash'], $row['colorSide'], $row['contactView'] );
        }
        else
        {
            returnWithError("No Records Found");
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
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
    function returnWithInfo( $firstName, $lastName, $id, $colorDash, $colorSide, $contactView )
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","colorDash":"' . $colorDash . '","colorSide":"' . $colorSide . '",
            "contactView":"' . $contactView . '","error":"","success":"Successfully logged in"}';
        sendResultInfoAsJson( $retValue );
    }
    
?>
