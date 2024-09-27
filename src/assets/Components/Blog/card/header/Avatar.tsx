import PropTypes from "prop-types";
const DEFAULT_USER_PHOTO_URL = "../../../../Logo/agoraLogoTrasBlanco.png";
interface AvatarProps {
    source: string,
    url: string,
    alt: string
}

const Avatar = ({ source, url, alt }: AvatarProps) => {
    return (
        <div>
            <a href={url}>
                <img
                    src={source}
                    alt={alt}
                    className="w-12 rounded-full cursor-pointer" />
            </a>
        </div>
    )
}
0
Avatar.propTypes = {
    source: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
}

Avatar.defaultProps = {
    source: DEFAULT_USER_PHOTO_URL,
    alt: "random user photo",
    url: "Menai-Ala-Eddine"
}

export default Avatar