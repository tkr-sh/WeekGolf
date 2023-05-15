#!/bin/zsh
# ========

# Get the lang and extract the test program and the extension
lang=$(echo "$1" | tr 'A-Z' 'a-z')
tmpDir=$2
nb_inputs=$3


# Go to the test directory
cd tmp/$tmpDir

# Copy the script to launch programs
cp ../../$lang/launch.sh .



# Run the docker
timeout --preserve-status -s 9 60 \
        docker run                                                \
        --memory-reservation 128mb                                \
        --memory 312mb                                            \
        --mount type=bind,source=`pwd`,target=/tmp/in,ro          \
        --mount type=bind,source=`pwd`,target=/tmp/out            \
        --network none                                            \
        --name weekgolf-$lang-$$ --rm                             \
        "weekgolf-$lang"":latest" /bin/sh /tmp/in/launch.sh  $(( $nb_inputs - 1 ))
