import { Component, For, Index, createEffect, createSignal, onMount } from 'solid-js';
import "../style/Home.scss";
import { A } from '@solidjs/router';
import MonacoEditor from '../components/IDE';
import colorLang from "../data/colorLang.json";
import BasicFooter from '../layout/BasicFooter';
import CodeBlock from '../components/CodeBlock';
import data from '../data/ChatGPTVSHuman';

interface langCodeType {
	code: string,
	lang: string,
}



const languagesCode: langCodeType[] = [
	{
		code: "a ← 0\nb ← 1\nNext ← {\n\tsum ← +/ ⍵\n\tsum , ⎕ ← ⊃ ⍵\n}\nNext ⍣ 10 ⊢ a b",
		lang: "APL",
	},
	{
		code: "a=0\nb=1\n\nfor ((i=0; i<10; i++)); do\n\techo $a\n\ta=$((b-a))\n\tb=$((b+a))\ndone",
		lang: "Bash",
	},
	{
		code: "#include <stdio.h>\n\nint main (void) {\n\tint a = 0, b = 1;\n\n\tfor (int i = 0; i < 10; i++){\n\t\tprintf(\"%d\\n\", a);\n\t\ta = b - a;\n\t\tb += a;\n\t}\n\n\treturn 0;\n}",
		lang: "C",
	},
	{
		code: "\n(def fib-seq-seq\n((fn fib [a b] \n\t(lazy-seq (cons a (fib b (+ a b)))))\n0 1))\n\n(println (clojure.string/join \"\n\" (take 10 fib-seq-seq)))",
		lang: "Clojure",
	},
	{
		code: "defmodule Fib do \n\tdef fib(0) do 0 end\n\tdef fib(1) do 1 end\n\tdef fib(n) do fib(n-1) + fib(n-2) end\nend\n\nfor i <- 0..9 do\n\tIO.puts Fib.fib(i)\nend",
		lang: "Elixir",
	},
	{
		code:"package main\n\nimport \"fmt\"\n\nfunc main() {\n\ta, b := 0, 1\n\t\n\tfor i := 0; i < 10; i++ {\n\t\tfmt.Println(a)\n\t\ta = b - a\n\t\tb += a\n\t}\n}",
		lang: "Go",
	},
	{
		code: "fib :: Int -> Int -> Int -> IO()\nfib a b 0 = print a\nfib a b n = do\n\tprint a \n\tfib b (a+b) (n-1)\n\t\nmain = do\n\tfib 0 1 9",
		lang: "Haskell",
	},
	{
		code: "fibN =: (-&2 +&$: -&1)^:(1&<) M.\"0\necho fibN  i.10\nexit ''",
		lang: "J",
	},
	{
		code: "class prog {\n\tpublic static void main(String[] args) {\n\t\tint a = 0, b = 1;\n\n\t\tfor (int i = 0; i < 10; i++){\n\t\t\tSystem.out.println(a);\n\t\t\ta = b - a;\n\t\t\tb += a;\n\t\t}\n\t}\n}",
		lang: "Java",
	},
	{
		code: "let a = 0, b = 1;\n\nfor (let i = 0; i < 10; i++) {\n\tconsole.log(a);\n\t[a, b] = [b, a+b]\n}",
		lang: "JavaScript",
	},
	{
		code: "+9Ð¡1\n\t   - No input, so left argument (value of a) implicitly zero\n9Ð¡\t- Apply 9 times, where a=0 and...\n\t1  - The right argument (b) = 1\n+\t  - Addition",
		lang: "Jelly",
	},
	{
		code: "l: 0 1\n{l::l, +/-2#l}'!8;\n`0: \"\n\" / $l",
		lang: "K",
	},
	{
		code: "fun main() {\n\tvar a = 0\n\tvar b = 1\n\n\trepeat(10) {\n\t\tprintln(a)\n\t\tb += a\n\t\ta = b - a\n\t}\n}",
		lang: "Kotlin",
	},
	{
		code: "let rec fib a b n =\n\tPrintf.printf \"%d\n\" a;\n\tif n > 0 then fib b (a+b) (n-1);;\n\nfib 0 1 9;;",
		lang: "OCaml",
	},
	{
		code: "<?php\n$a = 0;\n$b = 1;\nfor ($i = 0; $i < 10; $i++) {\n\techo \"$a\n\";\n\t[$a, $b] = [$b, $a + $b];\n}",
		lang: "PHP",
	},
	{
		code: "main :-\n\tf(0,1,12).\n\nf(I,J,N) :-\n\tK is J,\n\tL is I+J,\n\tM is N-1,\n\tM>0,\n\twriteln(I),\n\tf(K, L, M).",
		lang: "Prolog",
	},
	{
		code: "a = 0\nb = 1\nfor i in range(10):\n\tprint(a)\n\ta, b = b, a+b",
		lang: "Python",
	},
	{
		code: "my $a = 0;\nmy $b = 1;\nfor 0..9 {\n\tsay $a;\n\t($a, $b) = ($b, $a + $b);\n}",
		lang: "Raku",
	},
	{
		code: "a = 0\nb = 1\n10.times do\n\tp a\n\ta, b = b, a+b\nend",
		lang: "Ruby",
	},
	{
		code: "fn main() {\n\tlet mut a = 0;\n\tlet mut b = 1;\n\t\n\tfor i in 0..10 {\n\t\tprintln!(\"{}\", a);\n\t\ta = b - a;\n\t\tb += a;\n\t}\n}",
		lang: "Rust",
	},
	{
		code: "0 →a\n1 →b\n10 (\n\t←a ,\n\t←a ←b ~+ →b →a \n\t_ # Remove the value of a left by ~+\n",
		lang:  "Vyxal"
	}
]



