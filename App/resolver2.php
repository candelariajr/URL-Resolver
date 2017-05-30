<?php
/**
 * Created by PhpStorm.
 * User: candelariajr
 * Date: 5/28/2017
 * Time: 9:43 AM
 */
$enableRedirect = true;
$replyArray = ["69", "420", "85", "123", "499", "000"];
$urlArray = [
    "www.beckysaysBEN-IS-A-HOE.com",
    "www.philcollinswrocksmysocksoff.com",
    "www.yourcatisabigfurryloser.net",
    "www.imabossasbitch----------------DRIVE-THRU-STARBUCKS-REPRESENT.com",
    "www.myCatIsBetterThanYourCat.com",
    ""];

$outputVar = array("url" => "http://www.dawsonera.com/depp/reader/protected/external/AbstractView/S9780253016515");
if($enableRedirect){
    $outputVar["redirect"] = $urlArray[rand(0, sizeof($urlArray) - 1 )];
}
$outputVar["reply"] = $replyArray[rand(0, sizeof($replyArray) -  1)];
echo (json_encode($outputVar));