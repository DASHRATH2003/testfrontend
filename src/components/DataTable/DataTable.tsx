import { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { MediaItem, ColumnValue } from '../../types';

interface Column {
  header: string;
  accessor: keyof MediaItem;
  render?: (value: ColumnValue, item: MediaItem) => string;
}

interface DataTableProps {
  data: MediaItem[];
  columns: Column[];
  onEdit: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
  hasMore: boolean;
  loadMore: () => void;
}

export function DataTable({
  data,
  columns,
  onEdit,
  onDelete,
  hasMore,
  loadMore,
}: DataTableProps) {
  const formatValue = useCallback((column: Column, item: MediaItem) => {
    const value = item[column.accessor];
    if (column.render) {
      return column.render(value as ColumnValue, item);
    }
    return String(value ?? '');
  }, []);

  const renderMobileCard = (item: MediaItem) => (
    <div className="bg-white p-4 border-b border-gray-200 last:border-b-0">
      {columns.map((column) => (
        <div key={column.accessor} className="mb-2 last:mb-0">
          <span className="text-sm font-medium text-gray-500">{column.header}: </span>
          <span className="text-sm text-gray-900">{formatValue(column, item)}</span>
        </div>
      ))}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onEdit(item)}
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item)}
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );

  const renderDesktopTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column.accessor}
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
            >
              {column.header}
            </th>
          ))}
          <th scope="col" className="relative px-6 py-3">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item, index) => (
          <tr
            key={item.id}
            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            style={{ transition: 'all 0.2s' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
  
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9fafb';
            }}
          >
            {columns.map((column) => (
              <td
                key={`${item.id}-${column.accessor}`}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                {formatValue(column, item)}
              </td>
            ))}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                onClick={() => onEdit(item)}
                className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item)}
                className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition-colors duration-200"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="bg-white shadow overflow-hidden">
      <InfiniteScroll
        dataLength={data.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="text-center py-4 text-gray-500">
            Loading more items...
          </div>
        }
        endMessage={
          <div className="text-center py-4 text-gray-500">
            {data.length === 0 ? "No items found" : "No more items to load"}
          </div>
        }
      >
        <div className="hidden sm:block">
          {renderDesktopTable()}
        </div>
        <div className="sm:hidden">
          {data.map((item) => renderMobileCard(item))}
        </div>
      </InfiniteScroll>
    </div>
  );
} 