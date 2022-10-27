#!/bin/sh
# this script is to be run from a docker image
countNbTest=$1
cd /mnt/in
set +e # support errors
#compile the code
gcc -Wall -o /home/weekgolf/a.out prog.c \
    > /dev/null \
    2> /mnt/out/err0.txt \
    || exit 1
# run the code
for testcount in `seq 0 1 $countNbTest`
do
    timeout -s 9 10 /home/weekgolf/a.out  \
            < /mnt/in/input$testcount.txt \
            > /mnt/out/out$testcount.txt  \
            2> /mnt/out/err$testcount.txt
    echo $? > /mnt/out/errcode$testcount.txt
done
