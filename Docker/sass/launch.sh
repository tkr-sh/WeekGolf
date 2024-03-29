# Get the number of test from args
countNbTest=$1

# Support errors
set +e

# Import all the built-in functions.
# They can be found at:
# https://github.com/aderepas/WeekGolf
touch /prog.scss
touch /prog_temp.scss


# Add user data
cat /tmp/in/prog.scss >> /prog.scss
for testcount in `seq 0 1 $countNbTest`
do
    # Copy stdin to a file named 'toto'
    cp /tmp/in/input$testcount.txt toto
    echo -n '";' >> toto; # Closing the STDIN

    # Insert the STDIN
    echo -n '$STDIN: "' >> /prog_temp.scss # Declare the variable STDIN
    sed -E ':a;N;$!ba;s/\r{0,1}\n/\\a /g' toto >> /prog_temp.scss  # Replace \n by \\a[SPACE]

    # Insert the built-in functions
    cat /functions.scss >> /prog_temp.scss
    # Program of the user
    cat /prog.scss >> /prog_temp.scss


    # Calling sass
    touch STDOUT
    sass /prog_temp.scss &> STDOUT

    cat STDOUT

    stdout=""
    i=1
    len=$(wc -l STDOUT | awk '{ print $1 }')
    while read line; do 
        test=$(echo "$line" | sed -r 's/prog_temp\.scss\:[0-9]+\sDEBUG:\s?//g')
        if [ $i == $((len)) ]; then
            stdout="$stdout$test"
        else
            stdout="$stdout$test\n"
        fi
        i=$((i+1))
    done <STDOUT
    echo -e "$stdout"  > /tmp/out/out$testcount.txt
    echo -e "\n" > /tmp/out/err$testcount.txt
    rm STDOUT

    sed -i '$d' /tmp/out/out$testcount.txt


    > /prog_temp.scss
done

rm /prog_temp.scss
rm /prog.scss
