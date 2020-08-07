import Area from "../../../../../../../../js/production/area.js";

export default function Tabs({ id }) {
    const [currentTab, setCurrentTab] = React.useState(null);
    const [tabs, setTabs] = React.useState([]);

    const registerTab = tab => {
        setTabs(preTabs => preTabs.concat(tab));
    };

    React.useEffect(() => {
        setCurrentTab(tabs[0] === undefined ? null : tabs[0]["id"]);
    }, [tabs]);

    const select = (e, tab) => {
        e.preventDefault();
        setCurrentTab(tab);
    };

    return React.createElement(Area, {
        id: id,
        className: "tabs",
        tabs: tabs,
        selectTab: select,
        currentTab: currentTab,
        registerTab: registerTab,
        coreWidgets: tabs.length === 0 ? [] : [{
            component: ({ tabs }) => React.createElement(
                "ul",
                { className: "header" },
                tabs.map((t, i) => {
                    return React.createElement(
                        "li",
                        { key: i, className: t.id == currentTab ? "active" : "unactivated" },
                        React.createElement(
                            "a",
                            { href: "#", onClick: e => select(e, t.id), className: "h4" },
                            t.name
                        )
                    );
                })
            ),
            props: {
                tabs: tabs
            },
            sort_order: 10,
            id: "header"
        }]
    });
}