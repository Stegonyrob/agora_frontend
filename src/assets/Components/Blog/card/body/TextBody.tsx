import PropTypes from "prop-types";
const Text = ({ content }: { content: string }) => (

) => (
    <div className="mt-2 mb-4 mx-4">
        <p className="text-sm text-justify">
            {content.split(" ").map((str) => {
                if (str.startsWith("#")) {
                    return <a href={`/${str}`} className="text-blue-500">{str} </a>;
                }
                return str + " ";
            })}</p>
    </div>
)

Text.propTypes = {
    content: PropTypes.string.isRequired
}

Text.defaultProps = {
    content: "Bienvenidos a Ágora Centro Educativo de Apoyo Especializado"
}

export default Text