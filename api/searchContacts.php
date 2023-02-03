<?php
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "ContactStorage", "contact_storage_pass", "ContactStorageDB");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE userID = ? AND (firstName LIKE %?% OR lastName LIKE %?%)");
        $stmt->bind_param("ss", $inData["search"], $inData["search"]);
        $stmt->execute();
        $result = $stmt->get_result();

        $array = array();

        if ( $row = $result->fetch_assoc() )
        {
            while( $row = $result->fetch_assoc() )
            {
                $array[] = $row;
            }
        }
        else
        {
            returnWithError("No Records Found");
        }

        sendResultInfoAsJson( json_encode( $array ) );

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
