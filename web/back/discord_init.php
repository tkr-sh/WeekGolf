<?php

// Initiate the discord sesssion
session_start();

$_SESSION["token"] = $_GET["t"];

$discord_url = "https://discord.com/api/oauth2/authorize?client_id=968576109060968529&redirect_uri=https%3A%2F%2Fweek.golf%2Fdiscord.php&response_type=code&scope=identify%20email";
header("Location: $discord_url");
exit();
