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
  initialData?: Partial<TVShowFormData>;
  onSubmit: (data: TVShowFormData) => void;
  onCancel: () => void;
}

interface FormErrors {
  [key: string]: string[];
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

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: keyof TVShowFormData, value: any) => {
    try {
      tvShowSchema.shape[name].parse(value);
      setErrors(prev => ({ ...prev, [name]: [] }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [name]: error.errors.map(err => err.message),
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
        const newErrors: FormErrors = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0]] = [err.message];
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const renderField = (
    field: keyof TVShowFormData,
    label: string,
    type: 'text' | 'number' = 'text',
    placeholder: string = ''
  ) => {
    const showError = touched[field] && errors[field];
    
    return (
      <div className="relative">
        <label 
          htmlFor={field}
          className={`absolute -top-2 left-2 px-1 text-xs font-medium bg-white
            ${showError ? 'text-red-500' : 'text-gray-600'}`}
        >
          {label}
        </label>
        <input
          id={field}
          type={type}
          name={field}
          value={formData[field] || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-400
            border rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2
            ${showError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            } transition-colors duration-200`}
        />
        {showError && (
          <p className="mt-1 text-xs text-red-500">{errors[field]?.join(', ')}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title field - full width */}
        <div className="md:col-span-2">
          {renderField('title', 'Title', 'text', 'Enter TV show title')}
        </div>

        {/* Director field */}
        <div>
          {renderField('director', 'Director', 'text', 'Enter director name')}
        </div>

        {/* Budget field */}
        <div>
          {renderField('budget', 'Budget ($ per episode)', 'number', 'Enter budget amount')}
        </div>

        {/* Location field */}
        <div>
          {renderField('location', 'Location', 'text', 'Enter filming location')}
        </div>

        {/* Duration field */}
        <div>
          {renderField('duration', 'Duration (minutes per episode)', 'number', 'Enter duration')}
        </div>

        {/* Start Year field */}
        <div>
          {renderField('startYear', 'Start Year', 'number', 'Enter start year')}
        </div>

        {/* End Year field */}
        <div>
          {renderField('endYear', 'End Year (Optional)', 'number', 'Enter end year')}
        </div>

        {/* Poster URL field - full width */}
        <div className="md:col-span-2">
          {renderField('poster', 'Poster URL (optional)', 'text', 'Enter poster image URL')}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 
            text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-100 
            hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-gray-500 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent 
            text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-indigo-500 transition-colors duration-200"
        >
          {initialData?.id ? (
            <>
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Update TV Show
            </>
          ) : (
            <>
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add TV Show
            </>
          )}
        </button>
      </div>
    </form>
  );
} 