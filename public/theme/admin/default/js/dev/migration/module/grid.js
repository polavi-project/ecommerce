import A from "../../../../../../../js/production/a.js";

export default function ExtensionGrid({extensions})
{
    return <div className="grid sml-block">
        <div className={"extension-grid mt-4"}>
            <table className="table table-bordered sticky">
                <thead>
                <tr>
                    <th>
                        <div className="table-header id-header">
                            <div className={"title"}><span>Name</span></div>
                        </div>
                    </th>
                    <th>
                        <div className="table-header id-header">
                            <div className={"title"}><span>Information</span></div>
                        </div>
                    </th>
                    <th>
                        <div className="table-header id-header">
                            <div className={"title"}><span>Action</span></div>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {extensions.map((m, i)=> {
                    return <tr>
                        <td>{m.name}</td>
                        <td>
                            <div className="mb-2">{m.description}</div>
                            <div><strong>Version</strong> {m.version}</div>
                            <div><strong>Author</strong> <a href={m.author_url}>{m.author}</a></div>
                        </td>
                        <td>
                            {parseInt(m.status) === 1 && <div><A url={m.disableUrl} className="text-danger">Disable</A></div>}
                            {parseInt(m.status) === 0 && <div><A url={m.disableUrl} className="text-primary">Enable</A></div>}
                            {m.status === undefined && <div><A url={m.installUrl} className="text-primary">Install</A></div>}
                        </td>
                    </tr>
                })}
                </tbody>
            </table>
            {extensions.length === 0 &&
            <div>There is no module to display</div>
            }
        </div>
    </div>
}