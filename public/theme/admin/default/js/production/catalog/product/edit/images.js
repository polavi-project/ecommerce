var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Fetch } from "../../../../../../../../js/production/fetch.js";

function Image(props) {
    const isMainStyle = {
        color: "blue"
    };

    return React.createElement(
        "li",
        { className: "uk-width-1-4" },
        React.createElement("img", { src: props.url }),
        React.createElement(
            "a",
            {
                href: "#",
                onClick: e => {
                    e.preventDefault();props.removeImage(props.index);
                } },
            React.createElement("span", { "uk-icon": "trash" })
        ),
        props.isMain && React.createElement("span", { style: isMainStyle, "uk-icon": "star" }),
        !props.isMain && React.createElement(
            "a",
            {
                href: "#",
                onClick: e => {
                    e.preventDefault();props.setMainImage(props.index);
                } },
            React.createElement("span", { "uk-icon": "star" })
        ),
        props.isMain && React.createElement("input", { type: "hidden", name: "main_image", value: props.path }),
        !props.isMain && React.createElement("input", { type: "hidden", name: "images[]", value: props.path })
    );
}

function Images({ images, removeImage, setMainImage }) {
    return React.createElement(
        "ul",
        { className: "uk-list uk-grid-small uk-grid" },
        images.map((f, i) => {
            return React.createElement(Image, _extends({
                index: i }, f, {
                key: i,
                removeImage: removeImage,
                setMainImage: setMainImage
            }));
        })
    );
}

function Upload(props) {
    const onChange = e => {
        e.persist();
        let formData = new FormData();
        for (var i = 0; i < e.target.files.length; i++) {
            formData.append('files' + i, e.target.files[i]);
        }
        formData.append('query', `mutation UploadProductImage { uploadMedia (targetPath: "${'catalog/' + (Math.floor(Math.random() * (9999 - 1000)) + 1000) + '/' + (Math.floor(Math.random() * (9999 - 1000)) + 1000)}") {files {status message file {url path}}}}`);

        Fetch(props.uploadApi, false, "POST", formData, null, response => {
            if (_.get(response, 'payload.data.uploadMedia.files')) {
                let files = [];
                _.get(response, 'payload.data.uploadMedia.files').forEach((e, i) => {
                    files.push(e.file);
                });
                props.addImage(files);
            }
        }, null, () => {
            e.target.value = null;
        });
    };

    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            null,
            React.createElement("span", { "uk-icon": "image" }),
            " ",
            React.createElement(
                "strong",
                null,
                "Images"
            )
        ),
        React.createElement(
            "div",
            { className: "js-upload uk-placeholder uk-text-center" },
            React.createElement("span", { "uk-icon": "icon: cloud-upload" }),
            React.createElement(
                "span",
                { className: "uk-text-middle" },
                React.createElement(
                    "label",
                    { htmlFor: "product-image" },
                    React.createElement(
                        "a",
                        { className: "uk-link" },
                        "Select files"
                    )
                )
            ),
            React.createElement(
                "div",
                { "uk-form-custom": "true" },
                React.createElement("input", { id: "product-image", type: "file", multiple: true, onChange: onChange })
            )
        )
    );
}

export default function ImageUploadContainer(props) {
    const [images, setImages] = React.useState(() => {
        return props.images ? props.images : [];
    });

    const addImage = image => {
        setImages(images.concat(image));
    };

    const removeImage = key => {
        const newImages = images.filter((_, index) => index !== key);
        setImages(newImages);
    };

    const setMainImage = key => {
        setImages(() => {
            return images.map((f, i) => {
                if (i === key) f.isMain = 1;else f.isMain = 0;
                return f;
            });
        });
    };

    return React.createElement(
        "div",
        { className: "product-edit-image" },
        React.createElement(Upload, {
            addImage: addImage,
            uploadApi: props.uploadApi
        }),
        React.createElement(Images, {
            images: images,
            removeImage: removeImage,
            setMainImage: setMainImage
        })
    );
}