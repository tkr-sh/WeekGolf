import { Component, For, Show, createSignal, useContext } from 'solid-js';
import "../style/SignUp.scss";
import { A, useNavigate } from '@solidjs/router';
import { DisplayMessageContext, DisplayMessageProviderType } from '../hooks/createDisplayMessage';


const SignUp = (props: any) => {
    // Constant
    const login: boolean = props.login;
    // Hooks
    const [typePwd, setTypePwd] = createSignal("password");
    const [email, setEmail] = createSignal("");
    const [name, setName] = createSignal('');
    const [pwd, setPwd] = createSignal('');
    const [fetching, setFetching] = createSignal(false);
    //// Handle the errors
    const { handleError } = useContext(DisplayMessageContext) as DisplayMessageProviderType;
    //// Navigate
    const navigate = useNavigate();


    // oAuth2
	const handleOAuth2 = (oauth2: string) => {
		if (oauth2 === "discord")
			document.location.href = `https://discord.com/api/oauth2/authorize?client_id=1093490702844973056&redirect_uri=https%3A%2F%2Fapi.weekgolf.net%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=email%20identify`
		else 
			document.location.href = `http://localhost:5000/auth/${oauth2}`;
	}


    /**
     * Handle the submit of the form
     * 
     * @param e Event
     */
    const handleSubmit = (e: Event) => {

        e.preventDefault()

        
        if (login) {
            const requestOptions: object = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({name: name(), pwd: pwd()})
            }

            // Say that we start fetching
            setFetching(true);

            // Fetch
            fetch('http://localhost:5000/api/v1/login', requestOptions)
            .then(rep => rep.status >= 400 ?
                rep :
                rep.json()
            )
            .then(rep => {
                // If the token is valid
                if (rep !== undefined && rep !== null && typeof rep !== 'string' && rep.token !== undefined) {
                    localStorage.setItem('token', rep.token);
                    setTimeout(() => {
                        navigate("/problems");
                    }, 100);
                } else {
                    handleError(rep);
                }

                setFetching(false);
            });
        } else {
            const requestOptions: object = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({email: email(), name: name(), pwd: pwd()})
            }

            // Say that we start fetching
            setFetching(true);

            // Fetch
            fetch('http://localhost:5000/api/v1/create-account', requestOptions)
            .then(async (rep) => {
                const status = rep.status;

                // If the rep is valid
                if (status === 200) {
                    localStorage.setItem('email', email());
                    setTimeout(() => {
                        navigate("/validate-email?email="+email());
                    }, 10);
                } else {
                    handleError(await rep.text());
                }

                setFetching(false);
            });

        }
    }

    // Show the password or not
    const showPwd = () => {
        setTypePwd(p => p === "password" ? "text" : "password")
    }

    return (<div class="SignUp">
        <main id="main-content">
            <form
                onSubmit={handleSubmit}
            >
                {/* Basic sign up / Login */}
                <h1>
                    {
                        login ?
                        "Log in" : 
                        "Create an account"
                    }                
                </h1>


                {/* Form content */}
                <Show when={!login}>
                    {/* The name of the user */}
                    <div class="textarea"> 
                        <img
                            src='src/assets/icons/person_icon.svg'
                            class='icon-input'
                            alt="Icon of a person"
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            id="user_name"
                            name="username"
                            onChange={(e) => setName(e.currentTarget.value)}
                        />
                    </div>

                    {/* The e-mail of the user */}
                    <div class="textarea"> 
                        <img
                            src='src/assets/icons/mail.svg'
                            class='icon-input'
                            alt="Icon of a mail"
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            name="email"
                            onChange={(e) => setEmail(e.currentTarget.value)}
                        />
                    </div>
                </Show>

                <Show when={login}>
                    {/* The name or the e-mail (stored as name) */}
                    <div class="textarea"> 
                        <img
                            src='src/assets/icons/person_icon.svg'
                            class='icon-input'
                        />
                        <input
                            type="text"
                            placeholder="Username or E-mail"
                            id="user_name"
                            onChange={(e) => setName(e.currentTarget.value)}
                        />
                    </div>
                </Show>
                {/* The password */}
                <div class="textarea" style="grid-template-columns: 50px 350px 50px;"> 
                    <img
                        src='src/assets/icons/lock.svg'
                        class='icon-input'
                    />
                    <input
                        type={typePwd()}
                        placeholder="Password"
                        onChange={(e) => setPwd(e.currentTarget.value)}
                    />
                    {/* Eye icon to show password */}
                    <img
                        src="src/assets/icons/eye.svg"
                        onclick={showPwd}
                        id="eye"
                    />
                </div>

                {/* Submit the form */}
                <label for="submit">
                    <input
                        type="submit"
                        name='submit'
                        id='submit'
                        style={{"display": "none"}}
                    />
                    <button
                        class="submit"
                        onclick={() => console.log("test")}
                    >
                    {   
                        fetching() ?
                        '...' :
                            login ?
                            "Log in" : 
                            "Sign up"
                    }           
                    </button>
                </label>

                {/* Or use oauth2 */}
                <div class="OR">OR</div>

                {/* oAuth2 login */}
                <section id="content-oauth2">
                    <For each={["discord", "stack", "github"]}>
                        {
                            e =>
                            <div class={`box-oauth2 ${e}`} onclick={() => handleOAuth2(e)}>
                                <img src={`src/assets/icons/${e}.svg`}/>
                            </div>
                        }
                    </For>
                </section>
            </form>
        </main>

        {/* Green circle */}
        <aside id="circle-green"/>

        {/* Change of form: login <=> sign up */}
        <aside class="change-form">
            <div class="OR">OR</div>
            {   
                    login ?
                    <span>Don't have<br/>an account ?</span> :
                    <span>Already have<br/>an account ?</span>
            }
            <A href={login ? "/sign-up" : "/login"}>
                <button>
                {   
                    login ?
                    "Sign up" :
                    "Log in"
                }   
                </button>  
            </A>
            <div class="img-content">
                <img src="src/assets/icons/golfer.svg" id="golfer"/>
                <img src="src/assets/icons/weekgolfwhite.svg" id="logo_golf"/>
            </div>
        </aside>
      </div>
    );
}



export default SignUp;