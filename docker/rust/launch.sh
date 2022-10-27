#!/bin/sh
# this script is to be run from a docker image 
countNbTest=$1
cd /home/weekgolf
cp /mnt/in/prog.rs .
set +e # support errors
rustc prog.rs > /dev/null 2> /mnt/out/err0.txt || exit 1
for testcount in `seq 0 1 $countNbTest`
do
    ./prog                            \
        < /mnt/in/input$testcount.txt \
        > /mnt/out/out$testcount.txt  \
        2> /mnt/out/err$testcount.txt
    echo $? > /mnt/out/errcode$testcount.txt
done


