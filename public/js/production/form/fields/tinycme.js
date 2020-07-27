import Textarea from "../fields/textarea.js";
import { FORM_SUBMIT, FILE_BROWSER_REQUESTED } from "../../event-types.js";

function FileBrowser({ editor }) {
    const [folders, setFolders] = React.useState([]);
    const [files, setFiles] = React.useState([]);
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    const onSelectFolder = e => {
        e.preventDefault();
    };

    const onSelectFile = (e, f) => {
        e.preventDefault();
        editor.insertHtml(`<img src='${f.url}'/>`);
    };

    React.useEffect(() => {
        const query = "{ fileBrowser (root: \"\") {folders files {name url} error }}";
        fetch(api + "?query=" + query, {
            method: "GET"
        }).then(res => res.json()).then(response => {
            setFolders(response.payload.data.fileBrowser.folders);
            setFiles(response.payload.data.fileBrowser.files);
        }).catch(error => console.log(error));
    }, []);

    return React.createElement(
        "div",
        { className: "file-browser" },
        React.createElement(
            "div",
            { className: "content" },
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
                            "ul",
                            { className: "list-unstyled" },
                            folders.map(f => React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "#", onClick: e => onSelectFolder(e) },
                                    f
                                )
                            ))
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "col-9" },
                        React.createElement(
                            "ul",
                            { className: "list-unstyled" },
                            files.map(f => React.createElement(
                                "li",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "#", onClick: e => onSelectFile(e, f) },
                                    f.name
                                )
                            ))
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
        fileBrowser === true && React.createElement(FileBrowser, { editor: editor })
    );
}