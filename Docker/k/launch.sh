# Get the number of test from args
countNbTest=$1

# Change directory
cd /tmp/in


cp prog.k ..

# Add an empty line at the end of the K program
echo -e "\n" >> ../prog.k


# Support errors
set +e
for testcount in `seq 0 1 $countNbTest`; do
    /k/k ../prog.k                    \
        < /tmp/in/input$testcount.txt \
        > /tmp/out/out$testcount.txt  \
        2> /tmp/out/err$testcount.txt
done