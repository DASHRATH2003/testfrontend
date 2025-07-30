import { useState, useEffect } from 'react';
import MovieForm from './components/MovieForm/MovieForm';
import TVShowForm from './components/TVShowForm/TVShowForm';
import { DataTable } from './components/DataTable/DataTable';
import { DeleteModal } from './components/DeleteModal/DeleteModal';
import { movieApi, tvShowApi } from './lib/api';
import type { Movie, TVShow, MediaItem, ColumnValue, MovieFormData, TVShowFormData } from './types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'movies' | 'tvshows'>('movies');
  const [data, setData] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const api = activeTab === 'movies' ? movieApi : tvShowApi;
      const response = await api.getAll(page, 10);
      
      if (page === 1) {
        setData(response.data.data);
      } else {
        setData(prev => [...prev, ...response.data.data]);
      }
      setHasMore(response.data.meta.hasMore);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setData([]);
    fetchData();
  }, [activeTab]); // Re-fetch when tab changes

  useEffect(() => {
    if (page > 1) {
      fetchData();
    }
  }, [page]); // Only fetch when page changes and is greater than 1

  const handleAddMovie = async (formData: MovieFormData) => {
    try {
      await movieApi.create(formData);
      setIsAddModalOpen(false);
      // Reset to first page and fetch data
      setPage(1);
      setData([]);
      fetchData();
    } catch (error) {
      console.error('Failed to add movie:', error);
    }
  };

  const handleEditMovie = async (id: string, formData: MovieFormData) => {
    try {
      await movieApi.update(id, formData);
      setIsEditModalOpen(false);
      setSelectedItem(null);
      // Reset to first page and fetch data
      setPage(1);
      setData([]);
      fetchData();
    } catch (error) {
      console.error('Failed to update movie:', error);
    }
  };

  const handleAddTVShow = async (formData: TVShowFormData) => {
    try {
      await tvShowApi.create(formData);
      setIsAddModalOpen(false);
      // Reset to first page and fetch data
      setPage(1);
      setData([]);
      fetchData();
    } catch (error) {
      console.error('Failed to add TV show:', error);
    }
  };

  const handleEditTVShow = async (id: string, formData: TVShowFormData) => {
    try {
      await tvShowApi.update(id, formData);
      setIsEditModalOpen(false);
      setSelectedItem(null);
      // Reset to first page and fetch data
      setPage(1);
      setData([]);
      fetchData();
    } catch (error) {
      console.error('Failed to update TV show:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const api = activeTab === 'movies' ? movieApi : tvShowApi;
      await api.delete(selectedItem!.id);
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
      // Reset to first page and fetch data
      setPage(1);
      setData([]);
      fetchData();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const movieColumns = [
    { header: 'Title', accessor: 'title' as keyof MediaItem },
    { header: 'Type', accessor: 'type' as keyof MediaItem },
    { header: 'Director', accessor: 'director' as keyof MediaItem },
    { 
      header: 'Budget', 
      accessor: 'budget' as keyof MediaItem,
      render: (value: ColumnValue) => value ? `$${Number(value).toLocaleString()}M` : '-'
    },
    { header: 'Location', accessor: 'location' as keyof MediaItem },
    { 
      header: 'Duration', 
      accessor: 'duration' as keyof MediaItem,
      render: (value: ColumnValue) => value ? `${value} min` : '-'
    },
    { 
      header: 'Year/Time', 
      accessor: 'year' as keyof MediaItem,
      render: (value: ColumnValue) => value ? value.toString() : '-'
    }
  ];

  const tvShowColumns = [
    { header: 'Title', accessor: 'title' as keyof MediaItem },
    { header: 'Type', accessor: 'type' as keyof MediaItem },
    { header: 'Director', accessor: 'director' as keyof MediaItem },
    { 
      header: 'Budget', 
      accessor: 'budget' as keyof MediaItem,
      render: (value: ColumnValue) => value ? `$${Number(value).toLocaleString()}M/ep` : '-'
    },
    { header: 'Location', accessor: 'location' as keyof MediaItem },
    { 
      header: 'Duration', 
      accessor: 'duration' as keyof MediaItem,
      render: (value: ColumnValue) => value ? `${value} min/ep` : '-'
    },
    { 
      header: 'Year/Time', 
      accessor: 'startYear' as keyof MediaItem,
      render: (value: ColumnValue, item: MediaItem) => {
        if ('endYear' in item && item.endYear) {
          return `${value}-${item.endYear}`;
        }
        return value ? value.toString() : '-';
      }
    }
  ];

  const columns = activeTab === 'movies' ? movieColumns : tvShowColumns;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-4 sm:py-10">
        <header className="px-4 mb-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900 mb-4">
              Movie & TV Show Manager
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex space-x-2">
                <button
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'movies'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                  onClick={() => setActiveTab('movies')}
                >
                  Movies
                </button>
                <button
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'tvshows'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                  onClick={() => setActiveTab('tvshows')}
                >
                  TV Shows
                </button>
              </div>
              <button
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                onClick={() => setIsAddModalOpen(true)}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New
              </button>
            </div>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <DataTable
                    data={data}
                    columns={activeTab === 'movies' ? movieColumns : tvShowColumns}
                    onEdit={(item) => {
                      setSelectedItem(item);
                      setIsEditModalOpen(true);
                    }}
                    onDelete={(item) => {
                      setSelectedItem(item);
                      setIsDeleteModalOpen(true);
                    }}
                    hasMore={hasMore}
                    loadMore={() => setPage((p) => p + 1)}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Overlays */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New {activeTab === 'movies' ? 'Movie' : 'TV Show'}
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              {activeTab === 'movies' ? (
                <MovieForm onSubmit={handleAddMovie} isEditing={false} />
              ) : (
                <TVShowForm onSubmit={handleAddTVShow} isEditing={false} />
              )}
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit {activeTab === 'movies' ? 'Movie' : 'TV Show'}
                </h2>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              {activeTab === 'movies' ? (
                <MovieForm
                  onSubmit={handleEditMovie}
                  initialData={selectedItem as Movie}
                  isEditing={true}
                />
              ) : (
                <TVShowForm
                  onSubmit={handleEditTVShow}
                  initialData={selectedItem as TVShow}
                  isEditing={true}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDelete}
        title={`Delete ${activeTab === 'movies' ? 'Movie' : 'TV Show'}`}
        itemName={selectedItem?.title || ''}
      />
    </div>
  );
}

export default App;