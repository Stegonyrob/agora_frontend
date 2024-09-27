import React from "react"

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
    <div className="flex w-full bg-white px-4">
        {/* El layout es un wrapper que contiene los elementos de la cabecera
      como el avatar, la informacion del usuario y el icono de mas.
      El contenedor de la cabecera se aplica un padding horizontal de 4
      para que los elementos se distribuyan correctamente. */}
        {children}
    </div>
)

export default Layout