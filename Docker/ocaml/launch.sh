# Get the number of test from args
countNbTest=$1

# Change directory
cd /tmp

# Support errors
set +e

cp in/prog.ml prog.ml

# Compile the code
error_message="$(ocamlc -o prog prog.ml 2>&1)";


# echo $error_message | grep -q "Error: ";
# echo $(echo "$error_message" | grep "Error:");


# If there is an error
if echo "$error_message" | grep -q "Error: "; then

    # Add the message to the error files
    for testcount in `seq 0 1 $countNbTest`; do
        echo "$error_message" > /tmp/out/err$testcount.txt
        touch /tmp/out/out$testcount.txt
    done

else 
    # Allowed to be executed
    chmod 100 /tmp/proj/bin/Debug/net7.0/proj.dll

    # Execute it
    for testcount in `seq 0 1 $countNbTest`; do
        timeout -s 9 10 /tmp/prog \
            < /tmp/in/input$testcount.txt    \
            > /tmp/out/out$testcount.txt     \
            2> /tmp/out/err$testcount.txt
    done
fi
