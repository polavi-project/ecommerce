const Hidden = ({ value, name }) => {
    return React.createElement("div", { className: "form-group" }, React.createElement("input", {
        type: "hidden",
        className: "form-control",
        id: name,
        name: name,
        defaultValue: value
    }));
};
export default Hidden;