import {Fetch} from "../../../../../../../js/production/fetch.js";
import Address from "./address.js";

function AddressInfo({address}) {
    return <div>
        <div>{address.full_name}</div>
        <div>{address.address_1}</div>
        <div>{address.city} {address.province}</div>
        <div>{address.country}</div>
        <div>{address.is_default && <span uk-icon="icon: location; ratio: 1"></span>}</div>
    </div>
}

export default function Addresses(props) {
    const [addresses, setAddresses] = React.useState(props.addresses ? props.addresses : []);
    const addAddress = (e) => {
        e.preventDefault();
        setAddresses(addresses.concat({
            index: addresses.length,
            is_default: false,
            editing: true
        }));
    };

    const deleteAddress = (id) => {
        Fetch(props.deleteUrl, false, 'POST', {id: id}, null, (response) => {
            if(_.get(response, "payload.data.deleteCustomerAddress.status") === true) {
                const newAddresses = addresses.filter((addr, index) => parseInt(addr.customer_address_id) !== parseInt(id));
                setAddresses(newAddresses);
            }
        })
    };

    const updateAddress = (index, address) => {
        setAddresses(()=> {
            return addresses.map((a, i) => {
                if(parseInt(i) === parseInt(index))
                    return address;
                return a;
            });
        })
    };

    return <div className="uk-grid-small uk-width-1-2@m">
        <h2>Your address(s)</h2>
        {addresses.map((a,i)=> {
            return <div key={i}>
                <AddressInfo address={a}/>
                {a.editing && <Address
                    address={a}
                    id={"customer-address-form-" + i}
                    onComplete={a.customer_address_id ? updateAddress : addresses}
                    countries={_.get(props, 'countries')}
                    action={a.customer_address_id ? props.updateUrl : props.createUrl}
                />}
                {!a.editing && <a
                    href={"#"}
                    onClick={(e)=> {e.preventDefault(); updateAddress(i, {...a, editing: true})}}>
                    <span uk-icon="icon: file-edit; ratio: 0.8"></span>
                </a>}
                {a.customer_address_id && <a href={"#"} onClick={(e) => {e.preventDefault(); deleteAddress(a.customer_address_id)}}><span uk-icon="icon: trash; ratio: 0.8"></span></a>}
            </div>
        })}

        <a href="#" onClick={(e) => addAddress(e)}>Add new</a>
    </div>
}