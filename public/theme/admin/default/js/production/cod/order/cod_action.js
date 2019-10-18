import A from "../../../../../../../js/production/a.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";

export default function CodAction({ areaProps, payOfflineUrl, refundOfflineUrl }) {
    const payOffline = e => {
        e.preventDefault();
        Fetch(payOfflineUrl, false, 'GET', {}, null, response => {
            location.reload();
        });
    };

    const refundOffline = e => {
        e.preventDefault();
        Fetch(refundOfflineUrl, false, 'GET', {}, null, response => {
            location.reload();
        });
    };
    return React.createElement(
        "td",
        null,
        _.get(areaProps, 'status') == 'pending' && React.createElement(
            "a",
            { href: "#", onClick: e => payOffline(e) },
            React.createElement(
                "span",
                null,
                "Pay Offline"
            )
        ),
        _.get(areaProps, 'status') == 'paid' && React.createElement(
            "a",
            { href: "#", onClick: e => refundOffline(e) },
            React.createElement(
                "span",
                null,
                "Pay Offline"
            )
        )
    );
}