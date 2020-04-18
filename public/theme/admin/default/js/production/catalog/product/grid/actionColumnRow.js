import A from "../../../../../../../../js/production/a.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";

export default function ActionColumnRow({ areaProps }) {
    return React.createElement(
        "td",
        null,
        React.createElement(
            "div",
            null,
            React.createElement(
                A,
                { url: _.get(areaProps, 'row.editUrl', '') },
                React.createElement("i", { className: "fas fa-edit" })
            )
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "a",
                { className: "text-danger",
                    href: "javascript:void(0);",
                    onClick: () => {
                        if (window.confirm('Are you sure?')) Fetch(_.get(areaProps, 'row.deleteUrl', ''), false, 'GET');
                    } },
                React.createElement("i", { className: "fas fa-trash-alt" })
            )
        )
    );
}