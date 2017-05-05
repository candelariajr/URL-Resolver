<?php
/**
 * Created by PhpStorm.
 * User: candelariajr
 * Date: 5/4/2017
 * Time: 5:09 PM
 */
$handler = getHandler();

function getHandler(){
    try{
        return file_get_contents("Config/config.json");
    }catch(Exception $e){
        echo $e->getMessage();
        return "";
    }
}
echo $handler;
$fileName = "";
if($handler != ""){
    try{
        $fileName = json_decode($handler)->{'parameters'}->{'handler'};
    }catch(Exception $e){
        echo "a handler file is not specified in the config.json file";
        $fileName = "";
    }
}
//require("Config/$fileName");