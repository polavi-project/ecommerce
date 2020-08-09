import Area from "../../../../../../js/production/area.js";

export default function Content({id, className}) {
    return <div className={className}>
        <Area id={id} className="row"/>
    </div>
}