# Get the number of test from args
countNbTest=$1

# Change directory
cd /j903

# Support errors
set +e

for testcount in `seq 0 1 $countNbTest`; do
    /j903/jconsole.sh /tmp/in/prog.ijs \
        < /tmp/in/input$testcount.txt \
        > /tmp/out/out$testcount.txt  \
        2> /tmp/out/err$testcount.txt
done