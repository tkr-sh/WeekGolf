# Get the number of test from args
countNbTest=$1

# Change directory
cd /tmp/jellylanguage

# Support errors
set +e

cp /tmp/in/prog.jelly .



for testcount in `seq 0 1 $countNbTest`; do
    # $HOME/.local/bin/jelly fu prog.jelly \
    ~/.local/bin/jelly fun prog.jelly < /tmp/in/input$testcount.txt \
        > /tmp/out/out$testcount.txt  \
        2> /tmp/out/err$testcount.txt
done
