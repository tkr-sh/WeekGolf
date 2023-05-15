# Get the number of test from args
countNbTest=$1

# Change directory
cd /tmp/in

# Support errors
set +e

# Compile the kotlin file
kotlinc prog.kt -include-runtime -d ../prog.jar # We do ../ because the current dir is readonly

# Execute it
for testcount in `seq 0 1 $countNbTest`; do
    java -jar ../prog.jar                \
        < /tmp/in/input$testcount.txt \
        > /tmp/out/out$testcount.txt  \
        2> /tmp/out/err$testcount.txt
done