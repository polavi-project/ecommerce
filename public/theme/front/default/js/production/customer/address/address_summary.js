import Area from "../../../../../../../js/production/area.js";

export default function AddressSummary({ address }) {
    return React.createElement(Area, {
        id: "address_summary",
        className: "address-summary",
        coreWidgets: [{
            component: ({ full_name }) => React.createElement(
                "div",
                { className: "full-name" },
                full_name
            ),
            props: {
                full_name: address.full_name
            },
            sort_order: 10,
            id: "full_name"
        }, {
            component: ({ address_1 }) => React.createElement(
                "div",
                { className: "address-one" },
                address_1
            ),
            props: {
                address_1: address.address_1
            },
            sort_order: 20,
            id: "address_1"
        }, {
            component: ({ address_2 }) => React.createElement(
                "div",
                { className: "address-two" },
                address_2
            ),
            props: {
                address_2: address.address_2
            },
            sort_order: 30,
            id: "address_2"
        }, {
            component: ({ city }) => React.createElement(
                "div",
                { className: "city" },
                city
            ),
            props: {
                city: address.city
            },
            sort_order: 30,
            id: "city"
        }, {
            component: ({ city, province, postcode }) => React.createElement(
                "div",
                { className: "city-province-postcode" },
                city,
                ", ",
                province,
                ", ",
                postcode
            ),
            props: {
                city: address.city,
                province: address.province,
                postcode: address.postcode
            },
            sort_order: 40,
            id: "city_province_postcode"
        }, {
            component: ({ country }) => React.createElement(
                "div",
                { className: "country" },
                country
            ),
            props: {
                country: address.country
            },
            sort_order: 50,
            id: "country"
        }, {
            component: ({ telephone }) => React.createElement(
                "div",
                { className: "telephone" },
                telephone
            ),
            props: {
                telephone: address.telephone
            },
            sort_order: 60,
            id: "telephone"
        }]
    });
}