var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../js/production/area.js";

export default function LeftColumn(props) {
    const getWidgets = widgets => {
        return widgets !== undefined ? widgets.filter(e => {
            return e.area === props.id;
        }) : [];
    };
    const widgets = ReactRedux.useSelector(state => getWidgets(state.widgets));
    const [open, setOpen] = React.useState(false);

    return React.createElement(
        React.Fragment,
        null,
        widgets.length > 0 && React.createElement(
            "div",
            { className: "right-column-opener column-opener d-block d-lg-none d-xl-none" },
            React.createElement(
                "a",
                { href: "#", onClick: e => {
                        e.preventDefault();setOpen(!open);
                    } },
                React.createElement("i", { className: "fas fa-sign-in-alt" })
            )
        ),
        React.createElement(Area, _extends({}, props, { className: open === true ? "col-12 col-md-3 right-column open" : "col-12 col-md-3 right-column" }))
    );
}