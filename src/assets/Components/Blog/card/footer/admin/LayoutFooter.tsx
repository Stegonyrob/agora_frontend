import { ReactNode } from "react"

const Layout = ({ children }: { children: ReactNode }) => (
    <div className="flex bg-white mt-4 justify-around w-full">
        {children}
    </div>)

export default Layout