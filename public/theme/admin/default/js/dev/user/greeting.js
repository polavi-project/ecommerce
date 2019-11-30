export default function AdminUserGreeting({fullName, logoutUrl}) {
    return <div className="admin-user-greeting">
        <div><span>Hello</span> <span className="user-name">{fullName}</span>! <a href={logoutUrl}><span>Logout</span></a></div>
    </div>
}