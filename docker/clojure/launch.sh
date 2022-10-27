#!/bin/sh
# this script is to be run from a docker image 
countNbTest=$1
cd /mnt/in
set +e
export JAVA_HOME=/usr/lib/jvm/default-jvm
for testcount in `seq 0 1 $countNbTest`
do
    java -jar /home/weekgolf/clojure/clojure.jar prog.clj \
         < /mnt/in/input$testcount.txt                    \
         >  /mnt/out/out$testcount.txt                    \
         2> /mnt/out/err$testcount.txt
    echo $? > /mnt/out/errcode$testcount.txt
done

