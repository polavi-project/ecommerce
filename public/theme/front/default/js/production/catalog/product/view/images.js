function MainImage({ src, alt }) {
    return React.createElement(
        "div",
        { className: "product-image" },
        React.createElement("img", { src: src, alt: alt })
    );
}

export default function Images({ images, productName }) {
    let mainImage = images.find(function (i) {
        return i.isMain === true;
    });
    return React.createElement(
        "div",
        { className: "uk-width-1-2" },
        mainImage && React.createElement(MainImage, { src: mainImage.main, alt: productName }),
        React.createElement(
            "ul",
            { className: "uk-thumbnav product-gallery" },
            images.map((i, j) => {
                return React.createElement(
                    "li",
                    { key: j },
                    React.createElement(
                        "a",
                        { href: "#" },
                        React.createElement("img", { src: i.thumb, alt: productName })
                    )
                );
            })
        )
    );
}