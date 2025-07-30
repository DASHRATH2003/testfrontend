import { useState } from 'react';
import { z } from 'zod';
import type { TVShowFormData } from '../../types';

const tvShowSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.literal('tvshow').default('tvshow'),
  director: z.string().min(1, 'Director is required'),
  budget: z.number().min(0, 'Budget must be positive'),
  location: z.string().min(1, 'Location is required'),
  duration: z.number().int().min(1, 'Duration must be positive'),
  startYear: z.number().int().min(1900, 'Start year must be after 1900'),
  endYear: z.number().int().min(1900, 'End year must be after 1900').optional(),
  poster: z.string().optional(),
});

interface Props {
  initialData?: Partial<TVShowFormData & { id: string }>;
  onSubmit: (data: TVShowFormData) => void;
  onCancel: () => void;
}

export default function TVShowForm({ initialData, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<Partial<TVShowFormData>>({
    type: 'tvshow',
    title: '',
    director: '',
    budget: 0,
    location: '',
    duration: 0,
    startYear: new Date().getFullYear(),
    endYear: undefined,
    poster: '',
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: keyof TVShowFormData, value: any) => {
    try {
      tvShowSchema.shape[name].parse(value);
      setErrors(prev => ({ ...prev, [name]: [] }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.issues.map(issue => issue.message);
        setErrors(prev => ({
          ...prev,
          [name]: fieldErrors,
        }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (touched[name]) {
      validateField(name as keyof TVShowFormData, newValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name as keyof TVShowFormData, newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = tvShowSchema.parse(formData);
      onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string[]> = {};
        error.issues.forEach(issue => {
          const path = issue.path[0] as string;
          if (!newErrors[path]) {
            newErrors[path] = [];
          }
          newErrors[path].push(issue.message);
        });
        setErrors(newErrors);
        // Mark all fields as touched
        const allTouched: Record<string, boolean> = {};
        Object.keys(formData).forEach(key => {
          allTouched[key] = true;
        });
        setTouched(allTouched);
      }
    }
  };

  const renderField = (
    field: keyof TVShowFormData,
    label: string,
    type: string = 'text',
    placeholder: string = ''
  ) => {
    const showError = touched[field] && errors[field]?.length > 0;

    return (
      <div className="mb-4">
        <label
          htmlFor={field}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <input
          id={field}
          name={field}
          type={type}
          value={formData[field] || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
            focus:outline-none focus:ring-1 sm:text-sm ${
              showError
                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
        />
        {showError && (
          <p className="mt-1 text-xs text-red-600">{errors[field].join(', ')}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {renderField('title', 'Title', 'text', 'Enter TV show title')}
        {renderField('director', 'Director', 'text', 'Enter director name')}
        {renderField('budget', 'Budget', 'number', 'Enter budget per episode')}
        {renderField('location', 'Location', 'text', 'Enter filming location')}
        {renderField('duration', 'Duration', 'number', 'Enter duration per episode')}
        {renderField('startYear', 'Start Year', 'number', 'Enter start year')}
        {renderField('endYear', 'End Year', 'number', 'Enter end year (optional)')}
        {renderField('poster', 'Poster URL', 'text', 'Enter poster image URL (optional)')}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData?.id ? 'Update TV Show' : 'Add TV Show'}
        </button>
      </div>
    </form>
  );
} 