<?php
/**
 * Created by PhpStorm.
 * User: candelariajr
 * Date: 2/2/2017
 * Time: 11:03 AM
 */
require("../interface.php");
require("config.php");
class mysqlDatabaseConnector implements databaseConnector{

    public function getParameters($server, $username, $password, $database)
    {
        // TODO: Implement getParameters() method.
    }
}







$conn = new mysqli($server, $username, $password, $database);
$success = false;
$message = "";
if($conn->connect_error){
    $success = false;
    $message = $conn->connect_error;
}else{
    $success = true;
    $message = "Connection Successful";
}
function getConnectionReply(){
    json_encode(array("success" => $success, "message" => $message, "fileName" => __FILE__));
}
