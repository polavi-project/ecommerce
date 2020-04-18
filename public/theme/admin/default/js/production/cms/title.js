export default function Title() {
    const title = ReactRedux.useSelector(state => _.get(state, "appState.helmet.title", ""));
    return React.createElement(
        "h3",
        { className: "page-title" },
        title
    );
}