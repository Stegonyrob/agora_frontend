import { useState } from "react"
import Layout from "./LayoutCard"
import Body from "./body/Body"
import Footer from "./footer/admin/FooterAdmin"
import Header from "./header/Header"


const Card = () => {

    const [visibility, setVisibility] = useState(false)
    const value = { visibility, setVisibility }

    return
    <div className="w-full flex justify-center">
        <Layout>
            <Header />
            <Body />
            <Footer />

        </Layout>
    </div>
}

export default Card