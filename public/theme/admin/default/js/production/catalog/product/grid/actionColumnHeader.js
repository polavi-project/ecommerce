import A from "../../../../../../../../js/production/a.js";
import { ADD_ALERT } from "../../../../../../../../js/production/event-types.js";

export default function ActionColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField('product_id');
        areaProps.addField('editUrl');
    }, []);

    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Action"
                )
            )
        )
    );
}