import A from "../../../../../../../js/production/a.js";

export default function Logo({homeUrl, logoUrl, storeName, logoWidth, logoHeight}) {
    return <div className="logo">
        {logoUrl && <A url={homeUrl}><img src={logoUrl} alt={storeName} style={{width: logoWidth + 'px', height: logoHeight + 'px'}}/></A>}
        {!logoUrl && <A url={homeUrl}><span>{storeName}</span></A>}
    </div>
}