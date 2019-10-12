import A from "../../../../../../../js/production/a.js";

export default function CodAction({areaProps, payOfflineUrl, refundOfflineUrl}) {
    if(_.get(areaProps, 'payment_method') !== 'cod')
        return null;
    else
        return <td>
            {_.get(areaProps, 'payment_status') == 'pending' && <A url={payOfflineUrl} pushState={false}>Pay Offline</A>}
            {_.get(areaProps, 'payment_status') == 'paid' && <A url={refundOfflineUrl} pushState={false}>Refund Offline</A>}
        </td>
}