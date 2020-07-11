import {Fetch} from "../../../../../../../js/production/fetch.js";

export default function CodAction({areaProps, payOfflineUrl, refundOfflineUrl, orderEditUrl}) {
        const payOffline = (e) => {
            e.preventDefault();
            Fetch(
                payOfflineUrl,
                false,
                'GET',
                {},
                null,
                (response)=>{
                     Fetch(orderEditUrl, true)
                })
        };

        const refundOffline = (e) => {
            e.preventDefault();
            Fetch(
                refundOfflineUrl,
                false,
                'GET',
                {},
                null,
                (response)=>{
                    Fetch(orderEditUrl, true)
                })
        };
        return <td>
            {_.get(areaProps, 'status') == 'pending' && <a href="#" onClick={(e)=>payOffline(e)}><span>Pay Offline</span></a>}
            {_.get(areaProps, 'status') == 'paid' && <a href="#" onClick={(e)=>refundOffline(e)}><span>Refund Offline</span></a>}
        </td>
}