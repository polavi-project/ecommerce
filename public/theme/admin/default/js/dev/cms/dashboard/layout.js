import Area from "../../../../../../../js/production/area.js"

export default function DashboardLayout() {
    return <React.Fragment>
        <Area id="admin_dashboard_top" widgets={[]}/>
        <div className="row">
            <Area id="admin_dashboard_middle_left" coreWidgets={[]} className="col-8"/>
            <Area id="admin_dashboard_middle_right" coreWidgets={[]} className="col-4"/>
        </div>
        <Area id="admin_dashboard_bottom" widgets={[]}/>
    </React.Fragment>
}