import { createSignal, useContext } from "solid-js";
import "../style/ValidateEmail.scss";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { DisplayMessageContext, DisplayMessageProviderType } from "../hooks/createDisplayMessage";


const ValidateEmail = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [code, setCode] = createSignal('');
    const { handleError } = useContext(DisplayMessageContext) as DisplayMessageProviderType;
    const navigate = useNavigate();

    // Function to submit the code
    const submitCode = () => {
        const requestOptions: object = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(
                {
                    code: code(),
                    email: searchParams.email ?? localStorage.getItem("email")
                }
            )
        }
        
        // fetch("http://localhost:5000/api/v1/code", requestOptions)
        fetch("http://localhost:5000/api/v1/code", requestOptions)
        .then(rep => rep.json())
        .then(rep => {
            if (rep.error || rep.valid === false) {
                handleError("This code is invalid.");
            } else {
                localStorage.setItem("token", rep.token);
                setTimeout(() => navigate("/problems"), 10);
            }
        })
    }



    return <section class="ValidateEmail">
        <main>
            <h1>We sent an e-mail<br/>to {searchParams.email ?? "your email"}</h1>
            Don't forget to check your spams!<br/>
            <textarea
                onchange={(e) => setCode((e.currentTarget as HTMLTextAreaElement).value)}
                placeholder="XXXXXX"
                maxlength="6"
            />
            <button onclick={submitCode}>Submit</button>
        </main>
    </section>;
}


export default ValidateEmail;