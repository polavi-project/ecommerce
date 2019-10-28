var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
const mapStateToProps = (state, ownProps) => {
    return state.customerInfo && state.customerInfo.email ? _extends({}, state.customerInfo) : ownProps;
};

function UserGreeting({ fullName, logoutUrl, myAccountUrl }) {
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
                fullName,
                "!"
            )
        ),
        React.createElement(
            "div",
            { "uk-dropdown": "mode: hover" },
            React.createElement(
                "ul",
                { className: "uk-list" },
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        A,
                        { url: myAccountUrl },
                        React.createElement(
                            "span",
                            null,
                            "My account"
                        )
                    )
                ),
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        A,
                        { url: logoutUrl },
                        React.createElement(
                            "span",
                            null,
                            "Log out"
                        )
                    )
                )
            )
        )
    );
}
const UserGreetingComponent = ReactRedux.connect(mapStateToProps)(UserGreeting);

export default function HeaderBlock(props) {
    const isLoggedIn = props.isLoggedIn;

    return React.createElement(
        "div",
        { className: "customer-area-header" },
        isLoggedIn && React.createElement(UserGreetingComponent, props),
        !isLoggedIn && React.createElement(GuestGreeting, props)
    );
}