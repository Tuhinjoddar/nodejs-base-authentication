import { useState } from "react";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface PasswordInputProps {
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

export function PasswordInput({
  placeholder,
  register,
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        {...register}
        className="w-full p-2 border pl-5  border-gray-300 rounded-full  pr-10  bg-gray-500  text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-3 text-gray-500"
      >
        {showPassword ? (
          <EyeSlashIcon className="w-5 h-5 text-white" /> // Hide icon
        ) : (
          <EyeIcon className="w-5 h-5 text-white" /> // Show icon
        )}
      </button>
      {error && (
        <p className="text-red-700 text-sm px-4 mt-1">{error.message}</p>
      )}
    </div>
  );
}
