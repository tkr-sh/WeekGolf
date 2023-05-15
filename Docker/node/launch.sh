# Get the number of test from args
countNbTest=$1

# Support errors
set +e

# Compile the program 
echo "const STDIN = require('fs').readFileSync('../STDIN').toString().split('\\n');
let weekgolf_arr_count=0;

const prompt = () => {
    if (weekgolf_arr_count >= STDIN.length) return undefined;
    weekgolf_arr_count++;
    return STDIN[weekgolf_arr_count-1];
}" > prog.js

# Add the current program
cat /tmp/in/prog.js >> prog.js

for testcount in `seq 0 1 $countNbTest`; do

    # Copy the STDIN to a file named "STDIN"
    cp /tmp/in/input$testcount.txt ../STDIN

    # Execute the program
    node prog.js                      \
        > /tmp/out/out$testcount.txt  \
        2> /tmp/out/err$testcount.txt
done