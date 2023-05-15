#!/bin/zsh
# ========


# Get the lang and extract the test program and the extension
lang=$(echo "$1" | tr 'A-Z' 'a-z')
version_cmd=$(jq --raw-output  ".$lang.version" languages.json)


# Run the docker 
docker run \
       "weekgolf-$lang"":latest" /bin/sh -c "$version_cmd"