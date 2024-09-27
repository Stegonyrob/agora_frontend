import PropTypes from "prop-types"
const DEFAULT_POST_PHOTO_URL = "../../../../../../../public/images/blocks-8866100_1280.png"

interface ImageBodyProps {
    source: string
    alt: string
}
const ImageBody = ({ source, alt }: ImageBodyProps) => (
    <div>
        <img
            src={source}
            alt={alt}
            className="xs:h-48  w-full" />
    </div>

)

ImageBody.propTypes = {
    source: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
}

ImageBody.defaultProps = {
    source: DEFAULT_POST_PHOTO_URL,
    alt: DEFAULT_POST_PHOTO_URL,
}
export default ImageBody