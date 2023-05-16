const dic = {


    // APL
    ////////////////////////////
    "apl" : `out←{
    ⎕←⍵
}
out ⍞`,

    // BASH
    ////////////////////////////
    "bash" : `# Get STDIN
read -r s

# Write an answer using echo
echo "Hello WeekGolf!"`,


    // BQN
    ////////////////////////////
    "bqn" : `# Get STDIN
s ← •args

# Write an answer using •Out
•Out"Hello WeekGolf!"`,


    // C
    ////////////////////////////
    "c": `#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>


int main(){
    
    // Get STDIN
    int n;
    scanf("%d", &n);

    // Write an answer using printf()
    printf("Hello WeekGolf!");

    return 0;
}`,


    // C++
    ////////////////////////////
    "c++": `#include <iostream>
#include <algorithm>
#include <string>

using namespace std;

int main(){
    
    // Get STDIN
    int n;
    cin >> n;

    // Write an answer using std::cout
    cout << "Hello WeekGolf!\\n";

    return 0;
}`,


    // CLOJURE
    ////////////////////////////
    "clojure": `( ;Get STDIN
doseq [s (line-seq (java.io.BufferedReader. *in*))])

; Write an answer using println
(println "Hello WeekGolf!")`,



    // C#
    ////////////////////////////
    "cs": `// WeekGolf uses C#10+, so there is no top level constructors such as class/Main
// Get STDIN
string s = Console.ReadLine();

// Write an answer using Console.WriteLine
Console.WriteLine("Hello WeekGolf!");`,

    // ELIXIR
    ////////////////////////////
    "elixir" : `# Get STDIN
s = IO.read(:stdio, :line)

# Write an answer using IO.puts
IO.puts "Hello WeekGolf!"`,


    // Erlang
    ////////////////////////////
    "erlang" : ``,



    // Go
    ////////////////////////////
    "go" : `package main

import "fmt"

func main() {

    // Get STDIN
    var n int
    fmt.Scan(&n)
    
    // Write an answer using fmt.Print
    fmt.Print("Hello WeekGolf!")

}`,

    // Haskell
    ////////////////////////////
    "haskell" : `import System.IO

main = do
    
    -- Get STDIN
    s <- getLine

    -- Write an answer using putStrLn
    putStrLn "Hello WeekGolf!"`,

    // J
    //////////////////////////////
    "j": `NB. Get STDIN
s =: 1!:1 <3

NB. Write an answer using echo
echo s`,

    // Java
    //////////////////////////////
    "java" : `import java.util.*;
import java.io.*;
import java.math.*;

class prog{

    public static void main(String args[]) {
        // Get STDIN
        Scanner in = new Scanner(System.in);
        String N = in.nextLine();

        // Write an answer using System.out.println
        System.out.println("Hello WeekGolf!");
    }
}`,

    // JS
    //////////////////////////////
    "javascript" : `// Get STDIN
let a = prompt()

// Write an answer using console.log
console.log("Hello WeekGolf!")`,


    // Julia
    //////////////////////////////
    "julia" : `# Get STDIN
a = readline()

# Write an answer using print
print("Hello WeekGolf!")`,


    // k
    //////////////////////////////
    "k" : `/ Get STDIN
a: 0:0 / 0:\` doesn't work.

/ Write an answer using \`0:
\`0:"Hello WeekGolf!"`,


    // kotlin
    //////////////////////////////
    "kotlin" : `fun main() {
    // Get STDIN
    var s: String = readLine()

    // Write an answer using println
    println("Hello WeekGolf!")
}`,


    // lua
    //////////////////////////////
    "lua" : `-- Get STDIN
s = io.read()

-- Write an answer using print
print("Hello WeekGolf!")`,


    // ocaml
    //////////////////////////////
    "ocaml" : `(* Get STDIN *)
let s = read_line () in

(* Write an answer using print_x *)
print_string "Hello WeekGolf!"`,


    // perl
    //////////////////////////////
    "perl" : `# Get STDIN
$s = <>;

# Write an answer using print 
print "Hello WeekGolf!";`,


    // php
    //////////////////////////////
    "php" : `<?php
# Get STDIN
$s = fgets(STDIN);

# Write an answer using echo
echo "Hello WeekGolf!";`,


    // PowerShell
    //////////////////////////////
    "powershell" : `# Get STDIN
$s = $input;

# Write an answer (implicit output)
"Hello WeekGolf!"`,


    // Prolog
    //////////////////////////////
    "prolog": `% :- Will be executed
:-
    % Get STDIN
    read_line_to_string(user_input,S),

    % Write an answer using write | write | format
    writeln(S).`,


    // Python
    //////////////////////////////
    "python" : `# Get STDIN
s = input()

# Write an answer using print
print("Hello WeekGolf!")`,


    // r
    //////////////////////////////
    "r" : `# Get STDIN
i<-file('stdin') 
s<-readLines(i) # You can add the keyword argument 'n' for the number of lines that you want to take.

# Write an answer using cat
cat("Hello WeekGolf!")`,

    // Raku
    //////////////////////////////
    "raku" : `# Get STDIN
my $a = get();

# Write an answer using say
say "Hello WeekGolf!";`,


    // ruby
    //////////////////////////////
    "ruby" : `# Get STDIN
s = gets

# Write an answer using puts
puts "Hello WeekGolf!"`,


    // rust
    //////////////////////////////
    "rust" : `use std::io;

fn main() {
    // Get STDIN
    let mut buffer = String::new();
    io::stdin().read_line(&mut buffer);

    // Write an answer using println!
    println!("{}",buffer);
}`,

    // Sass
    //////////////////////////////
    "sass" : `// Get STDIN
$s: see();

// Write an answer using @debug
@debug "Hello WeekGolf!";`,

    // Scala
    //////////////////////////////
    "scala" : `
import scala.io.StdIn.readLine
object p {
    def main(args: Array[String]): Unit = {
        // Get STDIN
        val s = readLine();

        // Write an answer using println
        println("Hello WeekGolf!")
    }
}`,

    // vyxal
    //////////////////////////////
    "vyxal" : ``
};


export default dic;
