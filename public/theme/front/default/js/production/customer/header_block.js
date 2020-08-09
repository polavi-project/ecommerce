import A from "../../../../../../js/production/a.js";

function GuestGreeting({ loginUrl }) {
    return React.createElement(
        "div",
        { className: "" },
        React.createElement(
            A,
            { url: loginUrl },
            React.createElement(
                "span",
                null,
                "Login"
            )
        )
    );
}

function UserGreeting({ logoutUrl, myAccountUrl }) {
    const customerInfo = ReactRedux.useSelector(state => _.get(state, 'appState.customer'));
    return React.createElement(
        "div",
        { className: "" },
        React.createElement(
            A,
            { url: myAccountUrl },
            React.createElement(
                "span",
                null,
                "Hello "
            ),
            " ",
            React.createElement(
                "span",
                null,
                _.get(customerInfo, 'full_name'),
                "!"
            )
        ),
        " | ",
        React.createElement(
            A,
            { url: logoutUrl },
            React.createElement(
                "span",
                null,
                "Log out"
            )
        )
    );
}

export default function HeaderBlock(props) {
    const isLoggedIn = props.isLoggedIn;

    return React.createElement(
        "div",
        { className: "customer-header" },
        isLoggedIn && React.createElement(UserGreeting, props),
        !isLoggedIn && React.createElement(GuestGreeting, props)
    );
}