const codeSample: string[] = [
	"a=b=sum(map(int.bit_count,*open(0,'rb')))",
	"b=-a=gets.unpack1('b*').sum%96",
	'$input|% t*y|%{$b+=[int]::PopCount($_)}',
	"$_=(print$%,$/)x$%.!($%+=y/1//)","for(unpack'b*',<>)x16",
	"s=0:[16*x+y|x<-s,y<-[10..15]]",
	"⎕←⌊/|⎕-16⊥¨,,\\9+↑⍳5⍴6",
	"get~~say (0...{!base($_-$^x&$_+$x: 16).comb(/\d/)})-1",
	"Þn+≬HʀAcε",
	"fn f(x:i32)->bool{x>0&&(x%16<10)|f(x/16)}",
	"$>.<<s[27..].tr'A-Z',s",
	'eval"y/A-Z/".<>."/,print for<>"',
	"interface prog{static void main(String[]a){}}",
	"$><<gets.split",
	"for(b=(P=prompt)(a=P(t=0)-1);;);",
	"say (get,{$_+.flip}...* *2==*)-2",
	"#1_($+/?.'|:\\)\\1:0",
	'echo(>:@$:@+`>@.=|.&.":)".1!:1<3',
	'0\{"BGHYXIC"?"2~2.02(*)/p/+ ">7%~}/;',
	"#!perl -p",
	"N←•Fmt≠|+´∘-⟜@",
	"<?php",
]


console.log(data);

