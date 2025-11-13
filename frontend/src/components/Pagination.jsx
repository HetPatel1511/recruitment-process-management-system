import React from 'react'

export const Pagination = ({
  currentPage,
  totalPages,
  pagesToShow = 5,
  onPageChange
}) => (
  <div className='flex justify-center items-center gap-2'>
    <button className='bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:text-gray-700' onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
    {(() => {
      const pages = [];
      const totalToShow = Math.min(pagesToShow, totalPages);

      let startPage = Math.max(1, currentPage - 2);
      let endPage = startPage + totalToShow - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - totalToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(<button
          key={i}
          className={`px-4 py-2 rounded transition-colors ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>);
      }

      return pages;
    })()}
    <button className='bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:text-gray-700' onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
  </div>
)
