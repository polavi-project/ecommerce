export default function OrderInfo(props) {
    let date = new Date(props.created_at);
    return <div className={"uk-width-1-1"}>
        <div><strong>#{props.order_number}</strong> <i>{date.toDateString()}</i></div>
        <div>
            <span>
                {
                    props.status == "pending" && <span className="uk-label uk-label-warning"><span uk-icon="icon: tag; ratio: 0.8"></span> Pending</span>
                }
                {
                    props.status == "processing" && <span className="uk-label"><span uk-icon="icon: tag; ratio: 0.8"></span> Processing</span>
                }
                {
                    props.status == "completed" && <span className="uk-label uk-label-success"><span uk-icon="icon: tag; ratio: 0.8"></span> Completed</span>
                }
                {
                    props.status == "cancelled" && <span className="uk-label uk-label-danger"><span uk-icon="icon: tag; ratio: 0.8"></span> Cancelled</span>
                }
            </span>
        </div>
    </div>
}