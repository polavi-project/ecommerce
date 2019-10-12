export default function TextWidget({ id, name, content }) {
    return React.createElement("div", { className: id + "-text-widget text-widget-container", dangerouslySetInnerHTML: { __html: content } });
}