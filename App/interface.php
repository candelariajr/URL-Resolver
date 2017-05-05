<?php
/**
 * Created by PhpStorm.
 * User: candelariajr
 * Date: 5/4/2017
 * Time: 5:26 PM
 */
interface databaseConnector{
    public function getParameters($server, $username, $password, $database);
}