<?php
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "ContactStorage", "contact_storage_pass", "ContactStorageDB");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("SELECT userId,firstName,lastName,phoneNumber,email,occupation,address,notes FROM Contacts WHERE firstName=? AND lastName=?");
        $stmt->bind_param("ss", $inData["firstName"], $inData["lastName"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
        {
            returnWithInfo( $row['id'], $row['firstName'], $row['lastName'], $row['phoneNumber'], $row['email'], $row['email'], $row['occupation'], $row['address'], $row['notes'] );
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
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithSuccess( $message )
    {
        $retValue = '{"message":"' . $message . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>
