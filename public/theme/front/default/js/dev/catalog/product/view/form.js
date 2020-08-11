import {Form} from "../../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import Options from "./options.js";
import Area from "../../../../../../../../js/production/area.js";

function AddToCart() {
    return <div className="add-to-cart d-flex">
        <Text validation_rules={['notEmpty', 'number']} name={"qty"} placeholder={"Qty"} formId={"product-form"}/>
        <div className="button"><a className="btn btn-primary" href={"#"} onClick={(e) => { e.preventDefault(); document.getElementById('product-form').dispatchEvent(new Event('submit'))}}>Add to cart</a></div>
    </div>
}

export default function ProductForm(props) {
    return <Form id={"product-form"} action={props.action} method={"POST"} submitText={null}>
        <input type="hidden" name="product_id" value={props.productId}/>
        <Area
            id="product_single_page_form"
            coreWidgets={[
                {
                    'component': Options,
                    'props': {
                        options: props.customOptions ? props.customOptions : []
                    },
                    'sort_order': 10,
                    'id': 'product-single-custom-options'
                },
                {
                    'component': AddToCart,
                    'props': {},
                    'sort_order': 50,
                    'id': 'product-single-add-cart'
                }
            ]}
        />
    </Form>
}