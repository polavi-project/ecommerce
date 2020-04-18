import A from "../../../../../../../../js/production/a.js";

export default function AddNewButton({ url }) {
    return React.createElement(A, { pushState: true, text: "New group", url: url, className: "btn btn-primary" });
}