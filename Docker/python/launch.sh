# Get the number of test from args
countNbTest=$1

# Change directory
cd /tmp/in

# Support errors
set +e
for testcount in `seq 0 1 $countNbTest`; do
    python prog.py                    \
        < /tmp/in/input$testcount.txt \
        > /tmp/out/out$testcount.txt  \
        2> /tmp/out/err$testcount.txt
done