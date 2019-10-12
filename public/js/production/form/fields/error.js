let Error = props => {
    let { error } = props;
    if (!error) return "";else return React.createElement(
        "div",
        { className: "error" },
        React.createElement(
            "span",
            null,
            error
        )
    );
};

export { Error };