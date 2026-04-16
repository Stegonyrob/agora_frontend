import React from 'react';
import styles from './DashboardSkeleton.module.scss'; // Su propio archivo SCSS

interface DashboardSkeletonProps {
    // Puedes pasar un número para cuántos elementos esqueleto quieres mostrar por sección
    itemCount?: number;
}

const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ itemCount = 8 }) => {
    // Función auxiliar para renderizar una sección de esqueleto
    const renderSkeletonGrid = () => (
        <div className={styles.sectionBlock}>
            {/* Título del esqueleto */}
            <h2 className={styles.sectionTitle}>
                {/* Usamos un div con la clase .skeletonLabel para el título, ajustando su altura y ancho */}
                <div className={`${styles.skeletonLabel} ${styles.skeletonTitlePlaceholder}`}></div>
            </h2>
            <div className={styles.menuGrid}>
                {Array.from({ length: itemCount }).map((_, index) => (
                    <div key={index} className={`${styles.menuItem} ${styles.skeleton}`}> {/* Aplica .skeleton al menuItem */}
                        {/* Insignia del esqueleto */}
                        <div className={styles.skeletonBadge}></div>
                        {/* Icono del esqueleto */}
                        <div className={styles.skeletonIcon}></div>
                        {/* Etiqueta del esqueleto */}
                        <div className={styles.skeletonLabel}></div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={styles.dashboardWrap}>
            {/* Renderizamos dos secciones de esqueleto para simular la estructura de tu menú real */}
            {renderSkeletonGrid()}
            {renderSkeletonGrid()}
        </div>
    );
};

export default DashboardSkeleton;