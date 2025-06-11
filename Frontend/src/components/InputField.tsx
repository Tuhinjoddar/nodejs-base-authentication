import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { ReactNode } from "react";

interface InputFieldProps {
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  icon?: ReactNode;
}

export function InputField({
  type,
  placeholder,
  register,
  error,
  icon,
}: InputFieldProps) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className="w-full p-2 pr-10 border pl-5 border-gray-300 rounded-full  bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {/* icon &&: This ensures that the div is only rendered if icon exists (i.e., is not null or undefined). */}
      {icon && (
        <div className="absolute right-3 top-6 transform -translate-y-1/2 h-5 w-5 text-white">
          {icon}
        </div>
      )}
      {error && (
        <p className="text-red-700 text-sm px-4 mt-1">{error.message}</p>
      )}
    </div>
  );
}
