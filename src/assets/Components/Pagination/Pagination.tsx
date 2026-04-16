import React from 'react';
import styles from './Pagination.module.scss';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false
}) => {
    const handlePrev = () => {
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        onPageChange(page);
    };

    // Generar números de páginas visibles
    const getVisiblePages = () => {
        const pages: number[] = [];
        const maxVisible = 5; // Máximo de páginas visibles

        if (totalPages <= maxVisible) {
            // Si hay pocas páginas, mostrar todas
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Lógica para páginas con puntos suspensivos
            const start = Math.max(0, currentPage - 2);
            const end = Math.min(totalPages - 1, currentPage + 2);

            // Siempre mostrar la primera página
            if (start > 0) {
                pages.push(0);
                if (start > 1) {
                    pages.push(-1); // -1 representa "..."
                }
            }

            // Páginas centrales
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Siempre mostrar la última página
            if (end < totalPages - 1) {
                if (end < totalPages - 2) {
                    pages.push(-1); // -1 representa "..."
                }
                pages.push(totalPages - 1);
            }
        }

        return pages;
    };

    if (totalPages <= 0) {
        return null; // No mostrar si no hay páginas
    }

    return (
        <div className={styles.pagination}>
            <button
                className={`${styles.paginationButton} ${styles.prevNext}`}
                onClick={handlePrev}
                disabled={disabled || currentPage === 0}
                aria-label="Página anterior"
            >
                <span className={styles.buttonIcon}>←</span>
                <span className={styles.buttonText}>Anterior</span>
            </button>

            <div className={styles.pageNumbers}>
                {getVisiblePages().map((page, index) => (
                    page === -1 ? (
                        <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            className={`${styles.paginationButton} ${styles.pageNumber} ${page === currentPage ? styles.active : ''
                                }`}
                            onClick={() => handlePageClick(page)}
                            disabled={disabled}
                            aria-label={`Ir a página ${page + 1}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                        >
                            {page + 1}
                        </button>
                    )
                ))}
            </div>

            <button
                className={`${styles.paginationButton} ${styles.prevNext}`}
                onClick={handleNext}
                disabled={disabled || currentPage >= totalPages - 1}
                aria-label="Página siguiente"
            >
                <span className={styles.buttonText}>Siguiente</span>
                <span className={styles.buttonIcon}>→</span>
            </button>


        </div>
    );
};

export default Pagination;
