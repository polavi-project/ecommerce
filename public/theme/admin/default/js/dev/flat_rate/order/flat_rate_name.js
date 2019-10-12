export default function FlatRateName({areaProps, title}) {
    if(_.get(areaProps, 'shipping_method') !== 'flatrate')
        return null;
    else
        return <td>
            <span>{title}</span>
        </td>
}