import "../style/Toggle.scss"


const Toggle = (props: any) => {
    return <label
        class="toggle-switch"
    >
        <input
            type="checkbox"
            checked={props.default ?? true}
            onChange={(e) => e.currentTarget.checked ? props.on() : props.off()}
        />
        <span class="slider"/>
    </label>;
}

export default Toggle;