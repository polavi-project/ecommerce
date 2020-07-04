export default function Activities({activities}) {
    return <div className="sml-block mt-4">
        <div className="sml-block-title">Activities</div>
        <ul className="list-group list-group-flush">
            {activities.map((a, i) => {
                let date = new Date(a.created_at);
                return <li key={i} className="list-group-item">
                    <span><i>{a.comment}</i> - <i>{date.toDateString()}</i> - <span>
                        {a.customer_notified === 1 && <span>Customer notified</span>}
                        {a.customer_notified === 0 && <span>Customer not notified</span>}
                    </span></span>
                </li>
            })}
        </ul>
    </div>
}