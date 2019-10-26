import A from "../../../../../../../../js/production/a.js";

export default function AddNewButton({url}) {
    return <A pushState={true} text={"New attribute"} url={url} classes={"uk-button uk-button-primary uk-button-small"}/>
}