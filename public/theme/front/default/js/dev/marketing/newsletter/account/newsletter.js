import {Fetch} from "../../../../../../../../js/production/fetch.js";

export default function Newsletter({subscribeUrl, unsubscribeUrl, email, customerId, status}) {
    const [subStatus, setSubStatus] = React.useState(status);

    const unsubscribe = (e, email, customerId) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('email', email);
        formData.append('customer_id', customerId);
        Fetch(unsubscribeUrl, false, "POST", formData, null, (response)=> {
            if(parseInt(response.success) === 1)
                setSubStatus("unsubscribed");
        });
    };

    const subscribe = (e, email) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('email', email);
        Fetch(subscribeUrl, false, "POST", formData, null, (response)=> {
            if(parseInt(response.success) === 1)
                setSubStatus("subscribed");
        });
    };

    return <div>
        <h2>Newsletter</h2>
        {subStatus == "subscribed" && <div>
            <p>You are subscribed to our newsletter</p>
            <a href={"#"} onClick={(e) => unsubscribe(e, email, customerId)} className="text-danger">Unsubscribe</a>
        </div>}
        {subStatus != "subscribed" && <div>
            <p>You are not subscribed to our newsletter</p>
            <a href={"#"} onClick={(e) => subscribe(e, email)} className="text-danger">Subscribe</a>
        </div>}
    </div>
}