export default function OrderInfo(props) {
    let date = new Date(props.created_at);
    return React.createElement(
        "div",
        { className: "uk-width-1-1" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "#",
                props.order_number
            ),
            " ",
            React.createElement(
                "i",
                null,
                date.toDateString()
            )
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                props.status == "pending" && React.createElement(
                    "span",
                    { className: "uk-label uk-label-warning" },
                    React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
                    " Pending"
                ),
                props.status == "processing" && React.createElement(
                    "span",
                    { className: "uk-label" },
                    React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
                    " Processing"
                ),
                props.status == "completed" && React.createElement(
                    "span",
                    { className: "uk-label uk-label-success" },
                    React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
                    " Completed"
                ),
                props.status == "cancelled" && React.createElement(
                    "span",
                    { className: "uk-label uk-label-danger" },
                    React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
                    " Cancelled"
                )
            )
        )
    );
}