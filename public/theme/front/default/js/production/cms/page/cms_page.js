const CmsPage = ({ id, name, content }) => {
    return React.createElement(
        "div",
        { className: "cms-page cms-page-" + id },
        React.createElement(
            "h1",
            { className: "cms-page-heading" },
            name
        ),
        React.createElement("div", { className: "cms-page-content", dangerouslySetInnerHTML: { __html: content } })
    );
};

export default CmsPage;