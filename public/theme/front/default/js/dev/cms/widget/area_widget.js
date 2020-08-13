import Area from "../../../../../../../js/production/area.js";

export default function AreaWidget({id, areaId, template, columns = [], containerClass}) {
    return <div className={containerClass + " " + id + "-area-widget area-widget-container"}>
        {columns.map((c, i) => {
            return <div className={c.className + " " + "col-md-" + c.number + " col-12"} key={i}>
                <Area
                    id={areaId + "_" + i}
                    noOuter={true}
                />
            </div>
        })}
    </div>
}