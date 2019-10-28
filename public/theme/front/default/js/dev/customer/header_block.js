import A from "../../../../../../js/production/a.js";

function GuestGreeting({loginUrl, registerUrl}) {
    return <div className="uk-inline">
        <A url={registerUrl}><span>Create account</span></A> | <A url={loginUrl}><span>Login</span></A>
    </div>
}
const mapStateToProps = (state, ownProps) => {
    return state.customerInfo && state.customerInfo.email ? {...state.customerInfo} : ownProps;
};

function UserGreeting({fullName, logoutUrl, myAccountUrl}) {
    return <div className="uk-inline">
        <span><span>Hello </span> <span>{fullName}!</span></span> <A url={myAccountUrl}><span>My account</span></A> | <A url={logoutUrl}><span>Log out</span></A>
    </div>
}
const UserGreetingComponent = ReactRedux.connect(mapStateToProps)(UserGreeting);

export default function HeaderBlock(props) {
    const isLoggedIn = props.isLoggedIn;

    return <div className="customer-area-header">
        {isLoggedIn && <UserGreetingComponent {...props}/>}
        {!isLoggedIn && <GuestGreeting {...props}/>}
    </div>
}