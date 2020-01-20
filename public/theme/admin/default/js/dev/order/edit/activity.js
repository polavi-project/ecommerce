export default function Activities({activities}) {
    return <div className={"uk-width-1-1"}>
        <div className="border-block">
            <div><h3>Activities</h3></div>
            <ul className="uk-list uk-list-divider">
                {activities.map((a, i) => {
                    let date = new Date(a.created_at);
                    return <li key={i}>
                    <span><i>{a.comment}</i> - <i>{date.toDateString()}</i> - <span>
                        {a.customer_notified === 1 && <span>Customer notified</span>}
                        {a.customer_notified === 0 && <span>Customer not notified</span>}
                    </span></span>
                    </li>
                })}
            </ul>
        </div>
    </div>
}