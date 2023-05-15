import { Show, createEffect, createSignal, useContext } from 'solid-js';
import '../style/DisplayMessage.scss';
import { DisplayMessageContext, DisplayMessageProviderType } from '../hooks/createDisplayMessage'
import cross  from '../assets/icons/cross.svg'
import info from '../assets/icons/info.svg'
import check from '../assets/icons/checkbox.svg'



const DisplayMessage = () => {
    const {showMessage, message, type, handleHide} = useContext(DisplayMessageContext) as DisplayMessageProviderType;


    const colors: any = {
        err: {
            'background-color': "#B43E",
            color: "#fcc",
            icon: <img src={cross}/>
        },

        info: {
            'background-color': "#467E",
            color: "#cef",
            icon: <img src={info}/>
        },

        correct: {
            'background-color': "#4B6E",
            color: "#cfd",
            icon: <img src={check}/>
        }
    }

    return <Show when={showMessage()}>
        <div class="DisplayMessage" onClick={handleHide} style={{...colors[type()], icon: "none"}}>
            {
                colors[type()].icon
            }
            {
                message()
            }
        </div>
    </Show>;
}

export default DisplayMessage;