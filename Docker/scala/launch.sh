# Get the number of test from args
countNbTest=$1

# Support errors
set +e

# for testcount in `seq 0 1 $countNbTest`; do
#     scala-cli prog.scala              \
#         < /tmp/in/input$testcount.txt \
#         > /tmp/out/out$testcount.txt  \
#         2> /tmp/out/err$testcount.txt
# done
scalac prog.scala

for testcount in `seq 0 1 $countNbTest`; do
    scala prog              \
        < /tmp/in/input$testcount.txt \
        > /tmp/out/out$testcount.txt  \
        2> /tmp/out/err$testcount.txt
done