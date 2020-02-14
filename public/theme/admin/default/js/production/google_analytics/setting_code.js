import Text from "../../../../../../js/production/form/fields/text.js";

export default function GoogleAnalyticsSetting({ areaProps }) {
    return React.createElement(Text, {
        id: "general_google_analytics",
        formId: "general_setting_form",
        name: "general_google_analytics",
        label: "Google analytics tracking code",
        value: _.get(areaProps, 'general_google_analytics')
    });
}