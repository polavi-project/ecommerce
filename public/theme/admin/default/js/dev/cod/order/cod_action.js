import A from "../../../../../../../js/production/a.js";

export default function CodAction({areaProps, payOfflineUrl, refundOfflineUrl}) {
        return <td>
            {_.get(areaProps, 'status') == 'pending' && <A url={payOfflineUrl} pushState={false}>Pay Offline</A>}
            {_.get(areaProps, 'status') == 'paid' && <A url={refundOfflineUrl} pushState={false}>Refund Offline</A>}
        </td>
}