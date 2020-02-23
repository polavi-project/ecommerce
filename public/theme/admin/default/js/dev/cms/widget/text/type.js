export default function TextWidgetType({areaProps}) {
    if(areaProps.noOuter === true)
        return <option value={'text'}>Text</option>;
    else if(areaProps.selectedType == 'text')
        return <span>Text</span>;
    else
        return null;
}