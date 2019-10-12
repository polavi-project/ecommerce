import Area from "./../area.js"

function FormGroup({id, name}) {
    return <div id={id} className={id + "-content-inner group-form"}>
            <div className="group-form-title"><span>{name}</span></div>
            <Area id={id} widgets={[]}/>
    </div>
}

export default FormGroup