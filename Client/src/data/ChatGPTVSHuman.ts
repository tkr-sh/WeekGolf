

const data = [
    // Stylish calendar
    {
        // The lang
        "lang": "python",
        // The problem (id=26)
        "problem": `You will be given an int n and n strings of digits as input.
Therefore, n will correspond to the number of lines and the strings will be composed of "#" and spaces.
The goal of this problem will be to transform the schema of a calendar into a numbered calendar that can be easily read and understood by humans.
Calendars are read from left to right and from top to bottom.
And every time you meet a #, the day increases.
For the display to be nice, and well aligned, there will be a space between each number and the numbers less than 10 will have a zero in front of them (4 => 04)`,
        // Solution by Lyndon
        "human": `n=0
exec("int(*[ord(c)%5*c or'%02d'%(n:=n+1)for c in input()]);pr"*9)`,
        // Real ChatGPT answer.
        // Modification made was 4 spaces to 1
        "chatgpt": `n=int(input());d=1
for r in range(n):
 t=""
 for c in (s:=input()):t+=f"{d:02d} "*(c=="#");d+=c=="#"
 print(t[:-1]) if "#" in s else d-1`,
    },

    // Not lychrel
    {
        // The lang
        "lang": "javascript",
        // The problem (id=14)
        "problem": `One integer will be given as input.
This problem consists in proving that a number is not a lychrel number.
To find out if a number n is not a lychrel number, as long as the number n is not a palindrome, we add its mirror (i.e. we swap the order of the numbers) to it. n := n + mirror(n)
If at any time n is a palindrome, then it is not a lychrel number.
A proof that a number is not a lychrel number, is to give the number of iterations after which, n became palindrome. So you will have to output this.`,
        // Solution by Lyndon
        "human": `for(n=prompt(i=0);;n-r?i++:console.log(i)._,n-=-r)for(c of[r='']+n)r=c+r`,
        // Real ChatGPT answer.
        "chatgpt": `let n=prompt(),i=0;while(n!=(n=[...n+''].reverse().join(''))&&i++<500)n=BigInt(n)+BigInt(n.split\`\`.reverse().join\`\`);console.log(i);`
    },

    // Fibonacci & Binary
    {
        // The lang
        "lang": "c",
        // The problem (id=1)
        "problem": `You will be given a string as Input.
First, you need to do the sum of the number of 1 in the binary expression of each char in the string.
Secondly, you should output the First 16 terms of the Fibonacci sequence with first term a = 0 and b = the_previous_sum on different lines`,
        // Solution by Lyndon
        "human": `n,a,b;main(i){for(;i<17;)~n?n=n?a+=n&1,n/2:getchar():printf("%d\n",a=b-a,b+=a,i++);}`,
        // Real ChatGPT answer
        "chatgpt": `#include<stdio.h>
int c(int n){int s=0;while(n){s+=n&1;n>>=1;}return s;}
int main(){char s[101];int i=0,a=0,b=0,t;fgets(s,101,stdin);while(s[i])a+=c(s[i++]);printf("0\n%d\n%d\n",a,b=a);for(i=2;i<15;i++)t=a+b,a=b,b=t,printf("%d\n",t);return 0;}`
    }
];





export default data;