<?php
/**
 * Created by PhpStorm.
 * User: candelariajr
 * Date: 5/4/2017
 * Time: 5:09 PM
 */
$handler = getHandler();
$conn = "";

function getHandler(){
    try{
        return file_get_contents("Config/config.json");
    }catch(Exception $e){
        echo $e->getMessage();
        return "";
    }
}
$fileName = "";
if($handler != ""){
    try{
        $fileName = json_decode($handler)->{'parameters'}->{'handler'};
        require("Config/$fileName");
    }catch(Exception $e){
        echo "a handler file is not specified in the config.json file";
        $fileName = "";
    }
}

if(isset($_GET['action'])){
    $actionString = $_GET['action'];
    if($actionString == "getDates"){
        generateDates();
    }
}

function generateDates(){
    GLOBAL $conn;
    $query = "
(	select 
		\"max_date\" as date_type, 
		report_date as report_date,
        concat(month(report_date), '/', day(report_date), '/', year(report_date)) as formatted_date
	from 
		url_history.history_table 
	order by 
		report_date desc 
	limit 1) 
union
(
	select 
		\"min_date\" as date_type, 
        report_date,
        concat(month(report_date), '/', day(report_date), '/', year(report_date)) as formatted_date
	from 
		url_history.history_table 
	where 
		id is not null 
	order by 
		report_date asc 
	limit 1) 	 ";

    $result = $conn->query($query);
    $data = array();
    while($row = $result->fetch_assoc()){
        $data[] = json_encode($row);
    }
    echo json_encode($data);
}
