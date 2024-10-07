import React from "react"

interface LayoutProps extends React.PropsWithChildren<{}> { }

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (<div >
        {children}
    </div>)
}

export default Layout