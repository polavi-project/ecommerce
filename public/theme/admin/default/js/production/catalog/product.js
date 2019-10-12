import AdvancePrice from "./product/edit/advance_price.js";
import CustomOption from "./product/edit/option.js";
import Attribute from "./product/edit/attribute.js";
import Category from "./product/edit/category.js";

(function () {
    add_listener('form_render_before_product_form', function () {
        const { data } = this.props;
        this.html_after_general = React.createElement(Category, {
            categories: data.categories,
            category: data.category
        });

        this.html_after_price = React.createElement(AdvancePrice, {
            customer_groups: data.customer_groups ? data.customer_groups : [],
            prices: data.advance_prices ? data.advance_prices : [],
            addFieldToValidate: this.addFieldToValidate.bind(this),
            removeFieldFromValidation: this.removeFieldFromValidation.bind(this)
        });

        this.html_before_seo = React.createElement(CustomOption, {
            custom_options: data.custom_options ? data.custom_options : [],
            addFieldToValidate: this.addFieldToValidate.bind(this),
            removeFieldFromValidation: this.removeFieldFromValidation.bind(this)
        });

        this.html_before_description = React.createElement(Attribute, {
            group_id: data.group_id,
            attribute_groups: data.attributes ? data.attributes : [],
            addFieldToValidate: this.addFieldToValidate.bind(this),
            removeFieldFromValidation: this.removeFieldFromValidation.bind(this)
        });
    });
})();