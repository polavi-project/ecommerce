import { Fetch } from "../../../../../../../../js/production/fetch.js";

export default function Newsletter({ subscribeUrl, unsubscribeUrl, email, customerId, status }) {
    const [subStatus, setSubStatus] = React.useState(status);

    const unsubscribe = (e, email, customerId) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('email', email);
        formData.append('customer_id', customerId);
        Fetch(unsubscribeUrl, false, "POST", formData, null, response => {
            if (parseInt(response.success) === 1) setSubStatus("unsubscribed");
        });
    };

    const subscribe = (e, email) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('email', email);
        Fetch(subscribeUrl, false, "POST", formData, null, response => {
            if (parseInt(response.success) === 1) setSubStatus("subscribed");
        });
    };

    return React.createElement(
        'div',
        { className: 'col-12 col-md-6' },
        React.createElement(
            'h2',
            null,
            'Newsletter'
        ),
        subStatus == "subscribed" && React.createElement(
            'div',
            null,
            React.createElement(
                'p',
                null,
                'You are subscribed to our newsletter'
            ),
            React.createElement(
                'a',
                { href: "#", onClick: e => unsubscribe(e, email, customerId), className: 'text-danger' },
                'Unsubscribe'
            )
        ),
        subStatus != "subscribed" && React.createElement(
            'div',
            null,
            React.createElement(
                'p',
                null,
                'You are not subscribed to our newsletter'
            ),
            React.createElement(
                'a',
                { href: "#", onClick: e => subscribe(e, email), className: 'text-danger' },
                'Subscribe'
            )
        )
    );
}