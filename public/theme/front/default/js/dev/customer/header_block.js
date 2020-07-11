import A from "../../../../../../js/production/a.js";

function GuestGreeting({loginUrl, registerUrl}) {
    return <div className="uk-inline">
        <A url={registerUrl}><span>Create account</span></A> | <A url={loginUrl}><span>Login</span></A>
    </div>
}

function UserGreeting({logoutUrl, myAccountUrl}) {
    const customerInfo = ReactRedux.useSelector(state => _.get(state, 'appState.customer'));
    return <div className="uk-inline">
        <span><span>Hello </span> <span>{_.get(customerInfo, 'full_name')}!</span></span> <A url={myAccountUrl}><span>My account</span></A> | <A url={logoutUrl}><span>Log out</span></A>
    </div>
}

export default function HeaderBlock(props) {
    const isLoggedIn = props.isLoggedIn;

    return <div className="customer-area-header">
        {isLoggedIn && <UserGreeting {...props}/>}
        {!isLoggedIn && <GuestGreeting {...props}/>}
    </div>
}