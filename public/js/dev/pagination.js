export default function Pagination({total, limit, current}) {
    return <div>
        <ul className="pagination">
            <li className="prev"><a href={"#"}><span>Previous</span></a></li>
            <li className="first"></li>
            <li className="current"></li>
            <li className="last"></li>
            <li className="next"><a href={"#"}><span>Next</span></a></li>
        </ul>
    </div>
}