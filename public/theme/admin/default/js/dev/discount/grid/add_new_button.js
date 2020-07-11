import A from "../../../../../../../js/production/a.js";

export default function AddNewButton({url}) {
    return <A pushState={true} text={"New coupon"} url={url} className={"btn btn-primary"}/>
}