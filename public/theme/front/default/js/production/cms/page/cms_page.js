import { REQUEST_END } from "../../../../../../../js/dev/event-types.js";

const CmsPage = props => {
    const { id, name, content } = props;

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