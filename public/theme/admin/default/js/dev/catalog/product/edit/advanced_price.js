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
        <div className="sml-block mt-4">
            <div className="sml-block-title">Advance price</div>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>Customer Group</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Active From</th>
                    <th>Active To</th>
                    <th>Action</th>
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
                            <Text formId={props.formId} key={"price_" + index} type="text" name={'advance_price[' + price.product_price_id + '][tier_price]'} value={price.price} validation_rules={["notEmpty"]}/>
                        </td>
                        <td>
                            <Datefield formId={props.formId} type="text" name={'advance_price[' + price.product_price_id + '][active_from]'} value={price.active_from}/>
                        </td>
                        <td>
                            <Datefield formId={props.formId} type="text" name={'advance_price[' + price.product_price_id + '][active_to]'} value={price.active_to}/>
                        </td>
                        <td className="align-middle">
                            <a onClick={(e)=>removePrice(e, index)} href="javascript:void(0)" className="text-danger"><i className="fas fa-trash-alt"></i></a>
                        </td>
                    </tr>;
                })}
                </tbody>
                <tfoot>
                <tr>
                    <td><a onClick={addPrice} href="javascript:void(0)"><i className="fas fa-plus"></i></a></td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
}