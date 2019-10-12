export default function Activities({ activities }) {
    return React.createElement(
        "div",
        { className: "uk-width-1-2" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "Activities"
            )
        ),
        React.createElement(
            "ul",
            { className: "uk-list uk-list-divider" },
            activities.map((a, i) => {
                let date = new Date(a.created_at);
                return React.createElement(
                    "li",
                    { key: i },
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