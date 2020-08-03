import {Form} from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";

export default function NewsletterForm({title, html_before, html_after, subscribeUrl}) {
    return <Form
        id={"newsletter-subscribe-form"}
        action={subscribeUrl}
        method={"POST"}
        >
        <div className="newsletter-form">
            <div className="title"><span>{title}</span></div>
            <div className="html-before" dangerouslySetInnerHTML={{__html: html_before}}></div>
            <Text name={"email"} value={""} validation_rules={["notEmpty", "email"]} formId={"newsletter-subscribe-form"}/>
            <div className="html-before" dangerouslySetInnerHTML={{__html: html_after}}></div>
        </div>
    </Form>
}