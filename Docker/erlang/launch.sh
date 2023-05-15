# Get the number of test from args
countNbTest=$1

# Change directory
cd /tmp

# Support errors
set +e

# Compile
erlc in/prog.erl


ls 

for testcount in `seq 0 1 $countNbTest`; do
    # erl -noshell -run prog start -s init stop \
    erl -noshell -s prog start -s init stop \
        < /tmp/in/input$testcount.txt \
        > /tmp/out/out$testcount.txt  \
        2> /tmp/out/err$testcount.txt
done