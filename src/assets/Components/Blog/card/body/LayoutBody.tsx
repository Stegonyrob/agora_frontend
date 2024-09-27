import React from "react";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
    <div>
        {children}
    </div>
)

export default Layout