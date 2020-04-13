import Area from "../../../../../../../js/production/area.js";

export default function DashboardLayout() {
    return React.createElement(
        React.Fragment,
        null,
        React.createElement(Area, { id: "admin_dashboard_top", widgets: [] }),
        React.createElement(
            "div",
            { className: "row" },
            React.createElement(Area, { id: "admin_dashboard_middle_left", coreWidgets: [], className: "col-8" }),
            React.createElement(Area, { id: "admin_dashboard_middle_right", coreWidgets: [], className: "col-4" })
        ),
        React.createElement(Area, { id: "admin_dashboard_bottom", widgets: [] })
    );
}