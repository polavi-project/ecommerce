import Area from "../../../../../../../js/production/area.js";
import Checkbox from "../../../../../../../js/production/form/fields/checkbox.js";

function LayoutList({selectedLayouts = [], formId = '', }) {
    return <Area
        id="layout-list"
        coreWidgets={[
            {
                'component': Checkbox,
                'props': {
                    name: "layout[homepage]",
                    isChecked: selectedLayouts.find((e) => e === 'homepage') !== undefined,
                    formId: formId,
                    label: "Home page"
                },
                'sort_order': 10,
                'id': 'home-page-layout'
            },
            {
                'component': Checkbox,
                'props': {
                    name: "layout[category.view|category.view.pretty]",
                    isChecked: selectedLayouts.find((e) => e === 'category.view|category.view.pretty') !== undefined,
                    formId: formId,
                    label: "Category page"
                },
                'sort_order': 10,
                'id': 'category-page-layout'
            },
            {
                'component': Checkbox,
                'props': {
                    name: "layout[product.view|product.view.pretty]",
                    isChecked: selectedLayouts.find((e) => e === 'product.view|product.view.pretty') !== undefined,
                    formId: formId,
                    label: "Product page"
                },
                'sort_order': 20,
                'id': 'product-page-layout'
            },
            {
                'component': Checkbox,
                'props': {
                    name: "layout[checkout.cart]",
                    isChecked: selectedLayouts.find((e) => e === 'checkout.cart') !== undefined,
                    formId: formId,
                    label: "Shopping cart page"
                },
                'sort_order': 30,
                'id': 'cart-page-layout'
            },
            {
                'component': Checkbox,
                'props': {
                    name: "layout[checkout.index]",
                    isChecked: selectedLayouts.find((e) => e === 'checkout.index') !== undefined,
                    formId: formId,
                    label: "Checkout page"
                },
                'sort_order': 40,
                'id': 'checkout-page-layout'
            },
            {
                'component': Checkbox,
                'props': {
                    name: "layout[catalog.search]",
                    isChecked: selectedLayouts.find((e) => e === 'catalog.search') !== undefined,
                    formId: formId,
                    label: "Search page"
                },
                'sort_order': 50,
                'id': 'search-page-layout'
            },
            {
                'component': Checkbox,
                'props': {
                    name: "layout[not.found]",
                    isChecked: selectedLayouts.find((e) => e === 'not.found') !== undefined,
                    formId: formId,
                    label: "404 page"
                },
                'sort_order': 60,
                'id': 'not-found-page-layout'
            }
        ]}
    />
}

export {LayoutList}