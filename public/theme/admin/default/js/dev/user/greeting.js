export default function AdminUserGreeting({fullName, logoutUrl, time}) {
    return <div className="admin-user-greeting">
        <div>
            <div><span>Hello</span> <span className="user-name">{fullName}</span>!</div>
            <i className="time">{time}</i>
        </div>
        <div>
            <a href={logoutUrl} className="logout"><span>Logout</span><i className="fas fa-sign-out-alt"></i></a>
        </div>
    </div>
}