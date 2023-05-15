#!/bin/zsh
# ========

# Get the lang and extract the test program and the extension
lang=$(echo "$1" | tr 'A-Z' 'a-z')
testprogram=$(jq --raw-output  ".$lang.test" languages.json)
ext=$(jq --raw-output ".$lang.extension" languages.json)

# Go to the test directory
cd test


# Copy the script to launch programs
cp ../$lang/launch.sh .

# Add the program to test to the file
echo $testprogram > "prog.$ext"


# Create files with random values
for i in {0..9}; do
    printf "%d\n%d\n%d\n" $RANDOM $RANDOM $RANDOM > "input$i.txt"
done


# Run the docker 
docker run \
       --mount type=bind,source=`pwd`,target=/tmp/in,ro          \
       --mount type=bind,source=`pwd`,target=/tmp/out            \
       --network none                                            \
       --name weekgolf-$lang-$$ --rm                             \
       "weekgolf-$lang"":latest" /bin/sh /tmp/in/launch.sh 9


# Move files from test to temporary
mv -f *.txt ../tmp

# Delete remaining files
rm -rf *

# Go to the temporary files
cd ../tmp


# Get the variable to know if the test case are a success or not
valid=true


# Create files with random values
for i in {0..9}; do
    diff input$i.txt out$i.txt > /dev/null

    # If files aren't the same
    if [ $? -ne 0 ]; then
        printf "\033[31m-\033[0m Error in the test case $i\n"
        valid=false
    fi

    # If debug
    if [[ -n $2 ]]; then
        diff input$i.txt out$i.txt
    else 
        rm -f input$i.txt err$i.txt out$i.txt
    fi
done


# Echo the status of the tests cases
$valid && echo "\033[42m           SUCCESS         \033[0m" || echo "\033[41m            FAIL           \033[0m"
