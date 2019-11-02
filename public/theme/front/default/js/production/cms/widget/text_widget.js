export default function TextWidget({ id, name, content, containerClass }) {
    return React.createElement("div", { className: id + "-text-widget text-widget-container " + containerClass, dangerouslySetInnerHTML: { __html: content } });
}