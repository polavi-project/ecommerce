const Description = ({ description, areaProps }) => {
    React.useEffect(() => {
        areaProps.registerTab({ name: "Description", id: "description" });
    }, []);

    return areaProps.currentTab == "description" ? React.createElement("div", { className: "product-description", dangerouslySetInnerHTML: { __html: description } }) : null;
};

export default Description;