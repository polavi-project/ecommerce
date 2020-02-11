import {Form} from "../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../js/production/area.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import {ProvinceOptions} from "../../../../../../../js/production/locale/province_option.js";
import Select from "../../../../../../../js/production/form/fields/select.js";
import {CountryOptions} from "../../../../../../../js/production/locale/country_option.js";

function Province({selectedCountry, selectedProvince}) {
    return <ProvinceOptions country={selectedCountry}>
        <Select
            value={selectedProvince}
            name="variables[address][province]"
            label={"Province"}
            validation_rules={["notEmpty"]}
        />
    </ProvinceOptions>
}

function Country({country, setCountry, countries = []}) {

    const [selectedCountry, setSelectedCountry] = React.useState(() => {
        if(countries.length === 1)
            return countries[0];
        else
            return country;
    });

    React.useEffect(() => {
        if(countries.length === 1) {
            setSelectedCountry(countries[0]);
            setCountry(countries[0]);
        }
    }, []);

    const handler = (e) => {
        setCountry(e.target.value);
    };

    return <div style={{display: countries.length > 1 ? 'block' : 'none'}}>
        <CountryOptions countries={countries}>
            <Select
                value={selectedCountry}
                label="Country"
                name="variables[address][country]"
                className="uk-form-small"
                handler={handler}
                validation_rules={["notEmpty"]}
            />
        </CountryOptions>
    </div>
}

export default function Address(props) {
    const [selectedCountry, setSelectedCountry] = React.useState(_.get(props, 'address.country'));
    const id = props.id !== undefined ? props.id : "customer_address_form";
    return <Form
        id={id}
        onStart={props.onStart}
        onComplete={props.onComplete}
        onError={props.onError}
        action={props.action}>
        <Area
            id="customer_address_form_inner"
            coreWidgets={[
                {
                    'component': Text,
                    'props': {
                        name: "variables[address][full_name]",
                        value: _.get(props, 'address.full_name', ''),
                        formId: id,
                        label: "Full name",
                        validation_rules: ['notEmpty']
                    },
                    'sort_order': 10,
                    'id': 'full_name'
                },
                {
                    'component': Text,
                    'props': {
                        name: "variables[address][telephone]",
                        value: _.get(props, 'address.telephone', ''),
                        formId: id,
                        label: "Telephone",
                        validation_rules: ['notEmpty']
                    },
                    'sort_order': 30,
                    'id': 'telephone'
                },
                {
                    'component': Text,
                    'props': {
                        name: "variables[address][address_1]",
                        value: _.get(props, 'address.address_1', ''),
                        formId: id,
                        label: "Address 1",
                        validation_rules: ['notEmpty']
                    },
                    'sort_order': 40,
                    'id': 'address_1'
                },
                {
                    'component': Text,
                    'props': {
                        name: "variables[address][address_2]",
                        value: _.get(props, 'address.address_2', ''),
                        formId: id,
                        label: "Address 2",
                        validation_rules: []
                    },
                    'sort_order': 50,
                    'id': 'address_2'
                },
                {
                    'component': Text,
                    'props': {
                        name: "variables[address][postcode]",
                        value: _.get(props, 'address.postcode', ''),
                        formId: id,
                        label: "Postcode",
                        validation_rules: []
                    },
                    'sort_order': 60,
                    'id': 'postcode'
                },
                {
                    'component': Text,
                    'props': {
                        name: "variables[address][city]",
                        value: _.get(props, 'address.city', ''),
                        formId: id,
                        label: "City",
                        validation_rules: []
                    },
                    'sort_order': 70,
                    'id': 'city'
                },
                {
                    'component': Province,
                    'props': {
                        selectedCountry: selectedCountry,
                        selectedProvince: _.get(props, 'address.province', '')
                    },
                    'sort_order': 80,
                    'id': 'province'
                },
                {
                    'component': Country,
                    'props': {
                        country: _.get(props, 'address.country', ''),
                        countries: _.get(props, 'countries'),
                        setCountry: setSelectedCountry
                    },
                    'sort_order': 90,
                    'id': 'country'
                }
            ]}
        />
    </Form>
}