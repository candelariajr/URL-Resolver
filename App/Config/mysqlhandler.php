<?php
/**
 * Created by PhpStorm.
 * User: candelariajr
 * Date: 2/2/2017
 * Time: 11:03 AM
 */
require("config.php");
$conn = new mysqli($server, $username, $password, $database);
if($conn->connect_error){
    die("Connection Failed!");
}
