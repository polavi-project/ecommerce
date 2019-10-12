import Area from "../../../../../../../js/production/area.js";

export default function OrderEdit() {
    return <div className='uk-grid uk-grid-small'>
        <Area
            id='order_edit_left'
            className='uk-width-2-3'
        />
        <Area
            id='order_edit_right'
            className='uk-width-1-3'
        />
    </div>
}