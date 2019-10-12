import P from "../../../../catalog/product/view/price_excl_tax.js";

const Price = ({ price_excl_tax }) => React.createElement(
    "td",
    null,
    React.createElement(P, { price_excl_tax: price_excl_tax })
);

export default Price;