<?php
/**
 * Created by PhpStorm.
 * User: candelariajr
 * Date: 2/3/2017
 * Time: 12:05 PM
 */

$conn = getHandler();

function getHandler(){
    try{
        file_get_contents("/Config/");
    }catch(Exception $e){
        echo $e->getMessage();
    }
}