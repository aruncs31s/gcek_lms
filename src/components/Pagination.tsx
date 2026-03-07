import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    showPageSizeOptions?: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    pageSize = 12,
    onPageSizeChange,
    pageSizeOptions = [6, 12, 24, 48],
    showPageSizeOptions = true,
}: PaginationProps) {
    // if (totalPages <= 1) return null;
    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 7;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages.map((page, index) => {
            if (page === '...') {
                return (
                    <span key={`ellipsis-${index}`} style={{ padding: '0.6rem 0.5rem', color: 'var(--text-secondary)' }}>
                        ...
                    </span>
                );
            }
            return (
                <button
                    key={`page-${page}`}
                    onClick={() => onPageChange(page as number)}
                    className={page === currentPage ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ padding: '0.6rem 1rem', minWidth: '45px', fontWeight: 600 }}
                >
                    {page}
                </button>
            );
        });
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '3rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                {showPageSizeOptions && onPageSizeChange ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Show:</span>
                        <select
                            className="form-input"
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                            style={{ width: 'auto', padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                        >
                            {pageSizeOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>per page</span>
                    </div>
                ) : (
                    <div></div> /* Empty div to keep space-between working correctly if only page size options is missing */
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-secondary"
                        style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        <ChevronLeftIcon style={{ width: '1.25rem' }} /> Previous
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {renderPageNumbers()}
                    </div>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-secondary"
                        style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                        Next <ChevronRightIcon style={{ width: '1.25rem' }} />
                    </button>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                    Page {currentPage} of {totalPages}
                </div>
            </div>
        </div>
    );
}
