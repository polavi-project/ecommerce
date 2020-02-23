export default function FeaturedProductWidgetType({areaProps}) {
    if(areaProps.noOuter === true)
        return <option value={'featured_products'}>Featured products</option>;
    else if(areaProps.selectedType == 'featured_products')
        return <span>Featured products</span>;
    else
        return null;
}