# Get the number of test from args
countNbTest=$1

# Change directory
cd /tmp

# Support errors
set +e

cp in/prog.erl .

# Step 2: Create an Erlang program
echo "Creating Erlang program..."
echo "-module(prog)." > prog.erl
echo "-export([start/0])." >> prog.erl
echo "start() ->" >> prog.erl
echo "    io:format(\"Hello, World!~n\")." >> prog.erl


# Compile
erlc prog.erl


for testcount in `seq 0 1 $countNbTest`; do
    # erl -noshell -run prog start -s init stop \
    erl -noshell prog \
        < /tmp/in/input$testcount.txt \
        > /tmp/out/out$testcount.txt  \
        2> /tmp/out/err$testcount.txt
done
