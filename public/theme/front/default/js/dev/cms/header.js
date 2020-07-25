import Area from "../../../../../../js/production/area.js";

export default function Header({id, className}) {
    return <div className={className}>
        <div className="container">
            <div className="row">
                <div className="col-4">
                    <Area id={"header_left"} className="d-flex justify-content-start"/>
                </div>
                <div className="col-4">
                    <Area id={"header_center"} className="d-flex justify-content-center"/>
                </div>
                <div className="col-4">
                    <Area id={"header_right"} className="d-flex justify-content-end"/>
                </div>
            </div>
        </div>
    </div>
}