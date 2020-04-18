var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Fetch } from "../../../../../../../../js/production/fetch.js";

function Image(props) {
    return React.createElement(
        "li",
        { className: "col-3" },
        React.createElement("img", { src: props.url }),
        React.createElement(
            "a",
            {
                href: "#",
                className: "text-danger",
                onClick: e => {
                    e.preventDefault();props.removeImage(props.index);
                } },
            React.createElement("i", { className: "fas fa-trash-alt" })
        ),
        props.isMain ? React.createElement(
            "a",
            { href: "javascript:void(0)", className: "pl-1" },
            React.createElement("i", { className: "fas fa-check-square" })
        ) : React.createElement(
            "a",
            {
                href: "#",
                className: "pl-1",
                onClick: e => {
                    e.preventDefault();props.setMainImage(props.index);
                } },
            React.createElement("i", { className: "fas fa-square" })
        ),
        props.isMain ? React.createElement("input", { type: "hidden", name: "main_image", value: props.path }) : React.createElement("input", { type: "hidden", name: "images[]", value: props.path })
    );
}

function Images({ images, removeImage, setMainImage }) {
    return React.createElement(
        "ul",
        { className: "row product-upload-images list-unstyled" },
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
            { className: "product-image-upload text-center" },
            React.createElement("i", { className: "fas fa-upload" }),
            React.createElement(
                "span",
                { className: "align-middle" },
                React.createElement(
                    "label",
                    { htmlFor: "product-image" },
                    React.createElement(
                        "a",
                        null,
                        "Select files"
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "invisible" },
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
        { className: "product-edit-image sml-block mt-4" },
        React.createElement(
            "div",
            { className: "sml-block-title" },
            "Images"
        ),
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