# Get the number of test from args
countNbTest=$1

# Support errors
set +e



cd /tmp

cp in/prog.scala p.scala

# for testcount in `seq 0 1 $countNbTest`; do
#     scala-cli prog.scala              \
#         < /tmp/in/input$testcount.txt \
#         > /tmp/out/out$testcount.txt  \
#         2> /tmp/out/err$testcount.txt
# done
scalac p.scala

for testcount in `seq 0 1 $countNbTest`; do
    scala p             \
        < /tmp/in/input$testcount.txt \
        > /tmp/out/out$testcount.txt  \
        2> /tmp/out/err$testcount.txt
done
