#!/bin/sh
# this script is to be run from a docker image 
countNbTest=$1
cd /home/weekgolf/golfscript
cp /mnt/in/prog.golfscript .
set +e # support errors
for testcount in `seq 0 1 $countNbTest`
do
    cat /mnt/in/input$testcount.txt |       \
        ruby  golfscript.rb prog.golfscript \
              > /mnt/out/out$testcount.txt  \
              2> /mnt/out/err$testcount.txt
    echo $? > /mnt/out/errcode$testcount.txt
done


