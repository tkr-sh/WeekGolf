# Summary 
- [Summary](#summary)
- [Main links](#main-links)
- [APL](#apl)
  - [History](#history)
  - [Characteristics](#characteristics)
  - [Program](#program)
- [Bash](#bash)
  - [History](#history-1)
  - [Characteristics](#characteristics-1)
  - [Program](#program-1)
- [BQN](#bqn)
  - [History](#history-2)
  - [Characteristics](#characteristics-2)
  - [Program](#program-2)
- [C](#c)
  - [History](#history-3)
  - [Characteristics](#characteristics-3)
  - [Program](#program-3)
- [C++](#c-1)
  - [History](#history-4)
  - [Characteristics](#characteristics-4)
  - [Program](#program-4)
- [C#](#c-2)
  - [History](#history-5)
  - [Characteristics](#characteristics-5)
  - [Program](#program-5)
- [Clojure](#clojure)
  - [History](#history-6)
  - [Characteristics](#characteristics-6)
  - [Program](#program-6)
- [Elixir](#elixir)
  - [History](#history-7)
  - [Characteristics](#characteristics-7)
  - [Program](#program-7)
- [Go](#go)
  - [History](#history-8)
  - [Characteristics](#characteristics-8)
  - [Program](#program-8)
- [GolfScript](#golfscript)
  - [History](#history-9)
  - [Characteristics](#characteristics-9)
  - [Program](#program-9)
- [Haskell](#haskell)
  - [History](#history-10)
  - [Characteristics](#characteristics-10)
  - [Program](#program-10)
- [J](#j)
  - [History](#history-11)
  - [Characteristics](#characteristics-11)
  - [Program](#program-11)
- [Java](#java)
  - [History](#history-12)
  - [Characteristics](#characteristics-12)
  - [Program](#program-12)
- [JavaScript](#javascript)
  - [History](#history-13)
  - [Characteristics](#characteristics-13)
  - [Program](#program-13)
- [Jelly](#jelly)
  - [History](#history-14)
  - [Characteristics](#characteristics-14)
  - [Program](#program-14)
- [Julia](#julia)
  - [History](#history-15)
  - [Characteristics](#characteristics-15)
  - [Program](#program-15)
- [K](#k)
  - [History](#history-16)
  - [Characteristics](#characteristics-16)
  - [Program](#program-16)
- [Kotlin](#kotlin)
  - [History](#history-17)
  - [Characteristics](#characteristics-17)
  - [Program](#program-17)
- [Lua](#lua)
  - [History](#history-18)
  - [Characteristics](#characteristics-18)
  - [Program](#program-18)
- [OCaml](#ocaml)
  - [History](#history-19)
  - [Characteristics](#characteristics-19)
  - [Program](#program-19)
- [Perl](#perl)
  - [History](#history-20)
  - [Characteristics](#characteristics-20)
  - [Program](#program-20)
- [PHP](#php)
  - [History](#history-21)
  - [Characteristics](#characteristics-21)
  - [Program](#program-21)
- [Prolog](#prolog)
  - [History](#history-22)
  - [Characteristics](#characteristics-22)
  - [Program](#program-22)
- [Python](#python)
  - [History](#history-23)
  - [Characteristics](#characteristics-23)
  - [Program](#program-23)
- [R](#r)
  - [History](#history-24)
  - [Characteristics](#characteristics-24)
  - [Program](#program-24)
- [Raku](#raku)
  - [History](#history-25)
  - [Characteristics](#characteristics-25)
  - [Program](#program-25)
- [Ruby](#ruby)
  - [History](#history-26)
  - [Characteristics](#characteristics-26)
  - [Program](#program-26)
- [Rust](#rust)
  - [History](#history-27)
  - [Characteristics](#characteristics-27)
  - [Program](#program-27)
- [Vyxal](#vyxal)
  - [History](#history-28)
  - [Characteristics](#characteristics-28)
  - [Program](#program-28)
  
# Main links
https://en.wikipedia.org/wiki/Object-oriented_programming
https://en.wikipedia.org/wiki/Functional_programming
https://en.wikipedia.org/wiki/Imperative_programming
https://en.wikipedia.org/wiki/Declarative_programming
https://en.wikipedia.org/wiki/Array_programming
https://en.wikipedia.org/wiki/Procedural_programming
https://en.wikipedia.org/wiki/Structured_programming
https://www.tiobe.com/tiobe-index/



<!-- APL -->
# APL
## History
APL is an array-oriented, functional and structured programming language designed by <a href="https://en.wikipedia.org/wiki/Kenneth_E._Iverson">Kenneth E. Iverson</a> and first appeared in 1966.
The name APL corresponds to the acronyms of the book "A Programming Language".
APL is the oldest language on WeekGolf so far <i>(APL: 1966, C: 1972)</i>. It is a historical language that has had a real importance on the programming world.
APL is the language that put forward the array-oriented paradigm (used by: A+, K, J, Julia, Matlab, R, Q), and of the use of mathematical notation in programming.
The basis of APL began to be developed in 1957, the same year that Fortran was published, at Harvard.
In 1960 he started to work for IBM, and it was there that Kenneth E. Iverson developed all the APL notation, and two years later he published the book "A Programming Language" where he developed the proximity between mathematical notation and computers.
4 years later, in 1966, APL became public. It was revolutionary at first. APL used a ball or screen terminal instead of the punch card. Because of this and the mathematical concepts used in APL, it was increasingly successful until the mid-1980s.
Nowadays, APL is not used much anymore.

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Array_programming">Array</a>,  <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>,  <a href="https://en.wikipedia.org/wiki/Structured_programming">Structured</a>.
- APL is a high level language
- APL does not use the ASCII table but its own table to encode the character

## Program
    a ← 0
    b ← 1
    Next ← {
        sum ← +/ ⍵
        sum , ⎕ ← ⊃ ⍵
    }
    Next ⍣ 10 ⊢ a b



<!-- Bash -->
# Bash
## History
Bash (Bourne-Again shell) is an imperative and procedural programming language designed by <a href="https://en.wikipedia.org/wiki/Brian_Fox_(computer_programmer)">Brian Fox</a> and first appeared in 1989.
The first concept of Shell in Unix machines appeared in 1971 and it was made by <a href="https://en.wikipedia.org/wiki/Ken_Thompson">Ken Thompson</a>. At that time it was a really revolutionary concept. However it will be replaced 6 years later by the famous "<a href="https://fr.wikipedia.org/wiki/Bourne_shell">Bourne Shell</a>" (Bourne comes from <a href="https://fr.wikipedia.org/wiki/Stephen_Bourne">Stephen Bourne</a>). However, the Bourne Again Shell (BASH) is not made by Stephen Bourne but by Brian Fox, and it will be released in 1989, 12 years after BSH. Bourne again is therefore a play on the words Born and Bourne. Indeed, when the Bourne Shell was released, some said that the real shells were born. And so Bourne again shell would mean that the shell is born again from its ashes!
BASH is the default shell on many Unix devices. However, today many OS prefer ZSH to BASH.
BASH is also turing complete and a programming language; although today this is not the main use of it. BASH serves more as a Shell than a scripting language.

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>,  <a href="https://en.wikipedia.org/wiki/Procedural_programming">Procedural</a>.
- BASH is a high level language
- BASH is a shell

## Program
    a=0
	b=1
	
	for ((i=0; i<10; i++)); do
	    echo $a
	    a=$((b-a))
	    b=$((b+a))
	done



<!-- BQN -->
# BQN
## History
BQN is an array-oriented, functional and structured programming language designed by <a href="https://aplwiki.com/wiki/Marshall_Lochbaum">Marshall Lochbaum</a> and first appeared in 2020.
The main implementation of BQN is called CBQN, and is written in C. There is also an implementation written in JavaScript and Java.
BQN wants to be a more modern APL by overcoming several shortcomings, and by adding features not present in APL such as first-class functions for example. However, unlike languages like J or K which have decided to simply use the ASCII table, BQN also has its own SBCS table (which is different from APL).
The name BQN comes from APL, and it is the letters of APL + 1 except for the N (because the creator did not realize that before N there was M). BQN is also often called beacon.
More info <a href="https://github.com/mlochbaum/BQN/blob/master/commentary/history.md">here</a>

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Array_programming">Array-oriented</a>,  <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>,  <a href="https://en.wikipedia.org/wiki/Structured_programming">Structured</a>.
- BQN is a high level language
- BQN does not use the ASCII table but its own table to encode the character

## Program
    Fib ← {𝕩>1 ? (𝕊 𝕩-1) + 𝕊 𝕩-2  ; 𝕩}
    Main ← {𝕩<11 ? •Out¨(Fib 𝕩), (𝕊 𝕩+1) ; 𝕩}

    Main 0




<!-- C -->
# C
## History

C is an imperative, procedural and structured programming language created by the <a href="https://en.wikipedia.org/wiki/Bell_Labs">Bell Labs</a>, specially by <a href="https://en.wikipedia.org/wiki/Dennis_Ritchie">Dennis Ritchie</a> and <a href="https://en.wikipedia.org/wiki/Brian_Kernighan">Brian Kernighan</a>, and officially made public in 1972.
C is one of the oldest languages that is still very popular today. It was still ranked as the most popular language in early 2021 by the <a href="https://www.tiobe.com/tiobe-index/">TIOBE index</a> even if it's the successor of the B language, which is not widely used.
C is a very widespread language, used in many well-known things like UNIX, the Linux kernel (even though now, Rust is also used for the linux kernel), GCC, most embedded systems etc.
C was one of the first languages to be used to make OS rather than coding the OS directly in assembler. This may seem normal today, but at the time it was normal to code your OS in Assembler because the capabilities were very limited.
C has many different uses, creating OS (UNIX), creating embedded systems (with Arduino for example), creating programming languages / interpreters / compilers (Python, Perl, Lua, Ruby, Bash, Julia, JavaScript, Java, C# ...) (C is often used as the first program to <a href="https://en.wikipedia.org/wiki/Bootstrapping_%28compilers%29">bootstrap</a>), creating DataBases (MySQL, PostegreSQL, SQLite ...), creating GUI (OpenGL, GTK, ...) etc. Globally, whenever performance is required, C is often used. (Note: For most of the examples described above (except OS), C++ is also often used in conjunction with C)
There are a lot of C compilers, and the syntax can change a lot depending on the compiler and the OS used. The most popular ones are GCC and CLANG. WeekGolf uses GCC for the C language.
C has greatly influenced the world of computing and programming languages. Languages have been created to add features to C (C++, Rust), C has created a <a href="https://en.wikipedia.org/wiki/Control_flow">control flow</a> used by several languages (C++, Java, C#, PHP, JavaScript) and even if one day we will all die, C will never die.

## Characteristics
- With C, you have a low-level approach without limits. If you do any kind of important error, your OS can "break". <i>Note: Software such as <a href="https://frama-c.com/">FramaC</a> or <a href="https://trust-in-soft.com/">TrustInSoft</a> try to overcome this problem. FramaC and TrustInSoft both use <a href="https://en.wikipedia.org/wiki/Static_program_analysis">static analysis</a> and <a href="https://en.wikipedia.org/wiki/Formal_methods">formal methods</a>.</i>
- Paradigms: <a href="https://en.wikipedia.org/wiki/Procedural_programming">Procedural</a>,  <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>,  <a href="https://en.wikipedia.org/wiki/Structured_programming">Structured</a>.
- C is a Low/Medium level language




## Program
    #include <stdio.h>

    int main (void) {
        int a = 0, b = 1;

        for (int i = 0; i < 10; i++){
            printf("%d\n", a);
            a = b - a;
            b += a;
        }

        return 0;
    }



<!-- C++ -->
# C++
## History

C++ is a multi-paradigm language (object-oriented, imperative and procedural) created by <a href="https://en.wikipedia.org/wiki/Bjarne_Stroustrup">Bjarne Stroustrup</a> and officially made public in 1985.
Bjarne Stroustrup, the creator of C++, created "C with classes" in 1979. "C with classes" as its name suggests, was C... with classes. However, he did not stop there. In 1982, he started to work on C++ <=> C+=1 <=> C one level up.
In C++, he added new features, such as <a href="https://en.wikipedia.org/wiki/Reference_(C%2B%2B)">references</a>, <a href="https://en.wikipedia.org/wiki/Virtual_function">virtual functions</a> or even <a href="https://en.wikipedia.org/wiki/Operator_overloading">operator overloading</a> that were not present in "C with classes" and even less in C.
Change after change, novelty after novelty, C++ evolved and became public in 1985, 13 years after C.
It would take too much time to list all the differences that C and C++ have, but there are quite a few, even though the languages are sometimes similar and used most of the time for the same tasks.
A notable difference is that C++ is much more used in areas such as video games, graphics libraries, and generally anything that requires performance and classes
There are different major implementations of C++, GCC/G++ and CLANG/CLANG++ to name only the best known. As for C, the syntax of C++ can change a lot depending on the compiler, the OS and the version used. WeekGolf uses CLANG to compile C++.
Today C++ is one of the most popular languages. Between 2000 and 2018, it has almost always been the third most popular language according to the <a href="https://www.tiobe.com/tiobe-index/">TIOBE index</a> (behind C and Java). However, for a few years now, many people have been talking about the fact that C++ might be replaced by Rust in the future. It's hard to deny or affirm this though.


## Characteristics
- With C++, you have a low-level approach without limits. <i>Note: Software such as <a href="https://frama-c.com/">FramaC</a> with FramaClang or <a href="https://trust-in-soft.com/">TrustInSoft</a> try to overcome this problem. FramaC/FramaClang and TrustInSoft both use <a href="https://en.wikipedia.org/wiki/Static_program_analysis">static analysis</a> and <a href="https://en.wikipedia.org/wiki/Formal_methods">formal methods</a>.</i>
- Paradigms: <a href="https://en.wikipedia.org/wiki/Procedural_programming">Procedural</a>,  <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>,  <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-oriented</a>.
- C++ is a Low/Medium level language




## Program
    #include <iostream>

    int main() {
        int a = 0, b = 1;

        for (int i = 0; i < 10; i++){
            std::cout << a << std::endl;
            a = b - a;
            b += a;
        }
    }


<!-- C# -->
# C#
## History

C# is a multi-paradigm language (object-oriented, imperative, concurrent, structured and functional) created by <a href="https://en.wikipedia.org/wiki/Microsoft">Microsoft</a> and officially commercialized in 2002.
To understand where C# comes from, you have to go back to 1995, when Java was first announced. Microsoft, which was interested in Java, bought, the following year, a license to propose an implementation of Java, which was called J++ (this is not related to the <a href="https://en.wikipedia.org/wiki/J_(programming_language)">J language</a>). However, in 1998, an American judge forbade Microsoft to use the Java trademark for J++ products because it did not respect the Java standard. As a result, two languages were created, J# and C#.
J# goes by quickly, however, C# does not, and that's where C# comes from.
Even if C# was at the beginning very very similar to Java, the more time passed, then we see clearly the distinction of the two languages, even if they remain similar in some points.
For example, in 2008, in version 3 of C#, LINQ (Language INtegrated Queries) was added, which represents an advance quite different from Java. But more recently, in November 2021, for C#10, C# stopped being a class-based language and can now execute code without creating classes and main functions like in Java.
The name "C#" is inspired by the music notation where a hash indicates that the written note should be increased by a semitone. This is similar to the language name of C++, where "++" indicates that a variable should be incremented by 1 after being evaluated. The # symbol also looks like a ligature of four "+" symbols (in a two-by-two grid), which implies that the language is an increment of C++ and also of C.

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-oriented</a>, <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>, <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>, <a href="https://en.wikipedia.org/wiki/Concurrent_computing">Concurrent</a>, <a href="https://en.wikipedia.org/wiki/Structured_programming">Structured</a>.
- C# is a Medium/High level language (I know it's controversial to say that C# is a mid-level language, but, C# still has a notion of pointers and references, even though overall there is a high level of abstraction and pointers are rarely used.)

## Program
    // Only works for C#10 and +
    int a = 0, b = 1;

    for (int i = 0; i < 10; i++){
        Console.WriteLine(a);
        (a, b) = (b, a + b);
    }



<!-- Clojure -->
# Clojure
## History
Clojure is a multi-paradigm language (agent-oriented, functional, concurrent and logic) created by <a href="https://en.wikipedia.org/wiki/Rich_Hickey">Rick Hickey</a> and initially released in 2007.
The existence of Clojure is mainly due to 3 programming languages. Lisp, C# and Java. This is where the name Clojure comes from, which is a play on the word "closure" with the letters C, L and J, which correspond to C#, Lisp and Java.The creator of Clojure had also created dotLisp before. Which was an attempt to put Lisp for the .NET framework.
Clojure also works thanks to the JVM (java virtual machine). The development of Clojure took 2 years, after the 2 years of Clojure development, a large part of the Lisp community went to support Lisp.
The main source of inspiration of Clojure is Lisp. This is very evident in the syntax. The first objective of Clojure was to create a modern and functional Lisp.
It is a matter of course that the main implementation of Clojure is made in Java.
Clojure is in the top 100 of the <a href="https://www.tiobe.com/tiobe-index/">TIOBE index</a>. 

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Agent-oriented_programming">Agent-oriented</a>, <a href="https://en.wikipedia.org/wiki/Logic_programming">Logic</a>, <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>, <a href="https://en.wikipedia.org/wiki/Concurrent_computing">Concurrent</a>.
- Clojure is a High level language

## Program
    (def fib-seq-seq
    ((fn fib [a b] 
        (lazy-seq (cons a (fib b (+ a b)))))
    0 1))

    (println (clojure.string/join "\n" (take 10 fib-seq-seq)))





<!-- Elixir -->
# Elixir
## History
Elixir is a multi-paradigm language (functional, concurrent and process-oriented) created by <a href="https://github.com/josevalim">José Valim</a> and initially released in 2012.
The primary goal of Elixir was to recreate Erlang but in a more reliable way, allowing a large amount of traffic and with a higher productivity. The main aspects that made Elixir to be created in addition to Erlang is on the one hand the fact that the frequency of the processors ceases to progress during the years 2000, on the other hand that the Erlang ecosystem, and in particular its virtual machine, takes advantage of this type of multi-processor architectures, any execution of a program being made up of a set of parallel micro processes. Its why Elixir compiles byte code for the BEAM (Björn's Erlang Abstract Machine) 
Today Elixir is used in some well-known services such as Discord or Pinterest.
Elixir is not intended to evolve in a drastically different way. Each new version is about improving compatibility between Erlang and Elixir/improving performance/fixing bugs. Elixir tries to be as stable as possible and to change little over time for compatibility as time goes on.
Elixir is in the top 100 of the <a href="https://www.tiobe.com/tiobe-index/">TIOBE index</a>. 


## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Process-oriented_programming">Process-oriented</a>, <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>, <a href="https://en.wikipedia.org/wiki/Concurrent_computing">Concurrent</a>.
- Elixir is a High level language

## Program
    defmodule Fib do 
        def fib(0) do 0 end
        def fib(1) do 1 end
        def fib(n) do fib(n-1) + fib(n-2) end
    end

    for i <- 0..9 do
        IO.puts Fib.fib(i)
    end




<!-- Go -->
# Go
## History
Go is a multi-paradigm language (imperative, concurrent and object-oriented) created at <a href="https://en.wikipedia.org/wiki/Google">Google</a> and first released in 2009.
Go was originally conceived in 2007 at Google because people were tired of doing C++, however, version 1.0.0 of Go will be released in 2012. Go was designed by taking several aspects of popular languages: static typing from C, readability from python, for example. Go also gives a lot of importance to high performance networking, multi-threading tasks and multiprocessing. It is worth noting that Go was also made to increase productivity compared to C++.
Even though Go is clearly not a scripting language like Python or Ruby, it is rather simple to learn and has a syntax that is rather easy to understand compared to C. 
All these aspects together make it a good language for many big companies, like Uber, SoundCloud or Twitch, but also for more technical uses like with Docker for example.
Since Go is a rather new language, there has been no big change in the history of Go so far. Go is still in its first major version (1.x.x)
Go is in the top 20 of the <a href="https://www.tiobe.com/tiobe-index/">TIOBE index</a>. 


## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-oriented</a>, <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>, <a href="https://en.wikipedia.org/wiki/Concurrent_computing">Concurrent</a>.
- Go is a Medium/high level language

## Program
    package main

    import "fmt"

    func main() {
        a, b := 0, 1
        
        for i := 0; i < 10; i++ {
            fmt.Println(a)
            a = b - a
            b += a
        }
    }




<!-- GolfScript -->
# GolfScript
## History
GolfScript is a stack-based programming language created by <a href="https://github.com/darrenks">Darren Smith</a> and first released in 2007.
GolfScript is an esoteric language only made for code golf (as its name indicates).
However, unlike many Golf Code languages, GolfScript uses the ASCII table. This makes it longer than some languages like Jelly or Vyxal. As GolfScript is stack based, a GolfScript program is a list of objects like integers, strings, lists etc.


## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Stack-oriented_programming">Stack-oriented</a>, <a href="https://en.wikipedia.org/wiki/Esoteric_programming_language">Esoteric</a>.
- GolfScript is a High level language

## Program
    0 :a ;
    1 :b ;
    10 ,
    {;
        a puts
        b   a b + :b ;   :a;
    }
    /

    exit; 




<!-- Haskell -->
# Haskell
## History
Haskell is a purely functional programming language created by haskell's committee and first released in 1990.
The name Haskell comes from the mathematician Haskell Cury who laid the foundations of functional programming, and who had a great influence on combinatorial logic.
What led to the creation of Haskell was a renewed interest in functional languages with the arrival of Miranda in 1985. Miranda led to the creation of dozens of functional languages. Following this influx of functional languages, the people involved in this will form a committee to define the strengths of each language and to establish a standard for functional languages.
After several years of consultation, in 1990 a consensus was reached and the language in question, Haskell, was created.
Haskell has had several major versions changing the standars. After the first major version of Haskell in 1990, there was a big change in 1998 with a new standard for writing Haskell.
This version will have several changes, including a big one in 2003. However, there will be a new major standard that is still current today which is Haskell 2010. Many languages have been created since then, trying to create Haskell with modifications such as Haskell++ or O'Haskell implementing Haskell with the Object Oriented paradigm as well.
Today Haskell is considered the best known purely functional language.
Haskell is in the TOP50 of the <a href="https://www.tiobe.com/tiobe-index/">TIOBE index</a>.




## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Functional_programming">Purely functional</a>.
- Haskell is a High level language

## Program
    fib :: Int -> Int -> Int -> IO()
    fib a b 0 = print a
    fib a b n = do
        print a 
        fib b (a+b) (n-1)
        
    main = do
        fib 0 1 9


<!-- J -->
# J
## History
J is an array-oriented, functional and structured programming language designed by <a href="https://github.com/jsoftware">JSoftware</a>, including <a href="https://en.wikipedia.org/wiki/Kenneth_E._Iverson">Kenneth E. Iverson</a> and was made public in 1990.
J is clearly inspired by APL, however a big difference between the two is the ASCII table. J uses an ASCII table, while APL does not. This is one of the reasons why J is presented as the successor of APL.
The first official presentation of J took place at the APL GIS conference in Toronto on February 26, 1990 and then on August 13, 1990 at the APL90 conference in Copenhagen. The arrival of the J language created a split among APL users. Some appreciated the fact that the language could finally be used from a classical ASCII terminal because at that time one APL terminal out of three was electromechanical, and few of those with a screen had programmable characters. The others, finding the special signs of APL more meaningful (close to classical mathematics, or generalizing them) preferred to stay with this language.
Since its appearance, J has evolved quite a bit. An event that greatly marked the history of J and array-oriented languages is the release of the J language as open source in March 2011.



## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Array_programming">Array</a>,  <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>,  <a href="https://en.wikipedia.org/wiki/Structured_programming">Structured</a>.
- J is a high level language
- J uses ASCII table. Not like APL.

## Program
    fibN =: (-&2 +&$: -&1)^:(1&<) M."0
    echo fibN  i.10
    exit ''




<!-- Java -->
# Java
## History

Java is a multi-paradigm language (object-oriented/class-based, imperative, concurrent and functional) created by <a href="https://en.wikipedia.org/wiki/James_Gosling">James Gosling</a> and officially made public in 1995.
Java was created because people at <a href="https://en.wikipedia.org/wiki/Sun_Microsystems">Sun Microsystems</a> were tired of doing C and C++ and they didn't find it satisfying.
The official announcement of Java was made on May 23, 1995 at the SunWorld conference by the scientific director of Sun MicroSystem. However, during this conference, the vice-president of the Netscape executive also announced the support of Java on Netscape, which was directly a springboard for Java.
One of the most famous phrases in computer science comes from this language: "Write once, run anywhere" (WORA), which was then parodied as "Write once, debug everywhere".
WORA made sense, because Java made it possible to compile to a multitude of platforms thanks to the JVM (Java Virtual Machine) which ensured the portability of the generated bytecode, which was an incredible novelty at the time.
Java had a very fast rise and in a few years (7 years) became the most popular language in the world (<a href="https://www.tiobe.com/tiobe-index/">2002</a>).
In the early days, Java was very versatile and was on many different domains: Front-end with Applets, back-end with J2EE, Android development, various application development etc.
However, this did not last forever. Applets were not the best thing, and were soon replaced by JavaScript, J2EE was soon replaced by other things. Java for web development was no longer a preferred option after a few years. This did not prevent Oracle to buy Sun Microsystem and thus at the same time, to acquire Java in 2009.
As a result, the following year, the creator of Java left the company.
Despite this, large companies still use Java today, such as Microsoft (this includes the famous game Minecraft that microsoft now owns), Uber, LinkedIn, Paypal, Netflix or even the NASA.
Java has also created a new generation of JVM-based languages like Scala, Groovy or Kotlin.
Kotlin was even made to replace Java in Android development, and succeeded because since 2019, Google has designated it as the language for android development.

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-oriented</a> & <a href="https://en.wikipedia.org/wiki/Class-based_programming">Class-based</a>,  <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>, <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>,  <a href="https://en.wikipedia.org/wiki/Concurrent_computing">Concurrent</a>.
- Java is a high level programming language

## Program
    class prog {
        public static void main(String[] args) {
            int a = 0, b = 1;

            for (int i = 0; i < 10; i++){
                System.out.println(a);
                a = b - a;
                b += a;
            }
        }
    }




<!-- JavaScript -->
# JavaScript
## History

JavaScript is a multi-paradigm language (object-oriented, imperative and functional) written by <a href="https://en.wikipedia.org/wiki/Brendan_Eich">Brendan Eich</a> in 10 days, in 1995.
The main implementation of JavaScript is made in C/C++ and is called V8, however, there are other less used implementations which use for the most part C++.
JavaScript became popular thanks to Netscape which propelled it into the world of Web development.
JavaScript evolves greatly thanks to ECMAScript which defines a set of standards for scripting programming languages since 1996.
The more time passes, the more JavaScript becomes the language of web pages.
In 2006, there was a turning point for JavaScript with the arrival of jQuery. jQuery was supposed to be an easier way to do web development with a shorter and less verbose syntax. However, in the last few years ~2013, jQuery is becoming less and less popular.
Towards the beginning of the 2010s, there was also the creation of many frameworks using JavaScript that were supposed to make web development easier, like AngularJS (2010), ReactJS (2013), VueJS (2014). Theses framework didn't suffer the same fate as jQuery, at least for the moment, and are still widely used.
Even if JavaScript is mainly used to do the front end, frameworks have been created to do the back end in JavaScript, like NodeJS or more recently Deno. NodeJS is now very popular and adds many features to JavaScript.
as client-side programming language on websites.
Also, JavaScript brought about the creation of TypeScript, which was created by Microsoft <b>TO</b> improve and secure the production of JavaScript code.
Today JavaScript is the most used client-side programming language on websites with an overwhelming <a href="https://w3techs.com/technologies/details/cp-javascript">98.0%</a>.

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>,  <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>,  <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-oriented</a>.
- JavaScript is a high level programming language


## Program
    let a = 0, b = 1;

    for (let i = 0; i < 10; i++) {
        console.log(a);
        [a, b] = [b, a+b]
    }





<!-- Jelly -->
# Jelly
## History
Jelly is a array-oriented, functional and structured programming language created by <a href="https://github.com/DennisMitchell">Dennis Mitchell </a> in 2015.
Jelly is an esoteric language only made for code golf.
As the name of jelly may suggest, jelly is inspired by J. However, unlike J, Jelly does not work with the ascii table but with its own encoding table.
It is one of the shortest languages on WeekGolf, competing with Vyxal.

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Structured_computing">Structured</a>,  <a href="https://en.wikipedia.org/wiki/Array-oriented_programming">Array-oriented</a>,  <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>, <a href="https://en.wikipedia.org/wiki/Esoteric_programming_language">Esoteric</a>.
- Jelly is a high level language

## Program
    +9Ð¡1
           - No input, so left argument (value of a) implicitly zero
    9Ð¡    - Apply 9 times, where a=0 and...
        1  - The right argument (b) = 1
    +      - Addition


<!-- Julia -->
# Julia
## History
Julia is a multi-paradigm language (multiple dispatch, procedural and functional) created by <a href="https://en.wikipedia.org/wiki/Jeff_Bezanson_(programmer)">Jeff Bezanson</a>, <a href="https://en.wikipedia.org/wiki/Stefan_Karpinski">Stefan Karpinski</a>, <a href="">Viral B. Shah</a>, and <a href="https://en.wikipedia.org/wiki/Viral_B._Shah">Alan Edelman</a> in 2012.
Julia was created because the developers of julia wanted a more powerful language with all the advantages of other languages: the speed of C, the dynamism of Ruby, with mathematical notations like in matlab, with the simplicity of programming of python, with the simplicity of R to make statistics... etc.
The developers of julia wanted these positive aspects for a language used in scientific works, basically they wanted to create a new language perfect for the scientific world.
Unfortunately, today Julia is not very used. However, we can note some uses in companies like NASA.

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Structured_computing">Structured</a>,  <a href="https://en.wikipedia.org/wiki/Array-oriented_programming">Array-oriented</a>,  <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>, <a href="https://en.wikipedia.org/wiki/Esoteric_programming_language">Esoteric</a>.
- Julia is a high level language

## Program
    let a=0;b=1
        for i=0:9
            println(a)
            a,b=b,a+b
        end
    end




<!-- K -->
# K
## History
K is an array-oriented and functional programming language designed by <a href="https://en.wikipedia.org/wiki/Arthur_Whitney_(computer_scientist)">Arthur Whitney</a> for <a href="https://en.wikipedia.org/wiki/Kx_Systems">Kx Systems</a> and was made public in 1993.
Although K is also a functional and array-oriented language, like APL; unlike J, K is not intended to be the successor of APL. It is also worth noting that K, like J, uses the ASCII table and not its own table like APL. The goal of K is to analyze a large amount of data, and to be fast. Kx system didn't want to create K to enlarge the world of array oriented languages but decided to have K for economical issues first.
Following K, 10 years later, a programming language named Q was created. The syntax of K being sometimes hard to understand for people who are not used to it, Q is therefore easier to understand with English words replacing ascii characters in K. And Q is also a proprietary software. 
However; even if K belongs to KX System and they don't want to share it too much, there are replicas of K like ngn/K, oK or even Kona. WeekGolf uses the ngn/K repository to run K.

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Array_programming">Array</a>,  <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>.
- K is a high level language
- K uses ASCII table. Not like APL.

## Program
    l: 0 1
    {l::l, +/-2#l}'!8;
    `0: "\n" / $l






<!-- Kotlin -->
# Kotlin
## History

Kotlin is a multi-paradigm language (object-oriented, declarative, concurrent and functional) created by <a href="https://en.wikipedia.org/wiki/JetBrains">JetBrains</a> and officially made public in 2011.
One of the main objectives of Kotlin is the Android development and to replace Java.
In 2016, the first stable version of Kotlin was released. Following this, the next year, Google announced first-class support for Kotlin on Android. As the years passed, Kotlin improved, and in 2019, Google announced that the Kotlin programming language is now its preferred language for Android app developers over Java. Kotlin has thus fulfilled its initial objective.

## Characteristics
- Kotlin does not oblige to create a class to create a simple program, unlike Java.
- Paradigms: <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-Oriented</a>,  <a href="https://en.wikipedia.org/wiki/Declarative_programming">Declarative</a>, <a href="https://en.wikipedia.org/wiki/Concurrent_computing">Concurrent</a>, <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>.
- Kotlin is a high level language

## Program
    fun main() {
        var a = 0
        var b = 1

        repeat(10) {
            println(a)
            b += a
            a = b - a
        }
    }



<!-- Lua -->
# Lua
## History
Lua is a multi-paradigm language (object-oriented, procedural, imperative and functional) created by <a href="https://en.wikipedia.org/wiki/Roberto_Ierusalimschy">Roberto Ierusalimschy</a> and several of his colleagues, and officially made public in 1993.
The Lua interpreter is written in C and is very small compared to other languages and was written to be easy to embed in existing applications to extend them.
Lua is called Lua because in Portuguese it means Moon.
Lua is a language with very few reserved words and is quite different from many other languages.
Lua has only one data type: tables. Compared to languages like Python which have lists, sets, tuples, dictionaries, or even C++ which has lists, arrays, vectors, maps.
Lua is also known to be one of the only "popular" languages with R that has its index, for what can be likened to lists, starting at 1 instead of 0.
Today lua is mostly used in the video game world to make video games that do not require too much computing power, such as Roblox for example.
## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-Oriented</a>, <a href="https://en.wikipedia.org/wiki/Procedural_programming">Procedural</a>, <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>, <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>.
- Lua is a high level language
- Index starts at 1 and not 0

## Program
    a=0 
    b=1
    for _ = 1,10 do
        print(a)
        a,b=b,a+b
    end


<!-- OCaml -->
# OCaml
## History
OCaml is a multi-paradigm language (object-oriented, modular, imperative and functional) created by <a href="https://en.wikipedia.org/wiki/Xavier_Leroy">Xavier Leroy</a> and officially made public in 1996.
Although OCaml has "caml" in its name, OCaml and <a href="https://en.wikipedia.org/wiki/Caml">Caml</a> are not the same programming languages.
Caml, that came out in 1985, was a programming language with the functional paradigm as its first paradigm and the ability to use the imperative paradigm. It is a functional language called impure. However Caml is also a derivative of a language created in the 70's: <a href="https://en.wikipedia.org/wiki/ML_(programming_language)">ML</a>. OCaml unlike Caml and ML is not an impure functional language, but can be considered as a multiparadigm language. Indeed, the O in OCaml stands for Objective Caml. In other words OCaml supports functional, object-oriented and even modular programming.
However, OCaml was not always the successor of Caml.
Indeed, at the time it was <a href="https://fr.wikipedia.org/wiki/Caml_Light">Caml light</a>. However OCaml introduced the object-oriented paradigm and has a better implementation of modular paradigm compared to Caml light. Today Caml Light is obsolete compared to OCaml.
OCaml has no official specification but is maintained by a French team called <a href="https://en.wikipedia.org/wiki/French_Institute_for_Research_in_Computer_Science_and_Automation">INRIA</a>.
## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-Oriented</a>, <a href="https://en.wikipedia.org/wiki/Modular_programming">Modular</a>, <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>, <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>.
- OCaml is a high level language

## Program
    let rec fib a b n =
        Printf.printf "%d\n" a;
        if n > 0 then fib b (a+b) (n-1);;

    fib 0 1 9;;



<!-- Perl -->
# Perl
## History

Perl is a multi-paradigm language (object-oriented, imperative, procedural and functional) created by <a href="https://en.wikipedia.org/wiki/Larry_Wall">Larry Wall</a> in 1987.
The main implementation of Perl is written in C.
When Perl was created, it was intended to be the ideal language for processing text files. Perl's syntax was a mix between C and shell languages, like Bash.
In order for Perl to be good at this, regular expressions (RegEx) and languages like awk and sed are already included in Perl.
In 2001, the version 6 of Perl is announced (however it will be only stable in 2015). However, the difference between Perl 5 and Perl 6 is so big, that Perl 6 becomes a separate language from Perl. This language is called Raku since 2019.
However, the <a href="https://en.wikipedia.org/wiki/Perl_Foundation">Perl Foundation</a> continues to maintain Perl, and the next big version of Perl will be 7, so it will go from 5 => 7 (because v6 is Raku, another language).

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-Oriented</a>,  <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>, <a href="https://en.wikipedia.org/wiki/Procedural_programming">Procedural</a>, <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>.
- Perl is a high level language

## Program
    $a = 0;
    $b = 1;
    for ($i = 0; $i < 10; $i++) {
        print "$a\n";
        ($a, $b) = ($b, $a + $b);
    }


<!-- PHP -->
# PHP
## History

PHP (PHP: Hypertext Preprocessor) is a multi-paradigm language (object-oriented, imperative, procedural and functional) created by <a href="https://en.wikipedia.org/wiki/Rasmus_Lerdorf">Rasmus Lerdorf</a> in 1994.
The main implementation of PHP is written in C
Basically, the language was a library for personal use. But as time went by, new features were added. This led the creator of PHP, to make PHP public in 1995. Then after that, users improved PHP to make it more and more viable and powerful. The syntax of PHP is largely influenced by that of Perl and C/C++.
PHP is now known as a server side / back-end language, which is quite versatile and allows to manage databases for example.
The success of languages depends strongly on the companies that use them, so PHP is popular thanks to companies like FaceBook, WhatsApp, Wikipedia, Yahoo, Etsy and even WeekGolf!(joking) Thanks to these companies, PHP is the <a href="https://w3techs.com/technologies/details/pl-php">most used language</a> to manage server sides in the world. Today, the language still continues to have regular updates.

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-Oriented</a>,  <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>, <a href="https://en.wikipedia.org/wiki/Procedural_programming">Procedural</a>, <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>.
- PHP is a high level language

## Program
    <?php
    $a = 0;
    $b = 1;
    for ($i = 0; $i < 10; $i++) {
        echo "$a\n";
        [$a, $b] = [$b, $a + $b];
    }




<!-- Prolog -->
# Prolog
## History

Prolog is a logic and declarative language written by Alain Colmerauer and Philippe Roussel in 1972.
The name prolog comes from "PROgramming in LOGic", which is faithful to the paradigm of which prolg is part.
Prolog was one of the first programming languages to be part of the logic paradigm. Today it is the most popular logic language, with several free and commercial implementations available. WeekGolf uses the SWI-Prolog implementation. The logic paradigm and prolog have several advantages; it can be a very good choice for theorem proving, databases, Sudoku solving or any task requiring rule-based logical queries. 
## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Logic_programming">Logic</a>,  <a href="https://en.wikipedia.org/wiki/Declarative_programming">Declarative</a>.
- Prolog is a high level language

## Program
    main :-
        f(0,1,12).

    f(I,J,N) :-
        K is J,
        L is I+J,
        M is N-1,
        M>0,
        writeln(I),
        f(K, L, M).



<!-- Python -->
# Python
## History

Python is a multi-paradigm language (object-oriented, imperative and functional) created by <a href="https://en.wikipedia.org/wiki/Guido_van_Rossum">Guido van Rossum</a> and officially made public in 1991.
The main implementation of python is made in C and is called CPython, however, there are other less used implementations made in Java and C#.
Python was heavily influenced by a relatively unknown language called <a href="https://en.wikipedia.org/wiki/ABC_(programming_language)">ABC</a>. The creator of Python himself worked on this language for several years. Python has inherited many things from ABC, like the <a href="https://en.wikipedia.org/wiki/Off-side_rule">off-side rule</a>.
One of the events that has marked Python a lot is the version change. Version 2 and 3 of python have some important differences, which make many programs written in python 2 incompatible with Python3.
The difference is so important that some sites indicate Python 3 to talk about Python 3 instead of just saying Python as in most languages.
Python is a programming language that can be used in many contexts and adapted to any type of use thanks to specialized libraries. Python is a language that is quite simple to understand and write, which means that it can be used to handle a wide variety of tasks. Nevertheless, it is particularly widespread in the scientific world, and has many optimized libraries for numerical computation, most of them written in C.
In October 2021, it becomes the most popular language in the <a href="https://www.tiobe.com/tiobe-index/">TIOBE index</a>.

## Characteristics
- Python uses the <a href="https://en.wikipedia.org/wiki/Off-side_rule">off-side rule</a>
- Paradigms: <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-Oriented</a>,  <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>,  <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>.
- Python is a very high level language
- The convention in python is to use the snake case

## Program
    a = 0
    b = 1
    for i in range(10):
        print(a)
        a, b = b, a+b





<!-- R -->
# R
## History
R is a multi-paradigm language (array-oriented, object-oriented, procedural, imperative and functional) created by <a href="https://en.wikipedia.org/wiki/Ross_Ihaka">Ross Ihaka</a> and  <a href="https://en.wikipedia.org/wiki/Robert_Gentleman_(statistician)">Robert Gentleman</a>, and officially made public in 1995.
The main implementation of R is written in C.
R is an implementation of the S programming language with the added lexical scoping of Scheme. The name R, comes from the fact that both designers of R, had a first name that started with R, and that S had only one letter.
R is also known to be one of the only "popular" languages with lua that has its index, for what can be likened to lists, starting at 1 instead of 0.
R is mostly used to do statistics, machine learning or any program related to science. This is due to the paradigm that R uses, namely the array-oriented paradigm.
## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Array-oriented_programming">Array-Oriented</a>, <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-Oriented</a>, <a href="https://en.wikipedia.org/wiki/Procedural_programming">Procedural</a>, <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>, <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>.
- R is a high level language
- Index starts at 1 and not 0

## Program
    a=0
    b=1
    for(i in 1:10){
        cat(b<-(a=a+b)-b)
        cat("\n")
    }




<!-- Raku -->
# Raku
## History

Raku, also known as Perl 6,  is a multi-paradigm language (object-oriented, imperative, procedural and functional) created by <a href="https://en.wikipedia.org/wiki/Larry_Wall">Larry Wall</a> and officially made public in 2015.
Raku was until 2019 simply called "Perl 6".
Raku is derived from Perl and was originally intended to be "just" a major version of Perl. However, as Raku's development progressed, more and more features were added, and then Perl6 became further and further away from Perl5. Until Perl6 became another language in its own right.
It was already clear from the beginning that Perl5 would not have backward compatibility with Perl6, but it should not become a separate language. Python has had its version 2 and 3, and yet both are called python while there is no backward compability.
Raku took a long time to come out (15 years). And it is a Christmas of 2015 that the first version of Raku is officially announced.
Raku has the same objectives as perl, and gives great importance to regular expressions (RegEx) and has several languages included in it like awk and sed.

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-Oriented</a>,  <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>, <a href="https://en.wikipedia.org/wiki/Procedural_programming">Procedural</a>, <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>.
- Raku is a high level language

## Program
    my $a = 0;
    my $b = 1;
    for 0..9 {
        say $a;
        ($a, $b) = ($b, $a + $b);
    }




<!-- Ruby -->
# Ruby
## History

Ruby is a multi-paradigm language (object-oriented, imperative and functional) created by Matz (<a href="https://en.wikipedia.org/wiki/Yukihiro_Matsumoto">Yukihiro Matsumoto</a>) and officially made public in 1995.
The main implementations of Ruby are written in C.
Although Ruby was released in 1995, it was not immediately popular. It is from 2004-2006 that Ruby begins to gain notoriety thanks to the creation of the Ruby on Rails Framework.
Until the early 2010s, the trajectories of Ruby and Python were quite similar, language written in the early 90s, similar paradigm, high level of abstraction, readable "syntax", interpreted, written in C etc... In 2011 Ruby even made it into the TOP10 languages in the <a href="https://www.tiobe.com/tiobe-index/">TIOBE index</a>. However, Ruby's rise took a big hit when Ruby on Rails stopped becoming more and more popular. Since then, Ruby has been losing popularity year after year.

## Characteristics
- Ruby is strongly object oriented: any data is an object, any function is a method, any variable is a reference to an object
- Paradigms: <a href="https://en.wikipedia.org/wiki/Object-oriented_programming">Object-Oriented</a>,  <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>,  <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>.
- Ruby is a very high level language

## Program
    a = 0
    b = 1
    10 times do
        p a
        a, b = b, a+b
    end




<!-- Rust -->
# Rust
## History
Rust is a multi-paradigm language (concurrent, imperative and functional) created by <a href="https://github.com/graydon">Graydon Hoare</a> and its officially first stable version was released in 2015.
The topics Rust wants to be good at are: Performance, Reliability and Productivity
The Rust compiler was previously written in OCaml
Rust was not officially made to replace C/C++, however, unofficially, the areas of use of Rust are quite similar to C/C++ and there are quite a few similarities, and the more time passes, the more people consider Rust as a serious successor to C/C++.
Rust was originally a personal project, but since 2009 Mozilla has been working on the Rust project and now represents the language development team.
Rust is a fairly new language, so its history is not as storied as C's, however, it is clearly the most promising language.
Rust entered the TOP20 of the <a href="https://www.tiobe.com/tiobe-index/">TIOBE index</a > in October 2022.

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Concurrent_computing">Concurrent</a>,  <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>,  <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>.
- Rust is a Low/Medium level language

## Program
    fn main() {
        let mut a = 0;
        let mut b = 1;
        
        for i in 0..10 {
            println!("{}", a);
            a = b - a;
            b += a;
        }
    }



<!-- Vyxal -->
# Vyxal
## History
Vyxal is a multi-paradigm language (concurrent, esoetric, imperative and functional) created by <a href="https://github.com/Lyxal">Lyxal</a> in 2020.
Vyxal is an esoteric language only made for code golf even if it can be used to make programs like a <a href="https://github.com/Lyxal/2048-in-Vyxal">2048 game</a>.
Vyxal uses its own encoding table, like Jelly or APL, because the ASCII table does not have enough characters.
Vyxal has had two major releases, even though it is a fairly recent language (2020).
It is one of the shortest languages on WeekGolf, competing with Jelly.

## Characteristics
- Paradigms: <a href="https://en.wikipedia.org/wiki/Concurrent_computing">Concurrent</a>,  <a href="https://en.wikipedia.org/wiki/Imperative_programming">Imperative</a>,  <a href="https://en.wikipedia.org/wiki/Functional_programming">Functional</a>, <a href="https://en.wikipedia.org/wiki/Esoteric_programming_language">Esoteric</a>.
- Vyxal is a high level language

## Program
    0 →a
    1 →b
    10 (
        ←a ,
        ←a ←b ~+ →b →a 
        _ # Remove the value of a left by ~+
    )