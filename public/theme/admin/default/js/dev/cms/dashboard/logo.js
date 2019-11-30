import A from "../../../../../../../js/production/a.js";

export default function Logo({adminUrl, logoUrl, storeName, logoWidth, logoHeight}) {
    return <div className="logo">
        {logoUrl && <A url={adminUrl}><img src={logoUrl} alt={storeName} style={{width: logoWidth + 'px', height: logoHeight + 'px'}}/></A>}
        {!logoUrl && <A url={adminUrl}><span>{storeName}</span></A>}
    </div>
}