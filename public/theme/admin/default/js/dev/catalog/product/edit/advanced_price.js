import Text from "../../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import Datefield from "../../../../../../../../js/production/form/fields/date.js";

export default function AdvancedPrice(props) {
    const [prices, setPrices] = React.useState(props.prices !== undefined ? props.prices:  []);

    const removePrice = (e, key) => {
        e.preventDefault();
        const newPrices = prices.filter((_, index) => index !== key);

        setPrices(newPrices);
    };

    const addPrice = (e) => {
        e.preventDefault();
        setPrices(prices.concat({
            product_price_id: Date.now(),
            customer_group_id: "",
            qty: "",
            price: "",
            active_from: "",
            active_to: ""
        }));
    };
    return (
        <div className="uk-overflow-auto border-block">
            <div className="group-form-title"><strong>Advance price</strong></div>
            <table className="uk-table uk-table-divider uk-table-striped uk-table-small uk-table-justify">
                <thead>
                <tr>
                    <th>Customer Group</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th className="uk-table-shrink uk-width-1-2">Active From</th>
                    <th className="uk-table-shrink uk-width-1-2">Active To</th>
                    <th className="uk-table-shrink uk-width-1-2">Action</th>
                </tr>
                </thead>
                <tbody>
                {prices.map((price, index) => {
                    return <tr key={index}>
                        <td>
                            <Select
                                name={'advance_price[' + price.product_price_id + '][customer_group_id]'}
                                value={price.customer_group_id}
                                options={props.customerGroups}
                            />
                        </td>
                        <td>
                            <Text formId={props.formId} key={"qty_" + index} type="text" name={'advance_price[' + price.product_price_id + '][qty]'} value={price.qty} validation_rules={["number"]}/>
                        </td>
                        <td>
                            <Text formId={props.formId} key={"price_" + index} type="text" name={'advance_price[' + price.product_price_id + '][price]'} value={price.price} validation_rules={["notEmpty"]}/>
                        </td>
                        <td className="uk-width-1-2">
                            <Datefield formId={props.formId} type="text" name={'advance_price[' + price.product_price_id + '][active_from]'} value={price.active_from}/>
                        </td>
                        <td className="uk-width-1-2">
                            <Datefield formId={props.formId} type="text" name={'advance_price[' + price.product_price_id + '][active_to]'} value={price.active_to}/>
                        </td>
                        <td>
                            <a onClick={(e)=>removePrice(e, index)}><span uk-icon="minus-circle"></span></a>
                        </td>
                    </tr>;
                })}
                </tbody>
                <tfoot>
                <tr>
                    <td><a onClick={addPrice}><span uk-icon="plus-circle"></span></a></td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
}