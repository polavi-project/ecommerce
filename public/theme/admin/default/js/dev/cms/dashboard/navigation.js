import A from "../../../../../../../js/production/a.js";
import Navigation from "../../../../../../../js/production/navigation.js";

function Logo({adminUrl, logoUrl, storeName}) {
    return <div className="logo">
        {logoUrl && <A url={adminUrl}><img src={logoUrl} alt={storeName} title={storeName}/></A>}
        {!logoUrl && <A url={adminUrl}><span>{storeName}</span></A>}
    </div>
}

export default function AdminNavigation(props) {
    return <div className="admin-nav-container">
        <div className="top-bar">
            <Logo adminUrl={props.adminUrl} logoUrl={props.logoUrl} storeName={props.storeName}/>
            <a className="menu-toggle" href="javascript:void(0)">
                <i className="fas fa-list"></i>
            </a>
        </div>
        <div className="admin-nav" data-simplebar="true" data-simplebar-auto-hide="false">
            <Navigation items={props.items}/>
        </div>
    </div>
}