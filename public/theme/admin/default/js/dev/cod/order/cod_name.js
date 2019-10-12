export default function CodName({areaProps}) {
    if(_.get(areaProps, 'payment_method') !== 'cod')
        return null;
    else
        return <td>
            <span>Cash on delivery</span>
        </td>
}