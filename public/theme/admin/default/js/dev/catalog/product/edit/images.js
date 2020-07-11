import {Fetch} from "../../../../../../../../js/production/fetch.js";

function Image(props) {
    return <li className="col-3">
        <img src={props.url}/>
        <a
            href={"#"}
            className="text-danger"
            onClick={(e) => { e.preventDefault(); props.removeImage(props.index);}}>
            <i className="fas fa-trash-alt"></i>
        </a>
        {props.isMain ? <a href="javascript:void(0)" className="pl-1"><i className="fas fa-check-square"></i></a> : <a
            href={"#"}
            className="pl-1"
            onClick={(e) => { e.preventDefault(); props.setMainImage(props.index);}}>
            <i className="fas fa-square"></i>
        </a>}
        {props.isMain  ? <input type="hidden" name="main_image" value={props.path}/> : <input type="hidden" name="images[]" value={props.path}/>}
    </li>;
}

function Images({images, removeImage, setMainImage}) {
    return <ul className="row product-upload-images list-unstyled">
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
        <div className="product-image-upload text-center">
            <i className="fas fa-upload"></i>
            <span className="align-middle"><label htmlFor={"product-image"}><a>Select files</a></label></span>
            <div className="invisible">
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

    return <div className="product-edit-image sml-block mt-4">
        <div className="sml-block-title">Images</div>
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