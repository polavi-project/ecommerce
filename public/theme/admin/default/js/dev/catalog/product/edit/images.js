import {Fetch} from "../../../../../../../../js/production/fetch.js";

function Image(props) {
    const isMainStyle = {
        color: "blue"
    };

    return <li className="uk-width-1-4">
        <img src={props.url}/>
        <a
            href={"#"}
            onClick={(e) => { e.preventDefault(); props.removeImage(props.index);}}>
            <span uk-icon="trash"></span>
        </a>
        {props.isMain && <span style={isMainStyle} uk-icon="star"></span>}
        {!props.isMain && <a
            href={"#"}
            onClick={(e) => { e.preventDefault(); props.setMainImage(props.index);}}>
            <span uk-icon="star"></span>
        </a>}
        {props.isMain  && <input type="hidden" name="main_image" value={props.path}/>}
        {!props.isMain && <input type="hidden" name="images[]" value={props.path}/>}
    </li>;
}

function Images({images, removeImage, setMainImage}) {
    return <ul className="uk-list uk-grid-small uk-grid">
        {
            images.map((f,i) => {
                return <Image
                    index={i} {...f}
                    key={i}
                    removeImage={removeImage}
                    setMainImage={setMainImage}
                />
            })
        }
    </ul>
}

function Upload(props) {
    const onChange = (e) => {
        e.persist();
        let formData = new FormData();
        for (var i = 0; i < e.target.files.length; i++) {
            formData.append('files' + i, e.target.files[i]);
        }
        formData.append('query', `mutation UploadProductImage { uploadMedia (targetPath: "${'catalog/' + (Math.floor(Math.random() * (9999 - 1000)) + 1000) + '/' + (Math.floor(Math.random() * (9999 - 1000)) + 1000)}") {files {status message file {url path}}}}`);

        Fetch(
            props.uploadApi,
            false,
            "POST",
            formData,
            null,
            (response) => {
                if(_.get(response, 'payload.data.uploadMedia.files')) {
                    let files = [];
                    _.get(response, 'payload.data.uploadMedia.files').forEach((e,i) => {
                        files.push(e.file);
                    });
                    props.addImage(files);
                }
            },
            null,
            () => {
                e.target.value = null;
            }
        );
    };

    return <div>
        <div><span uk-icon="image"></span> <strong>Images</strong></div>
        <div className="js-upload uk-placeholder uk-text-center">
            <span uk-icon="icon: cloud-upload"></span>
            <span className="uk-text-middle"><label htmlFor={"product-image"}><a className="uk-link">Select files</a></label></span>
            <div uk-form-custom="true">
                <input id={"product-image"} type="file" multiple onChange={onChange}/>
            </div>
        </div>
    </div>
}

export default function ImageUploadContainer(props) {
    const [images, setImages] = React.useState(() => {
        return props.images ? props.images : []
    });

    const addImage = (image) => {
        setImages(images.concat(image))
    };

    const removeImage = (key) => {
        const newImages = images.filter((_, index) => index !== key);
        setImages(newImages);
    };

    const setMainImage = (key) => {
        setImages(()=>{
            return images.map((f, i) => {
                if(i === key)
                    f.isMain = 1;
                else
                    f.isMain = 0;
                return f;
            });
        });
    };

    return <div className="product-edit-image border-block">
        <Upload
            addImage={addImage}
            uploadApi={props.uploadApi}
        />
        <Images
            images={images}
            removeImage={removeImage}
            setMainImage={setMainImage}
        />
    </div>
}