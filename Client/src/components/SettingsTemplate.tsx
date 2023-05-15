const SettingsTemplate = (props: any) => {

    console.log(props.forwardRef)

    return <section>
        <div class="title" ref={el => props.forwardRef[props.title] = el}>
            {props.title}
        </div>
        <div class="line"></div>
        <div class="content-section">
            {props.JSX}
        </div>
        <div style={{height: "20px"}}/>
    </section>
}

export default SettingsTemplate;