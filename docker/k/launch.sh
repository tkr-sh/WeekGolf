#!/bin/sh
# this script is to be run from a docker image
countNbTest=$1
cd /home/weekgolf/k
cp /mnt/in/prog.k .
echo "" >> prog.k
set +e # support errors
for testcount in `seq 0 1 $countNbTest`
do
    ./k prog.k                        \
        < /mnt/in/input$testcount.txt \
        > /mnt/out/out$testcount.txt  \
        2> /mnt/out/err$testcount.txt
    echo $? > /mnt/out/errcode$testcount.txt
done
