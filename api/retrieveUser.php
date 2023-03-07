<?php

    error_reporting(E_ALL);
    ini_set('display_errors', 'on');

    $inData = getRequestInfo();
    
    $id = 0;
    $firstName = "";
    $lastName = "";
    $outData = Array();

    $conn = new mysqli("localhost", "ContactStorage", "contact_storage_pass", "ContactStorageDB"); 	
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        // Checking if the user exists
        $stmt = $conn->prepare("SELECT firstName, lastName, username, email, imageUrl FROM USERS WHERE id=?");
        $stmt->bind_param("i", $inData["userId"]);
        $stmt->execute();
        $result = $stmt->get_result();

        $row = $result->fetch_assoc();
    
        if( $row )
        {
            $outData['firstName'] = $row['firstName'];
            $outData['lastName'] = $row['lastName'];
            $outData['username'] = $row['username'];
            $outData['email'] = $row['email'];
            $outData['imageUrl'] = $row['imageUrl'];
        }
        else
        {
            returnWithError("User Not Found");
        }

        $stmt->close();

        // Another query to grab the associated settings row
        $stmt = $conn->prepare("SELECT colorSide, colorDash, contactView FROM SETTINGS WHERE userId=?");
        $stmt->bind_param("i", $inData["userId"]);
        $stmt->execute();
        $result = $stmt->get_result();

        $row = $result->fetch_assoc();

        if( $row )
        {
            $outData['colorSide'] = $row['colorSide'];
            $outData['colorDash'] = $row['colorDash'];
            $outData['contactView'] = $row['contactView'];
            returnWithInfo( $outData['firstName'], $outData['lastName'], $outData["username"], $outData["email"], $outData['imageUrl'],
                            $outData['colorSide'], $outData['colorDash'], $outData['contactView'] );
        }
        else
        {
            returnWithError("User Settings Not Found");
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
    
    function returnWithInfo( $firstName, $lastName, $username, $email, $imageUrl, $colorSide, $colorDash, $contactView )
    {
        $retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","username": "' . $username .'","email":"' . $email . '","imageUrl":"' . $imageUrl . '",
            "colorSide":"' . $colorSide .'","colorDash":"' . $colorDash .'","contactView":"' . $contactView .'","error":"","success":"User details retrieved successfully."}';
        sendResultInfoAsJson( $retValue );
    }
    
?>
