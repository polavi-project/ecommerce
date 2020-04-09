let Error = (props)=> {
    let {error} = props;
    if(!error)
        return "";
    else
        return (<div className="invalid-feedback"><span>{error}</span></div>);
};

export {Error}