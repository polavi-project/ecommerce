import Textarea from "../fields/textarea.js";
import {FORM_SUBMIT, FILE_BROWSER_REQUESTED} from "../../event-types.js";

function File({file, select}) {
    let className = file.isSelected === true ? "selected" : "";
    return <div className={"col image-item " + className}>
        <div className="inner">
            <a href="#" onClick={(e) => {e.preventDefault(); select(file)}}>
                <img src={file.url}/>
            </a>
            {file.isSelected === true && <div className="select"><i className="far fa-check-square"></i></div>}
        </div>
    </div>
}
function FileBrowser({editor, setFileBrowser}) {
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [folders, setFolders] = React.useState([]);
    const [files, setFiles] = React.useState([]);
    const [currentPath, setCurrentPath] = React.useState([]);
    const newFolderRefInput = React.useRef(null);

    const api = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));

    const onSelectFolder = (e, f) => {
        e.preventDefault();
        setCurrentPath(currentPath.concat({name: f, index: currentPath.length + 1}));
    };

    const onSelectFolderFromBreadcrumb = (e, index) => {
        e.preventDefault();
        let newPath = [];
        currentPath.forEach((f, k) => {
            if(f.index <= index)
                newPath.push(f);
        });
        setCurrentPath(newPath);
    };

    const onSelectFile = (f) => {
        setFiles(files.map((file) => {
            if(f.name == file.name)
                file.isSelected = true;
            else
                file.isSelected = false;

            return file;
        }));
    };

    const close = (e) => {
        e.preventDefault();
        setFileBrowser(false);
    };

    const createFolder = (e, folder) => {
        e.preventDefault();
        if(!folder || !folder.trim()) {
            setError("Invalid folder name");
            return;
        }
        let path = currentPath.map((f) => f.name);
        path.push(folder.trim());
        let query = `mutation CreateMediaFolder { createMediaFolder (path: "${path.join("/")}") {status message name path}}`;
        setLoading(true);
        fetch(
            api + "?query=" + query,
            {
                method: "GET"
            }
        )
            .then(res => res.json())
            .then(response => {
                if(response.payload.data.createMediaFolder.status === true)
                    setFolders(folders.concat(response.payload.data.createMediaFolder.name));
                else
                    setError(response.payload.data.createMediaFolder.message)
            })
            .catch(error => setError(e))
            .finally(() => setLoading(false));
    };

    const deleteFile = (e) => {
        e.preventDefault();
        let file = null;
        files.forEach((f) => {
            if(f.isSelected === true)
                file = f;
        });

        if(file === null)
           setError("No file selected");
        else {
            let path = currentPath.map((f) => f.name);
            path.push(file.name);
            let query = `mutation DeleteMediaFile { deleteMediaFile (path: "${path.join("/")}") {status message}}`;
            setLoading(true);
            fetch(
                api + "?query=" + query,
                {
                    method: "GET"
                }
            )
                .then(res => res.json())
                .then(response => {
                    if(response.payload.data.deleteMediaFile.status === true)
                        setCurrentPath(currentPath.map((f) => f));
                    else
                        setError(response.payload.data.deleteMediaFile.message)
                })
                .catch(error => setError(e))
                .finally(() => setLoading(false));
        }
    };

    const insertFile = (e) => {
        e.preventDefault();
        let file = null;
        files.forEach((f) => {
            if(f.isSelected === true)
                file = f;
        });

        if(file === null)
            setError("No file selected");
        else {
            editor.insertHtml(`<img src='${file.url}'/>`);
            setFileBrowser(false);
        }
    };

    const onUpload = (e) => {
        e.persist();
        let formData = new FormData();
        for (var i = 0; i < e.target.files.length; i++) {
            formData.append('files' + i, e.target.files[i]);
        }
        let path = ["upload"];
        currentPath.forEach((f, k) => {
            path.push(f.name);
        });

        formData.append('query', `mutation UploadImage { uploadMedia (targetPath: "${path.join("/")}") {files {status message file {url path}}}}`);
        setLoading(true);
        fetch(
            api,
            {
                method: "POST",
                body: formData
            }
        )
            .then(res => res.json())
            .then(response => {
                if(response.payload.success === true)
                    setCurrentPath(currentPath.map((f) => f));
                else
                    setError(response.payload.message)
            })
            .catch(error => setError(e))
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        let path = currentPath.map((f) => f.name);
        const query = `{ fileBrowser (root: "${path.join("/")}") {folders files {name url} message status }}`;
        setLoading(true);
        fetch(
            api + "?query=" + query,
            {
                method: "GET"
            }
        )
            .then(res => res.json())
            .then(response => {
                if(response.payload.data.fileBrowser.status == true) {
                    setFolders(response.payload.data.fileBrowser.folders);
                    setFiles(response.payload.data.fileBrowser.files);
                } else {
                    setError(response.payload.data.fileBrowser.message)
                }
            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [currentPath]);

    return <div className="file-browser">
        {loading === true && <div className="loading"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div> }
        <div className="content">
            <div className="close"><a href="#" onClick={(e) => close(e)}><i className="fas fa-times"></i></a></div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-3">
                        <div className="current-path mb-4">
                            <div><div className="d-inline h4 pr-2">You are here:</div>
                                <div className="d-inline"><a href="#" onClick={(e) => onSelectFolderFromBreadcrumb(e, 0)}>Root</a></div>
                                {currentPath.map((f, index) => {
                                    return <div className="d-inline" key={index}><span>/</span><a href="#" onClick={(e) => onSelectFolderFromBreadcrumb(e, f.index)}>{f.name}</a></div>
                                })}
                            </div>
                        </div>
                        <ul className="list-group list-group-flush">
                            {folders.map((f, i) => <li className={"list-group-item"} key={i}><i className="far fa-folder"></i><a className="pl-2" href="#" onClick={(e) => onSelectFolder(e, f)}>{f}</a></li>)}
                            {folders.length === 0 && <li className={"list-group-item"}><span>There is no sub folder.</span></li>}
                        </ul>
                        <div className="input-group mt-3">
                            <input type="text" className="form-control" placeholder="New folder" ref={newFolderRefInput}/>
                            <div className="input-group-append">
                                <span className="input-group-text" id="basic-addon2"><a href="#" onClick={(e) => createFolder(e, newFolderRefInput.current.value)}>Create</a></span>
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="error text-danger mb-4">{error}</div>
                        <div className="tool-bar mb-4">
                            <a className="btn btn-danger mr-3" href="#" onClick={(e) => deleteFile(e)}><span>Delete image</span></a>
                            <a className="btn btn-primary mr-3" href="#" onClick={(e) => insertFile(e)}><span>Insert image</span></a>
                            <label className="btn btn-primary mb-0" htmlFor={"upload-image"}><span>Upload images</span></label>
                            <a className="invisible">
                                <input id={"upload-image"} type="file" multiple onChange={onUpload}/>
                            </a>
                        </div>
                        {files.length === 0 && <div>There is no file to display.</div>}
                        <div className="row row-cols-9">
                            {files.map((f) => <File file={f} select={onSelectFile}/>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default function Ckeditor(props) {
    const [fileBrowser, setFileBrowser] = React.useState(false);
    const [editor, setEditor] = React.useState(null);

    React.useEffect(function() {
        setEditor(CKEDITOR.replace( props.name ));
    }, []);

    React.useEffect(() => {
        let token = PubSub.subscribe(FORM_SUBMIT, function(message, data) {
            CKEDITOR.instances[props.name].updateElement();
        });

        let tokenTwo = PubSub.subscribe(FILE_BROWSER_REQUESTED, function(message, data) {
            if(data.editor.name == props.name)
                setFileBrowser(true);
        });

        return function cleanup() {
            PubSub.unsubscribe(token);
            PubSub.unsubscribe(tokenTwo);
        };
    }, []);

    return <div>
        <Textarea {...props}/>
        {fileBrowser === true && <FileBrowser editor={editor} setFileBrowser={setFileBrowser}/>}
    </div>
}