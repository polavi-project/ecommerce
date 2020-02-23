export default function ProductFilterWidgetType({areaProps}) {
    if(areaProps.noOuter === true)
        return <option value={'product_filter'}>Product filter</option>;
    else if(areaProps.selectedType == 'product_filter')
        return <span>Product filter</span>;
    else
        return null;
}