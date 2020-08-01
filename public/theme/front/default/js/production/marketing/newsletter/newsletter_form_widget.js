import { Form } from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";

export default function NewsletterForm({ title, html_before, html_after, subscribeUrl }) {
    return React.createElement(
        Form,
        {
            id: "newsletter-subscribe-form",
            action: subscribeUrl,
            method: "POST"
        },
        React.createElement(
            "div",
            { className: "newsletter-form" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    title
                )
            ),
            React.createElement("div", { className: "html-before", dangerouslySetInnerHTML: { __html: html_before } }),
            React.createElement(Text, { name: "email", value: "", validation_rules: ["required", "email"] }),
            React.createElement("div", { className: "html-before", dangerouslySetInnerHTML: { __html: html_after } })
        )
    );
}