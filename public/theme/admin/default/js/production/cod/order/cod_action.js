import A from "../../../../../../../js/production/a.js";

export default function CodAction({ areaProps, payOfflineUrl, refundOfflineUrl }) {
    return React.createElement(
        'td',
        null,
        _.get(areaProps, 'payment_status') == 'pending' && React.createElement(
            A,
            { url: payOfflineUrl, pushState: false },
            'Pay Offline'
        ),
        _.get(areaProps, 'payment_status') == 'paid' && React.createElement(
            A,
            { url: refundOfflineUrl, pushState: false },
            'Refund Offline'
        )
    );
}