import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router';

export const Pagination = ({
  className,
  itemName,
  defaultPage = 1,
  defaultItemsPerPage = 10,
  totalPages,
  pagesToShow = 5,
  totalItems,
  startItem,
  endItem,
  onChange,
  itemsPerPageOptions = [10, 20, 50, 100, 500]
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('p') || defaultPage, 10);
  const itemsPerPage = parseInt(searchParams.get('i') || defaultItemsPerPage, 10);

  const updateUrlParams = (newPage, newItemsPerPage) => {
    setSearchParams((prevParams) => {
      prevParams.set('p', newPage);
      prevParams.set('i', newItemsPerPage);
      return prevParams;
    }, { replace: true });
  };

  const handlePageChange = (newPage) => {
    updateUrlParams(newPage, itemsPerPage);
    onChange?.(newPage, itemsPerPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    updateUrlParams(1, newItemsPerPage);
    onChange?.(1, newItemsPerPage);
  };

  useEffect(() => {
    if (!searchParams.has('p') || !searchParams.has('i')) {
      updateUrlParams(defaultPage, defaultItemsPerPage);
    }
  }, []);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border rounded px-2 py-1 bg-white"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          </div>
          <div className="text-sm text-gray-600">
            <span>Displaying </span>
            <span className="font-semibold">{startItem} to {endItem} </span>
            <span>of </span>
            <span className="font-semibold">{totalItems} </span>
            <span>{itemName}</span>
          </div>
        </div>
        <div className="flex justify-center items-center gap-2">
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:text-gray-700'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
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
              pages.push(
                <button
                  key={i}
                  className={`px-4 py-2 rounded transition-colors ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i}
                </button>
              );
            }

            return pages;
          })()}
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:text-gray-700'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

