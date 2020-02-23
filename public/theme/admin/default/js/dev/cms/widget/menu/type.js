export default function MenuWidgetType({areaProps}) {
    if(areaProps.noOuter === true)
        return <option value={'menu'}>Menu</option>;
    else if(areaProps.selectedType == 'menu')
        return <span>Menu</span>;
    else
        return null;
}