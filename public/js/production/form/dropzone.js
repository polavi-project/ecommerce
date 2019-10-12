export default function Dropzone({ config }) {
    React.useEffect(function () {
        $(document).on('load', function () {
            $("div#dropzone").dropzone({
                url: "/uploadcar"
            });
        });
    }, []);
    return React.createElement(
        "div",
        { id: "dropzone" },
        React.createElement("input", { type: "file", name: "file" })
    );
}