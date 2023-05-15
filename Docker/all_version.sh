#!/bin/zsh
# ========

# Get languages from languages.json file
langs=($(jq -r '.[]' languages.json))

# i=0
# while read -r line; do
#     langs[$i]=$line
#     (( i++ ))
# done < <(jq -r '. | keys | .[]' languages.json)


# echo $langs;

declare -A versions


for lang in "${langs[@]}"; do
    versions["$lang"]=$(./version.sh $lang >&1)
done



# for key in "${!versions[@]}"; do
for key in "${(k)versions[@]}"; do
    echo $key;
    echo $versions[$key];
    # echo "$key: ${versions[$key]}"
done