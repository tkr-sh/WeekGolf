#!/bin/sh
# this script is to be run from a docker image 
countNbTest=$1
cd /home/weekgolf
set +e # support errors

# Provide the 'prompt' wrapper function, to read stdin.
# Stdin is expected to be found in a function named 'toto'.
# Made the name of the array longer because othewise it could
# be faster direcly access the array.
cat <<EOF > ~/prog.js
var weekgolf_arr_congrats_for_finding_the_name_of_this_array__I_made_it_a_little_longer_so_that_it_is_less_useful_ = require('fs').readFileSync('toto').toString().split("\n");
let weekgolf_arr_count=0;

function prompt() {
    if (weekgolf_arr_count>=weekgolf_arr_congrats_for_finding_the_name_of_this_array__I_made_it_a_little_longer_so_that_it_is_less_useful_.length) return undefined;
    weekgolf_arr_count++;
    return weekgolf_arr_congrats_for_finding_the_name_of_this_array__I_made_it_a_little_longer_so_that_it_is_less_useful_[weekgolf_arr_count-1];
}
EOF
# add user data
cat /mnt/in/prog.js >> ~/prog.js
for testcount in `seq 0 1 $countNbTest`
do
    # copy stdin to a file named 'toto'
    cp /mnt/in/input$testcount.txt  toto
    # call nodejs 
    node ~/prog.js > /mnt/out/out$testcount.txt 2> /mnt/out/err$testcount.txt
    # get stderr
    echo $? > /mnt/out/errcode$testcount.txt
done


