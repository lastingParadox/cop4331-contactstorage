<?php
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "ContactStorage", "contact_storage_pass", "ContactStorageDB");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {

        $searchParam = $inData["search"];
        $userId = intval($inData["userId"]);

        $stmt = $conn->prepare("SELECT * FROM CONTACTS WHERE userId = ? AND (firstName LIKE '%{$searchParam}%' OR lastName LIKE '%{$searchParam}%')");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        $array = array();

        if( $result->num_rows > 0 )
        {
            while( $row = $result->fetch_assoc() )
            {
                $array[] = $row;
            }

            sendResultInfoAsJson( json_encode( $array ) );
        }
        else 
        {
            returnWithError("No Records Found >> '%{$searchParam}%' <<" . $result->num_rows . ">> " . $inData['userId']);
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
        $retValue = '{"message":"' . $message . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>
