#!/bin/sh
# this script is to be run from a docker image with
countNbTest=$1
cd /home/weekgolf/
cp /mnt/in/prog.kt .
set +e
# compile the code
/home/weekgolf/.sdkman/candidates/kotlin/current/bin/kotlinc \
    prog.kt -include-runtime -d prog.jar                     \
    > /dev/null                                              \
    2> /mnt/out/err0.txt                                     \
    || exit 1
# now run the code on each input
for testcount in `seq 0 1 $countNbTest`
do
    java -jar prog.jar                  \
         < /mnt/in/input$testcount.txt  \
         > /mnt/out/out$testcount.txt   \
         2> /mnt/out/err$testcount.txt
    echo $? > /mnt/out/errcode$testcount.txt
done