const Home: Component = () => {
	const [wordStart, setWordStart] = createSignal("Golfing");
	const [indexIde, setIndexIde] = createSignal(0, {equals: false});
	const [program, setProgram] = createSignal(languagesCode, {equals: false});
	const [currentProg, setCurrentProg] = createSignal(program().slice(0,3), {equals: false});
	const [GPTVSHUMAN, setGPTVSHUMAN] = createSignal(data[Math.floor(Math.random() * data.length)])
	let codeRef: HTMLElement[] = [];
	const [coef, setCoef] = createSignal<number[]>([]);


	window.addEventListener("mousemove", (event: MouseEvent) => {
		console.log(event.x)

		const eventX: number = event.x;
		const eventY: number = event.y;
		const coefVal = coef();

		codeRef.forEach((e,i) => 
			// e.style.transform = `translate(${event.x / 10}px - 50%, ${event.y / 10}px - 50%)`
			e.style.transform = `translate(${eventX / (2000 / coefVal[i] ** 2) - 400}px, ${eventY / (2000 / coefVal[i] ** 2) - 400}px)`
		);
	});

	// Remove text from wordStart
	const removeText = () => {
		setTimeout(() => {
			setWordStart(p => p.slice(0, -1));
			if (wordStart().length > 0) {
				removeText();
			}
		}, 50);
	}

	// Add text to wordStart
	const addText = (str: string, i: number=0) => {
		setTimeout(() => {
			if (str[i] !== undefined) {
				setWordStart(p => p + str[i]);
			}

			if (wordStart().length !== str.length) {
				addText(str, i+1);
			}
		}, 60);
	}

	// Loop for the wordStart 
	const loopWord = () => {
		const words = ["Thinking", "Enjoyment", "Learning", "Problem-Solving", "Golfing"]
		for (let i = 0; i < 5; i++) {
			setTimeout(() => {
				removeText();
			}, 3_000 * -~i);

			setTimeout(() => {
				addText(words[i]);
			}, 1_000 + 3_000* -~i);
		}

		setTimeout(loopWord, 15_000)
	}

	// Rotate the IDE
	const rotateIDE = () => {
		setIndexIde(i => i + 1);
		setProgram(p => [...p, p[indexIde() - 1]])
		
		if (indexIde() % languagesCode.length === 0) {
			setProgram(languagesCode);
			setIndexIde(0);
		}
	}

	// The loop to rotate
	const loopRotateIde = () => {
		rotateIDE();
		setTimeout(loopRotateIde, 3_000);
	}

	// When mounted, start the loop
	onMount(() => {
		// Start the loop for the word
		loopWord();

		loopRotateIde();
	});

	createEffect(() => {
	});


    return (
		<span>
		<main class='home'>
			{/* Home */}
			<section class='home'>
				<h1>
					Welcome to <span class="word weekgolf">WeekGolf</span>
					<span class="dotnet">.<span class="word">net</span></span>,
				</h1>
    			<h1>and start <span class="word">{wordStart()}</span><span class="cursor"/> now.</h1>
				<div class="content-button">
					<A href="/login">
						Login
					</A>
					<A href="/sign-up">
						Sign up
					</A>
				</div>
				<div class='content-code'>
				<Index each={codeSample}>
					{
						(l,i) => {
							const tempCoef = Math.random() * 30 + 20;
							
							setCoef(p => [...p, tempCoef]);

							return <span
								class='code-example'
								ref={el => codeRef[i] = el}
								style={
									{
										top: Math.random() * window.innerHeight + "px",
										left: Math.random() * window.innerWidth + "px",
										"font-size": tempCoef + "px"
									}
								}
							>
								{l()}
							</span>
							}
					}
				</Index>
				</div>

			</section>

			{/* Languages */}
			<section class='languages'>
				{
					["python", "lua", "apl", "jelly", "prolog", "c", "haskell"]
					.map(l => 
						<img
							src={`src/assets/icons/${l}_white.svg`}
							alt={l}
							class="lang"
						/>
					)

				}
				<aside>
					<Index each={program()}>
					{
						(p, i) => {
							console.log(p(), i);

							return <div class={"ide-" + Math.min(i + 1 - indexIde(), 3)} style={{				"margin-left": indexIde() > i ? "-2000px" : "0",
							"margin-top": indexIde() > i ? `-${1000 * i}px` : "0",
							"display": indexIde() > i ? `none` : "block"}}>
								<CodeBlock
									code={p().code}
									language={p().lang.toLowerCase()}
									bytes={false}
									info={p().lang}
								/>
								<div class="filter-lang" style={{'background': (colorLang as {[key: string]: string})[p().lang.toLowerCase()]}}>
									<img src={`src/assets/icons/${p().lang.toLowerCase()}_white.svg`}/>
									<h3>{p().lang}</h3>
								</div>
							</div>
						}
					}
					</Index>
				</aside>
				<main>
					<h2>Over 30 languages</h2>
					<p>
						You can try to solve the challenges in more than 30 different programming languages.<br/>
						There are all kinds of languages, whether high-level or low-level, object-oriented, functional or even array-oriented.<br/>
						In addition to that, a new programming language is added every month after a vote from the community.<br/>
					</p>
				</main>
			</section>


			{/* ChatGPT section */}
			<section class="chat-gpt">
				<aside>
					<h2>Become better than ChatGPT</h2>
					<p style={{display: 'block'}}>
						<b>Code golf</b> is one of the few areas in computer programming where ChatGPT is deeply inadequate.
						<span style={{height: '5px', display: "block"}}></span>
						This is due to the complexity of the practice, the limited sample size, the variety of problems, and the need for reflection.
						<span style={{height: '5px', display: "block"}}></span>
						Someone who regularly practices code golf is almost certain to be better at it than ChatGPT.
						<span style={{height: '5px', display: "block"}}></span>
						And even in well-known languages like Python, JavaScript, or C, humans are better at code golf than ChatGPT.
					</p>
				</aside>
				<main>
					<CodeBlock
						code={GPTVSHUMAN().chatgpt}
						language="javascript"
						bytes={true}
						info={"ChatGPT"}
					/>
					<div class="vs">
						<img src={"src/assets/icons/openai.svg"}/>
						<b>VS</b>
						<img src={"src/assets/icons/nouser_black.svg"}/>
					</div>
					<CodeBlock
						code={GPTVSHUMAN().human}
						language="javascript"
						bytes={true}
						info={"Human"}
					/>
				</main>
			</section>


			<section class="last">
				<h1>
					Want to try ?
				</h1>
				<button>
					<A href="/sign-up">
						Create an account!
					</A>
				</button>
			</section>
      	</main>
		<BasicFooter/>
		</span>
    );
}



export default Home;
