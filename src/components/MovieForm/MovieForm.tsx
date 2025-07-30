import { useState } from 'react';
import { z } from 'zod';

const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  director: z.string().min(1, "Director is required"),
  budget: z.number().min(0, "Budget must be positive"),
  location: z.string().min(1, "Location is required"),
  duration: z.number().min(1, "Duration must be positive"),
  year: z.number().min(1900).max(new Date().getFullYear()),
  poster: z.string().optional(),
});

type MovieFormData = z.infer<typeof movieSchema>;

interface MovieFormProps {
  onSubmit: (data: MovieFormData) => void;
  initialData?: MovieFormData;
  isEditing?: boolean;
}

export function MovieForm({ onSubmit, initialData, isEditing = false }: MovieFormProps) {
  const [formData, setFormData] = useState<MovieFormData>(initialData || {
    title: '',
    director: '',
    budget: 0,
    location: '',
    duration: 0,
    year: new Date().getFullYear(),
    poster: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MovieFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof MovieFormData, boolean>>>({});

  const validateField = (field: keyof MovieFormData, value: any) => {
    try {
      const schema = movieSchema.shape[field];
      schema.parse(value);
      setErrors(prev => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0].message }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = movieSchema.parse(formData);
      onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof MovieFormData, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof MovieFormData] = err.message;
          }
        });
        setErrors(newErrors);
        // Mark all fields as touched when form is submitted with errors
        const allTouched: Partial<Record<keyof MovieFormData, boolean>> = {};
        Object.keys(formData).forEach(key => {
          allTouched[key as keyof MovieFormData] = true;
        });
        setTouched(allTouched);
      }
    }
  };

  const handleBlur = (field: keyof MovieFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const renderField = (
    field: keyof MovieFormData,
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
          value={formData[field]}
          onChange={(e) => {
            const value = type === 'number' ? parseFloat(e.target.value) : e.target.value;
            setFormData(prev => ({ ...prev, [field]: value }));
            if (touched[field]) {
              validateField(field, value);
            }
          }}
          onBlur={() => handleBlur(field)}
          placeholder={placeholder}
          className={`block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-400
            border rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2
            ${showError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            } transition-colors duration-200`}
        />
        {showError && (
          <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title field - full width */}
        <div className="md:col-span-2">
          {renderField('title', 'Title', 'text', 'Enter movie title')}
        </div>

        {/* Director field */}
        <div>
          {renderField('director', 'Director', 'text', 'Enter director name')}
        </div>

        {/* Budget field */}
        <div>
          {renderField('budget', 'Budget ($)', 'number', 'Enter budget amount')}
        </div>

        {/* Location field */}
        <div>
          {renderField('location', 'Location', 'text', 'Enter filming location')}
        </div>

        {/* Duration field */}
        <div>
          {renderField('duration', 'Duration (minutes)', 'number', 'Enter duration')}
        </div>

        {/* Year field */}
        <div>
          {renderField('year', 'Year', 'number', 'Enter release year')}
        </div>

        {/* Poster URL field - full width */}
        <div className="md:col-span-2">
          {renderField('poster', 'Poster URL (optional)', 'text', 'Enter poster image URL')}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent 
            text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-indigo-500 transition-colors duration-200"
        >
          {isEditing ? (
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
              Update Movie
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
              Add Movie
            </>
          )}
        </button>
      </div>
    </form>
  );
} 