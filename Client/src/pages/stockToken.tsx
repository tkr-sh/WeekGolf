import { useNavigate, useSearchParams } from "@solidjs/router";
import { onMount, useContext } from "solid-js";
import { DisplayMessageContext, DisplayMessageProviderType } from "../hooks/createDisplayMessage";


const StockToken = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const {handleError} = useContext(DisplayMessageContext) as DisplayMessageProviderType;

    // When mounted, stock the token or say that there is an error
    onMount(() => {
        if (searchParams.token === undefined) {
            handleError("An error occured while trying to create your account");
            navigate("/");
        } else {
            localStorage.setItem("token", searchParams.token);
            setTimeout(() => navigate("/problems"), 10);
        }
    });

    return <div></div>
}


export default StockToken;