# Get the number of test from args
countNbTest=$1

# Change directory
cd /tmp

# Copy the file to the parrent dir
cp in/prog.pl ..

cat in/prog.pl > prog.pl

cat prog.pl

# Support errors
set +e
for testcount in `seq 0 1 $countNbTest`; do
    swipl prog.pl                      \
        < /tmp/in/input$testcount.txt \
        > /tmp/out/out$testcount.txt  \
        2> /tmp/out/err$testcount.txt
done