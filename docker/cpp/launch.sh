#!/bin/sh
# this script is to be run from a docker image
countNbTest=$1
cd /mnt/in
set +e # support errors
clang++ -std=c++20 -Wall -o /home/weekgolf/a.out prog.cc \
        > /dev/null \
        2> /mnt/out/err0.txt \
    || exit 1
for testcount in `seq 0 1 $countNbTest`
do
    /home/weekgolf/a.out              \
        < /mnt/in/input$testcount.txt \
        > /mnt/out/out$testcount.txt  \
        2> /mnt/out/err$testcount.txt
    echo $? > /mnt/out/errcode$testcount.txt
done
