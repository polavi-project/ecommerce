const Thumbnail = ({ imageUrl, alt }) => {
    return React.createElement(
        "div",
        { className: "product-thumbnail-listing" },
        React.createElement("span", { className: "list-placeholder-helper" }),
        imageUrl && React.createElement("img", { src: imageUrl, alt: alt }),
        !imageUrl && React.createElement("span", { "uk-icon": "icon: image; ratio: 10" })
    );
};
export { Thumbnail };