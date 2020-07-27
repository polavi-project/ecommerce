import Textarea from "../fields/textarea.js";
import {FORM_SUBMIT, FILE_BROWSER_REQUESTED} from "../../event-types.js";

function FileBrowser({editor}) {
    const [folders, setFolders] = React.useState([]);
    const [files, setFiles] = React.useState([]);
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    const onSelectFolder = (e) => {
        e.preventDefault();
    };

    const onSelectFile = (e, f) => {
        e.preventDefault();
        editor.insertHtml(`<img src='${f.url}'/>`)
    };

    React.useEffect(() => {
        const query = "{ fileBrowser (root: \"\") {folders files {name url} error }}";
        fetch(
            api + "?query=" + query,
            {
                method: "GET"
            }
        )
            .then(res => res.json())
            .then(response => {
                setFolders(response.payload.data.fileBrowser.folders);
                setFiles(response.payload.data.fileBrowser.files);
            })
            .catch(error => console.log(error));
    }, []);

    return <div className="file-browser">
        <div className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-3">
                        <ul className="list-unstyled">
                            {folders.map((f) => <li><a href="#" onClick={(e) => onSelectFolder(e)}>{f}</a></li>)}
                        </ul>
                    </div>
                    <div className="col-9">
                        <ul className="list-unstyled">
                            {files.map((f) => <li><a href="#" onClick={(e) => onSelectFile(e, f)}>{f.name}</a></li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default function Tinycme(props) {
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
            setFileBrowser(true);
        });

        return function cleanup() {
            PubSub.unsubscribe(token);
            PubSub.unsubscribe(tokenTwo);
        };
    }, []);

    return <div>
        <Textarea {...props}/>
        {fileBrowser === true && <FileBrowser editor={editor}/>}
    </div>
}