<?php
/**
 * Created by PhpStorm.
 * User: candelariajr
 * Date: 1/30/2017
 * Time: 7:09 PM
 */
/**
$outputVar = array("url" => "http://www.dawsonera.com/depp/reader/protected/external/AbstractView/S9780253016515",
    "reply" => "666",
    "redirect" => "https://www.dawsonera.com/depp/reader/protected/external/AbstractView/S9780253016515");
echo (json_encode($outputVar));
**/

/**
 * Created by PhpStorm.
 * User: candelariajr
 * Date: 8/25/2016
 * Time: 11:00 AM
 */

//validateUrl("http://linc.state.nc.us/"); // -23
//validateUrl("http://www.tren.com"); //-4
//validateUrl("http://www.dawsonera.com/depp/reader/protected/external/AbstractView/S9780253016515"); //301
//validateUrl("http://digitool.hbz-nrw.de:1801/webclient/DeliveryManager?pid=4071441&custom_att_2=simple_viewer"); //302
//validateUrl("http://www.glopad.org/pi/index.php"); //403
//validateUrl("https://www.peterlang.com/exportdatas/exportfiles/onix/intro/9783034317764_leseprobe01.pdf"); //404
//validateUrl("http://www.thecommononline.org/home"); //500
//validateUrl("http://netserf.org");


//$url = "http://www.tren.com";
//$url = "http://www.tren.com";
//$url = "http://netserf.org";
//$url = "http://www.tren.com";
        //https://www.dawsonera.com/depp/reader/protected/external/AbstractView/S9780253016515
//$url = "https://www.peterlang.com/exportdatas/exportfiles/onix/intro/9783034317764_leseprobe01.pdf";

$url ="http://www.dawsonera.com/depp/reader/protected/external/AbstractView/S9780253016515";

if(isset($_GET['url'])){
    $url = $_GET['url'];
}


validateUrl($url);

function validateUrl($url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_HTTPGET, true);
    //curl_setopt($ch, CURLOPT_HTTPHEADER, array("User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0"));
    curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
    $response = curl_exec($ch);
    //this shit is to be modified!
    //move this- modularize it!
    $headers = get_headers_from_curl_response($response);
    if(sizeof($headers[0]) == 1){
        //printHeaders($headers[0]);
        generate404Reply();
    }else{
        printHeaders($headers[0]);
        //generateJSONReply($headers[0]);
    }
}

function get_headers_from_curl_response($headerContent){
    $headers = array();
    // Split the string on every "double" new line.
    $arrRequests = explode("\r\n\r\n", $headerContent);
    //print_r($arrRequests);

    // Loop of response headers. The "count() -1" is to
    //avoid an empty row for the extra line break before the body of the response.
    for ($index = 0; $index < 1; $index++) {//count($arrRequests) -1

        foreach (explode("\r\n", $arrRequests[$index]) as $i => $line)
        {
            if ($i === 0)
                $headers[$index]['http_code'] = $line;
            else
            {
                list ($key, $value) = explode(': ', $line);
                $headers[$index][$key] = $value;
            }
        }
    }
    return $headers;
}

function generate404Reply(){
    GLOBAL $url;
    $jsonOutput = json_encode(array("url" => "$url", "reply" => "EMPTY"));
    echo $jsonOutput;

}

function printHeaders($headers){
    reset($headers);
    GLOBAL $url;

    //echo "$url<br>";

    $jsonOutput = "";
    $reply = "";
    $redirect = "";

    while(list($key, $val) = each($headers)){
        //echo "$key : $val<br>";
        if($key == "http_code"){
            $reply = trimHttpReply($val);
        }
        if($key == "Location"){
            $redirect = $val;
        }
    }

    if($redirect != ""){
        $jsonOutput = json_encode(array("url" => "$url", "reply" => "$reply", "redirect" => "$redirect"));
    }
    else{
        $jsonOutput = json_encode(array("url" => "$url", "reply" => "$reply"));
    }

    if($jsonOutput == ""){
        echo json_encode(array("NO REPLY!"));
    }
    else{
        echo $jsonOutput;
    }
}

function trimHttpReply($httpField){
    $match = "/\d{3}/";
    preg_match($match, $httpField, $outputValue);

    if(sizeof($outputValue) != 0) {
        return $outputValue[0];
    }
    return " ";

}