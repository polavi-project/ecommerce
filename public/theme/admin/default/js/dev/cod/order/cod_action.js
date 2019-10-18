import A from "../../../../../../../js/production/a.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";

export default function CodAction({areaProps, payOfflineUrl, refundOfflineUrl}) {
        const payOffline = (e) => {
            e.preventDefault();
            Fetch(
                payOfflineUrl,
                false,
                'GET',
                {},
                null,
                (response)=>{
                     location.reload()
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
                    location.reload()
                })
        };
        return <td>
            {_.get(areaProps, 'status') == 'pending' && <a href="#" onClick={(e)=>payOffline(e)}><span>Pay Offline</span></a>}
            {_.get(areaProps, 'status') == 'paid' && <a href="#" onClick={(e)=>refundOffline(e)}><span>Refund Offline</span></a>}
        </td>
}