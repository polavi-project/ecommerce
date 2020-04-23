import { Fetch } from "../../../../../../../js/production/fetch.js";

export default function CodAction({ areaProps, payOfflineUrl, refundOfflineUrl, orderEditUrl }) {
    const payOffline = e => {
        e.preventDefault();
        Fetch(payOfflineUrl, false, 'GET', {}, null, response => {
            Fetch(orderEditUrl, true);
        });
    };

    const refundOffline = e => {
        e.preventDefault();
        Fetch(refundOfflineUrl, false, 'GET', {}, null, response => {
            Fetch(orderEditUrl, true);
        });
    };
    return React.createElement(
        'td',
        null,
        _.get(areaProps, 'status') == 'pending' && React.createElement(
            'a',
            { href: '#', onClick: e => payOffline(e) },
            React.createElement(
                'span',
                null,
                'Pay Offline'
            )
        ),
        _.get(areaProps, 'status') == 'paid' && React.createElement(
            'a',
            { href: '#', onClick: e => refundOffline(e) },
            React.createElement(
                'span',
                null,
                'Refund Offline'
            )
        )
    );
}