# Get the number of test from args
countNbTest=$1

# Support errors
set +e

# Compile the code
error_message="$(rustc /tmp/in/prog.rs 2>&1)";


# If there is an error
if echo "$error_message" | grep -q "error: "; then

    # Add the message to the error files
    for testcount in `seq 0 1 $countNbTest`; do
        echo "$error_message" > /tmp/out/err$testcount.txt
        touch /tmp/out/out$testcount.txt
    done

else 
    # Execute it
    for testcount in `seq 0 1 $countNbTest`; do
        ./prog                        \
        < /tmp/in/input$testcount.txt \
        > /tmp/out/out$testcount.txt  \
        2> /tmp/out/err$testcount.txt
    done
fi
