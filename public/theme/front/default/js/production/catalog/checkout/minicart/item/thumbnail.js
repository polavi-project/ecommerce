const Thumbnail = ({ image_url, alt }) => {
    return React.createElement(
        "div",
        { className: "thumbnail" },
        React.createElement("img", { src: image_url, alt: alt })
    );
};
export default Thumbnail;