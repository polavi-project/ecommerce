import A from "../../../../../../../../js/production/a.js";

export default function SuccessMessage({message, homeUrl}) {
    return <div className={"order-success-message"}>
        <div className="w-100">
            <div>
                <div className="mb-4"><h4>{message}</h4></div>
                <A text="Home page" url={homeUrl} className="btn btn-primary"/>
            </div>
        </div>
    </div>
}