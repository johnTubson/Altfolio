interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: string;
  step?: string;
  options?: readonly string[];
  className?: string;
}

export const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
  min,
  max,
  step,
  options,
  className = "",
}: FormFieldProps) => {
  return (
    <div className={className}>
      <label className="block mb-2 text-gray-700 font-medium">
        {label} {required && "*"}
      </label>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      )}
      {error && (
        <span className="block text-red-500 text-sm mt-1">{error}</span>
      )}
    </div>
  );
};
