
interface UserInfo {
    username: string;
    time: string;
    location: string;
}

const UserInfo = ({ username, time, location }: UserInfo) => {
    const normalizeUserLink = () => {
        return username.replaceAll(" ", "-");
    };

    return (
        <div className="flex flex-col ml-2">
            <a
                href={normalizeUserLink()}
                className="font-bold text-sm mb-0 leading-tight tracking-wide cursor-default hover:text-indigo-800"
            >
                {username}
            </a>
            <p className="font-normal text-xs text-gray-600 mt-0">
                {time} • {location}
            </p>
        </div>
    );
};

export default UserInfo;