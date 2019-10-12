import Textarea from "../fields/textarea.js";

export default function Tinycme(props) {
    React.useEffect(function() {
        tinymce.init({
            selector: `textarea#${props.id}`
        });
    }, []);
    return <Textarea {...props}/>
}