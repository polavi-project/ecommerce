var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function MainImage({ src, alt }) {
    return React.createElement(
        "div",
        { className: "product-image product-single-page-image" },
        React.createElement("img", { src: src, alt: alt })
    );
}

export default function Images({ images, productName }) {
    const [mainImage, setMainImage] = React.useState(images.find(function (i) {
        return i.isMain === true;
    }));

    return React.createElement(
        "div",
        { className: "product-single-media" },
        mainImage && React.createElement(MainImage, { src: mainImage.main, alt: productName }),
        React.createElement(
            "ul",
            { className: "more-view-thumbnail product-gallery" },
            images.map((i, j) => {
                return React.createElement(
                    "li",
                    { key: j },
                    React.createElement(
                        "a",
                        { href: "#", onClick: e => {
                                e.preventDefault();setMainImage(_extends({}, i));
                            } },
                        React.createElement("img", { src: i.thumb, alt: productName })
                    )
                );
            })
        )
    );
}