import React from "react"

interface LayoutProps extends React.PropsWithChildren<{}> { }

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (<div className="xs:w-11/12 xs:mx-4 sm:w-3/4 sm:mx-3 md:w-1/2 md:mx-3
                            bg-white w-1/3 rounded-xl h-auto shadow-xl py-4 relative">
        {children}
    </div>)
}

export default Layout