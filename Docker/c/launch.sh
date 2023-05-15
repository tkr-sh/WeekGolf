# Get the number of test from args
countNbTest=$1

# Change directory
cd /tmp/in

# Support errors
set +e

# Compile the code
gcc -Wall -o /a.out prog.c \
    > /dev/null \
    2> /tmp/out/err0.txt \
    || exit 1

# Execute it
for testcount in `seq 0 1 $countNbTest`; do
    timeout -s 9 10 /a.out \
        < /tmp/in/input$testcount.txt    \
        > /tmp/out/out$testcount.txt     \
        2> /tmp/out/err$testcount.txt
done