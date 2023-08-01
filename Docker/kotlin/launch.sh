# Get the number of test from args
countNbTest=$1

# Change directory
cd /tmp/in

# Support errors
set +e

# Compile the kotlin file
error_message="$(kotlinc prog.kt -include-runtime -d ../prog.jar 2>&1)" # We do ../ because the current dir is readonly

if echo "$error_message" | grep -q "error:"; then
    # If there is an error

    # Add the message to the error files
    for testcount in `seq 0 1 $countNbTest`; do
        echo "$error_message" > /tmp/out/err$testcount.txt
        touch /tmp/out/out$testcount.txt
    done

else 
    # Execute it
    for testcount in `seq 0 1 $countNbTest`; do
        java -jar ../prog.jar                \
            < /tmp/in/input$testcount.txt \
            > /tmp/out/out$testcount.txt  \
            2> /tmp/out/err$testcount.txt
        done
fi
