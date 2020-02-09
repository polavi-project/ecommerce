import A from "../../../../../../js/production/a.js";

function GuestGreeting({ loginUrl, registerUrl }) {
    return React.createElement(
        "div",
        { className: "uk-inline" },
        React.createElement(
            A,
            { url: registerUrl },
            React.createElement(
                "span",
                null,
                "Create account"
            )
        ),
        " | ",
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
        { className: "uk-inline" },
        React.createElement(
            "span",
            null,
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
        " ",
        React.createElement(
            A,
            { url: myAccountUrl },
            React.createElement(
                "span",
                null,
                "My account"
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
        { className: "customer-area-header" },
        isLoggedIn && React.createElement(UserGreeting, props),
        !isLoggedIn && React.createElement(GuestGreeting, props)
    );
}