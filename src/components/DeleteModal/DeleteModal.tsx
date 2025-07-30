import type { MediaItem } from '../../types';

interface DeleteModalProps {
  item: MediaItem;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ item, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
            Delete {item.type === 'movie' ? 'Movie' : 'TV Show'}
          </h3>
          
          <p className="text-sm text-center text-gray-500 mb-6">
            Are you sure you want to delete "{item.title}"? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 
                text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white 
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center px-4 py-2 border border-transparent 
                text-sm font-medium rounded-md shadow-sm text-white bg-red-600 
                hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-red-500 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 