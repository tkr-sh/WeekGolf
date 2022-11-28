#!/bin/sh
# this script is to be run from a docker image 
countNbTest=$1
cd /home/weekgolf
set +e # support errors
for testcount in `seq 0 1 $countNbTest`
do
    ./bin/bqn -f /mnt/in/prog.bqn         \
        `cat /mnt/in/input$testcount.txt` \
        > /mnt/out/out$testcount.txt      \
        2> /mnt/out/err$testcount.txt
    echo $? > /mnt/out/errcode$testcount.txt
done


