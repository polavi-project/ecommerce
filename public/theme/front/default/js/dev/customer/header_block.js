import A from "../../../../../../js/production/a.js";

function GuestGreeting({loginUrl}) {
    return <div className="uk-inline">
        <A url={loginUrl}><span uk-icon="user"></span></A>
    </div>
}
const mapStateToProps = (state, ownProps) => {
    return state.customerInfo && state.customerInfo.email ? {...state.customerInfo} : ownProps;
};

function UserGreeting({full_name, logoutUrl, myAccountUrl}) {
    return <div className="uk-inline">
        <span><span>Hello </span> <span>{full_name}!</span></span>
        <div uk-dropdown="mode: hover">
            <ul className="uk-list">
                <li><A url={myAccountUrl}><span>My account</span></A></li>
                <li><A url={logoutUrl}><span>Log out</span></A></li>
            </ul>
        </div>
    </div>
}
const UserGreetingComponent = ReactRedux.connect(mapStateToProps)(UserGreeting);

export default function HeaderBlock(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return <UserGreetingComponent {...props}/>;
    }
    return <GuestGreeting {...props}/>;
}