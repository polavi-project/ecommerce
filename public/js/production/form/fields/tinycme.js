import Textarea from "../fields/textarea.js";
import { FORM_SUBMIT, FILE_BROWSER_REQUESTED } from "../../event-types.js";

function File({ file, select }) {
    let className = file.isSelected === true ? "selected" : "";
    return React.createElement(
        "div",
        { className: "col image-item " + className },
        React.createElement(
            "div",
            { className: "inner" },
            React.createElement(
                "a",
                { href: "#", onClick: e => {
                        e.preventDefault();select(file);
                    } },
                React.createElement("img", { src: file.url })
            ),
            file.isSelected === true && React.createElement(
                "div",
                { className: "select" },
                React.createElement("i", { className: "far fa-check-square" })
            )
        )
    );
}
function FileBrowser({ editor, setFileBrowser }) {
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [folders, setFolders] = React.useState([]);
    const [files, setFiles] = React.useState([]);
    const [currentPath, setCurrentPath] = React.useState([]);
    const newFolderRefInput = React.useRef(null);

    const api = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));

    const onSelectFolder = (e, f) => {
        e.preventDefault();
        setCurrentPath(currentPath.concat({ name: f, index: currentPath.length + 1 }));
    };

    const onSelectFolderFromBreadcrumb = (e, index) => {
        e.preventDefault();
        let newPath = [];
        currentPath.forEach((f, k) => {
            if (f.index <= index) newPath.push(f);
        });
        setCurrentPath(newPath);
    };

    const onSelectFile = f => {
        setFiles(files.map(file => {
            if (f.name == file.name) file.isSelected = true;else file.isSelected = false;

            return file;
        }));
    };

    const close = e => {
        e.preventDefault();
        setFileBrowser(false);
    };

    const createFolder = (e, folder) => {
        e.preventDefault();
        if (!folder || !folder.trim()) {
            setError("Invalid folder name");
            return;
        }
        let path = currentPath.map(f => f.name);
        path.push(folder.trim());
        let query = `mutation CreateMediaFolder { createMediaFolder (path: "${path.join("/")}") {status message name path}}`;
        setLoading(true);
        fetch(api + "?query=" + query, {
            method: "GET"
        }).then(res => res.json()).then(response => {
            if (response.payload.data.createMediaFolder.status === true) setFolders(folders.concat(response.payload.data.createMediaFolder.name));else setError(response.payload.data.createMediaFolder.message);
        }).catch(error => setError(e)).finally(() => setLoading(false));
    };

    const deleteFile = e => {
        e.preventDefault();
        let file = null;
        files.forEach(f => {
            if (f.isSelected === true) file = f;
        });

        if (file === null) setError("No file selected");else {
            // Delete selected file
        }
    };

    const insertFile = e => {
        e.preventDefault();
        let file = null;
        files.forEach(f => {
            if (f.isSelected === true) file = f;
        });

        if (file === null) setError("No file selected");else {
            editor.insertHtml(`<img src='${file.url}'/>`);
            setFileBrowser(false);
        }
    };

    const onUpload = e => {
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
        fetch(api, {
            method: "POST",
            body: formData
        }).then(res => res.json()).then(response => {
            if (response.payload.success === true) setCurrentPath(currentPath.map(f => f));else setError(response.payload.message);
        }).catch(error => setError(e)).finally(() => setLoading(false));
    };

    React.useEffect(() => {
        let path = currentPath.map(f => f.name);
        const query = `{ fileBrowser (root: "${path.join("/")}") {folders files {name url} message status }}`;
        setLoading(true);
        fetch(api + "?query=" + query, {
            method: "GET"
        }).then(res => res.json()).then(response => {
            if (response.payload.data.fileBrowser.status == true) {
                setFolders(response.payload.data.fileBrowser.folders);
                setFiles(response.payload.data.fileBrowser.files);
            } else {
                setError(response.payload.data.fileBrowser.message);
            }
        }).catch(error => console.log(error)).finally(() => setLoading(false));
    }, [currentPath]);

    return React.createElement(
        "div",
        { className: "file-browser" },
        loading === true && React.createElement(
            "div",
            { className: "loading" },
            React.createElement(
                "div",
                { className: "lds-ring" },
                React.createElement("div", null),
                React.createElement("div", null),
                React.createElement("div", null),
                React.createElement("div", null)
            )
        ),
        React.createElement(
            "div",
            { className: "content" },
            React.createElement(
                "div",
                { className: "close" },
                React.createElement(
                    "a",
                    { href: "#", onClick: e => close(e) },
                    React.createElement("i", { className: "fas fa-times" })
                )
            ),
            React.createElement(
                "div",
                { className: "container-fluid" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-3" },
                        React.createElement(
                            "div",
                            { className: "current-path mb-4" },
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "div",
                                    { className: "d-inline h4 pr-2" },
                                    "You are here:"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "d-inline" },
                                    React.createElement(
                                        "a",
                                        { href: "#", onClick: e => onSelectFolderFromBreadcrumb(e, 0) },
                                        "Root"
                                    )
                                ),
                                currentPath.map((f, index) => {
                                    return React.createElement(
                                        "div",
                                        { className: "d-inline", key: index },
                                        React.createElement(
                                            "span",
                                            null,
                                            "/"
                                        ),
                                        React.createElement(
                                            "a",
                                            { href: "#", onClick: e => onSelectFolderFromBreadcrumb(e, f.index) },
                                            f.name
                                        )
                                    );
                                })
                            )
                        ),
                        React.createElement(
                            "ul",
                            { className: "list-group list-group-flush" },
                            folders.map((f, i) => React.createElement(
                                "li",
                                { className: "list-group-item", key: i },
                                React.createElement("i", { className: "far fa-folder" }),
                                React.createElement(
                                    "a",
                                    { className: "pl-2", href: "#", onClick: e => onSelectFolder(e, f) },
                                    f
                                )
                            )),
                            folders.length === 0 && React.createElement(
                                "li",
                                { className: "list-group-item" },
                                React.createElement(
                                    "span",
                                    null,
                                    "There is no sub folder."
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "input-group mt-3" },
                            React.createElement("input", { type: "text", className: "form-control", placeholder: "New folder", ref: newFolderRefInput }),
                            React.createElement(
                                "div",
                                { className: "input-group-append" },
                                React.createElement(
                                    "span",
                                    { className: "input-group-text", id: "basic-addon2" },
                                    React.createElement(
                                        "a",
                                        { href: "#", onClick: e => createFolder(e, newFolderRefInput.current.value) },
                                        "Create"
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "col-9" },
                        React.createElement(
                            "div",
                            { className: "error text-danger mb-4" },
                            error
                        ),
                        React.createElement(
                            "div",
                            { className: "tool-bar mb-4" },
                            React.createElement(
                                "a",
                                { className: "btn btn-danger mr-3", href: "#", onClick: e => deleteFile(e) },
                                React.createElement(
                                    "span",
                                    null,
                                    "Delete image"
                                )
                            ),
                            React.createElement(
                                "a",
                                { className: "btn btn-primary mr-3", href: "#", onClick: e => insertFile(e) },
                                React.createElement(
                                    "span",
                                    null,
                                    "Insert image"
                                )
                            ),
                            React.createElement(
                                "label",
                                { className: "btn btn-primary mb-0", htmlFor: "upload-image" },
                                React.createElement(
                                    "span",
                                    null,
                                    "Upload images"
                                )
                            ),
                            React.createElement(
                                "a",
                                { className: "invisible" },
                                React.createElement("input", { id: "upload-image", type: "file", multiple: true, onChange: onUpload })
                            )
                        ),
                        files.length === 0 && React.createElement(
                            "div",
                            null,
                            "There is no file to display."
                        ),
                        React.createElement(
                            "div",
                            { className: "row row-cols-9" },
                            files.map(f => React.createElement(File, { file: f, select: onSelectFile }))
                        )
                    )
                )
            )
        )
    );
}

export default function Tinycme(props) {
    const [fileBrowser, setFileBrowser] = React.useState(false);
    const [editor, setEditor] = React.useState(null);

    React.useEffect(function () {
        setEditor(CKEDITOR.replace(props.name));
    }, []);

    React.useEffect(() => {
        let token = PubSub.subscribe(FORM_SUBMIT, function (message, data) {
            CKEDITOR.instances[props.name].updateElement();
        });

        let tokenTwo = PubSub.subscribe(FILE_BROWSER_REQUESTED, function (message, data) {
            setFileBrowser(true);
        });

        return function cleanup() {
            PubSub.unsubscribe(token);
            PubSub.unsubscribe(tokenTwo);
        };
    }, []);

    return React.createElement(
        "div",
        null,
        React.createElement(Textarea, props),
        fileBrowser === true && React.createElement(FileBrowser, { editor: editor, setFileBrowser: setFileBrowser })
    );
}