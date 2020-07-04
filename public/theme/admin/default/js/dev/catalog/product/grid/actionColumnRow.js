import A from "../../../../../../../../js/production/a.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";

export default function ActionColumnRow({areaProps}) {
    return <td>
        <div><A url={_.get(areaProps, 'row.editUrl', '')}><i className="fas fa-edit"></i></A></div>
        <div>
            <a className="text-danger"
               href={"javascript:void(0);"}
               onClick={
                   () => {
                       if (window.confirm('Are you sure?'))
                           Fetch(_.get(areaProps, 'row.deleteUrl', ''), false, 'GET');
                   }
               }>
                <i className="fas fa-trash-alt"></i>
            </a>
        </div>
    </td>;
}