<?php

$discord_url = "https://discord.com/api/oauth2/authorize?client_id=968576109060968529&redirect_uri=https%3A%2F%2Fweek.golf%2FloginWithDiscordProcess.php&response_type=code&scope=email%20identify";
header("Location: $discord_url");
exit();

?>