# Get the number of test from args
countNbTest=$1

# Support errors
set +e

# cat /tmp/in/prog.apl

for testcount in `seq 0 1 $countNbTest`; do

    # Execute the program
    /CBQN/BQN -f /tmp/in/prog.bqn     \
        `cat /tmp/in/input$testcount.txt` \
        > /tmp/out/out$testcount.txt  \
        2> /tmp/out/err$testcount.txt
done