import Avatar from "./Avatar"
import Layout from "./Layout"
import UserInfo from "./UserInfo"


const Header = () => (
    <Layout>
        <Avatar />
        <UserInfo username={""} time={""} location={""} />

    </Layout>
)

export default Header