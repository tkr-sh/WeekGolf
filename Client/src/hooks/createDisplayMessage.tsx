import { createContext, createEffect, createSignal } from "solid-js";
import type { Context } from "solid-js";



export const DisplayMessageContext = createContext();


export interface DisplayMessageProviderType {
    showMessage: () => boolean,
    message: () => string,
    type: () => string,
    handleHide: () => void,
    handleError: (msg: string) => void,
    handleInfo: (msg: string) => void,
    handleCorrect: (msg: string) => void,
}


export const DisplayMessageProvider = (props: any) => {
    const [showMessage, setShowMessage] = createSignal<boolean>(false, {equals: false});
    const [message, setMessage] = createSignal<string>("", {equals: false});
    const [type, setType] = createSignal("err", {equals: false});
    const [timeOutId, setTimeOutId] = createSignal<null | NodeJS.Timeout>(null, {equals: false});

    const resetTimer = () => {

        const id = timeOutId();

        if (id !== null) {
            clearInterval(id);
        }

        const tempTimeOut: NodeJS.Timeout = setTimeout(() => handleHide(), 10_000)
        setTimeOutId(tempTimeOut);
    }


    createEffect(() => {
        // console.log(showMessage());
        // console.log(message());
        // console.log(type());
    })

    const handleError = (msg: string) => {
        setType("err");
        setMessage(msg);
        setShowMessage(true);
        resetTimer();
    };

    const handleInfo = (msg: string) => {
        setType("info");
        setMessage(msg);
        setShowMessage(true);
        resetTimer();
    };

    const handleCorrect = (msg: string) => {
        setType("correct");
        setMessage(msg);
        setShowMessage(true);
        resetTimer();
    };

    const handleHide = () => {
        setShowMessage(false);
    };

    return (
        <>
        <DisplayMessageContext.Provider value={{ showMessage, handleHide, handleError, handleInfo, handleCorrect, message, type } as DisplayMessageProviderType}>
            {props.children}
        </DisplayMessageContext.Provider>
        </>
    );
};