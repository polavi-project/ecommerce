import A from "../../../../../../../js/production/a.js";

export default function CodAction({areaProps, payOfflineUrl, refundOfflineUrl}) {
        return <td>
            {_.get(areaProps, 'payment_status') == 'pending' && <A url={payOfflineUrl} pushState={false}>Pay Offline</A>}
            {_.get(areaProps, 'payment_status') == 'paid' && <A url={refundOfflineUrl} pushState={false}>Refund Offline</A>}
        </td>
}