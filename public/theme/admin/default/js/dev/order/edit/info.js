import {Status} from "./status.js";

export function OrderInfo() {
    let date = new Date(ReactRedux.useSelector(state => _.get(state, 'appState.orderData.created_at')));
    let number = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.order_number'));
    let status = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.status'));
    return <div className={"uk-width-1-1 order-edit-info"}>
        <div><strong>#{number}</strong> <i>{date.toDateString()}</i></div>
        <div>
            <Status status={status}/>
        </div>
    </div>
}