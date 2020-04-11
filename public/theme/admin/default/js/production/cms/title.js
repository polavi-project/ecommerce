export default function Title({ title }) {
    return React.createElement(
        "h3",
        { className: "page-title" },
        title
    );
}