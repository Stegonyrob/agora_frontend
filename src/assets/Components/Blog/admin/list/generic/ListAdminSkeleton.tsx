// src/components/Admin/ListAdmin/ListAdminSkeleton/ListAdminSkeleton.tsx
import React from 'react';
import ItemGenericSkeleton from './ItemGenericSkeleton'; // Importamos el esqueleto de ItemGeneric
import styles from './ListAdminSkeleton.module.scss';

interface ListAdminSkeletonProps {
    type: 'post' | 'event'; // Para que los esqueletos de ItemGeneric sepan qué tipo simular
    itemCount?: number; // Número de esqueletos de ítem a mostrar (por defecto 3-5)
}

const ListAdminSkeleton: React.FC<ListAdminSkeletonProps> = ({ type, itemCount = 3 }) => {
    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                {/* Placeholder para el botón de crear */}
                <div className={styles.createButtonPlaceholder}></div>

                {/* Si no hay items (en el caso de carga inicial sin datos), se puede mostrar un mensaje o simplemente la lista de esqueletos */}
                {itemCount === 0 && ( // Si la intención es mostrar un mensaje de "no hay items" también en el skeleton
                    <div className={styles.noItemsMessagePlaceholder}>
                        <div className={styles.skeletonLine}></div>
                        <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`}></div>
                    </div>
                )}

                {/* Contenedor para la lista de esqueletos de ítems */}
                <div className={styles.itemList}>
                    {Array.from({ length: itemCount }).map((_, index) => (
                        <ItemGenericSkeleton key={index} type={type} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListAdminSkeleton;
