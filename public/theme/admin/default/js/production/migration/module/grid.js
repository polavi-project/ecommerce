import A from "../../../../../../../js/production/a.js";

export default function ExtensionGrid({ extensions }) {
    return React.createElement(
        "div",
        { className: "grid sml-block" },
        React.createElement(
            "div",
            { className: "extension-grid mt-4" },
            React.createElement(
                "table",
                { className: "table table-bordered sticky" },
                React.createElement(
                    "thead",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "th",
                            null,
                            React.createElement(
                                "div",
                                { className: "table-header id-header" },
                                React.createElement(
                                    "div",
                                    { className: "title" },
                                    React.createElement(
                                        "span",
                                        null,
                                        "Name"
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "th",
                            null,
                            React.createElement(
                                "div",
                                { className: "table-header id-header" },
                                React.createElement(
                                    "div",
                                    { className: "title" },
                                    React.createElement(
                                        "span",
                                        null,
                                        "Information"
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "th",
                            null,
                            React.createElement(
                                "div",
                                { className: "table-header id-header" },
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
                        )
                    )
                ),
                React.createElement(
                    "tbody",
                    null,
                    extensions.map((m, i) => {
                        return React.createElement(
                            "tr",
                            null,
                            React.createElement(
                                "td",
                                null,
                                m.name
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(
                                    "div",
                                    { className: "mb-2" },
                                    m.description
                                ),
                                React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "strong",
                                        null,
                                        "Version"
                                    ),
                                    " ",
                                    m.version
                                ),
                                React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "strong",
                                        null,
                                        "Author"
                                    ),
                                    " ",
                                    React.createElement(
                                        "a",
                                        { href: m.author_url },
                                        m.author
                                    )
                                )
                            ),
                            React.createElement(
                                "td",
                                null,
                                parseInt(m.status) === 1 && React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        A,
                                        { url: m.disableUrl, className: "text-danger" },
                                        "Disable"
                                    )
                                ),
                                parseInt(m.status) === 0 && React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        A,
                                        { url: m.disableUrl, className: "text-primary" },
                                        "Enable"
                                    )
                                ),
                                m.status === undefined && React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        A,
                                        { url: m.installUrl, className: "text-primary" },
                                        "Install"
                                    )
                                )
                            )
                        );
                    })
                )
            ),
            extensions.length === 0 && React.createElement(
                "div",
                null,
                "There is no module to display"
            )
        )
    );
}