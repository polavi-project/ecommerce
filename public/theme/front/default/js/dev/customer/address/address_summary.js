import Area from "../../../../../../../js/production/area.js";

export default function AddressSummary({address}) {
    return <Area
        id={"address_summary"}
        className={"address-summary"}
        coreWidgets={[
            {
                component: ({full_name}) => <div className="full-name">{full_name}</div>,
                props : {
                    full_name: address.full_name
                },
                sort_order: 10,
                id: "full_name"
            },
            {
                component: ({address_1}) => <div className="address-one">{address_1}</div>,
                props : {
                    address_1: address.address_1
                },
                sort_order: 20,
                id: "address_1"
            },
            {
                component: ({address_2}) => <div className="address-two">{address_2}</div>,
                props : {
                    address_2: address.address_2
                },
                sort_order: 30,
                id: "address_2"
            },
            {
                component: ({city}) => <div className="city">{city}</div>,
                props : {
                    city: address.city
                },
                sort_order: 30,
                id: "city"
            },
            {
                component: ({city, province, postcode}) => <div className="city-province-postcode">{city}, {province}, {postcode}</div>,
                props : {
                    city: address.city,
                    province: address.province,
                    postcode: address.postcode
                },
                sort_order: 40,
                id: "city_province_postcode"
            },
            {
                component: ({country}) => <div className="country">{country}</div>,
                props : {
                    country: address.country
                },
                sort_order: 50,
                id: "country"
            },
            {
                component: ({telephone}) => <div className="telephone">{telephone}</div>,
                props : {
                    telephone: address.telephone
                },
                sort_order: 60,
                id: "telephone"
            }
        ]}
    />;
}