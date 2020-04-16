export default function Activities({ activities }) {
    return React.createElement(
        "div",
        { className: "sml-block mt-4" },
        React.createElement(
            "div",
            { className: "sml-block-title" },
            "Activities"
        ),
        React.createElement(
            "ul",
            { className: "list-group list-group-flush" },
            activities.map((a, i) => {
                let date = new Date(a.created_at);
                return React.createElement(
                    "li",
                    { key: i, className: "list-group-item" },
                    React.createElement(
                        "span",
                        null,
                        React.createElement(
                            "i",
                            null,
                            a.comment
                        ),
                        " - ",
                        React.createElement(
                            "i",
                            null,
                            date.toDateString()
                        ),
                        " - ",
                        React.createElement(
                            "span",
                            null,
                            a.customer_notified === 1 && React.createElement(
                                "span",
                                null,
                                "Customer notified"
                            ),
                            a.customer_notified === 0 && React.createElement(
                                "span",
                                null,
                                "Customer not notified"
                            )
                        )
                    )
                );
            })
        )
    );
}