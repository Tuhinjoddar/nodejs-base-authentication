import { Divider } from "@/components/Divider";
import { InputField } from "@/components/InputField";
import { PasswordInput } from "@/components/PasswordInput";
import { SubmitButton } from "@/components/SubmitButton";
import { clearMessages } from "@/reduxThunkRTK/AllSlices/LoginSlice";
import { loginUser } from "@/reduxThunkRTK/authUser";
import { useAppDispatch, useAppSelector } from "@/reduxThunkRTK/Hooks";
import { loginValidation } from "@/validation/authValidation";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// ✅ Define form data type
interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const dispatch = useAppDispatch();

  const { loading, successMessage, errorMessage } = useAppSelector(
    (state) => state.login
  );
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginValidation), // ✅ Apply Zod validation
  });

  const onSubmit = (formData: LoginFormData) => {
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (successMessage) {
      reset();
    }

    if (successMessage || errorMessage) {
      const timer = setTimeout(() => dispatch(clearMessages()), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage, dispatch, reset]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (successMessage || storedToken) {
      setTimeout(() => navigate("/"), 3000);
    }
  }, [successMessage, navigate]);

  return (
    <div className="flex justify-center items-center h-[38rem] ">
      <div className="bg-[#01295a] p-8 rounded-xl shadow-lg w-96 ">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Login
        </h2>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 border border-green-500 rounded text-center">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-500 rounded text-center">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 "
          noValidate // prevent browser validation, add noValidate to the <form>
        >
          {/* Email Input */}
          <InputField
            type="email"
            placeholder="Email"
            register={register("email", { required: "Email is required" })}
            error={errors.email}
            icon={<EnvelopeIcon />}
          />

          {/* Password Input */}

          <PasswordInput
            placeholder="Password"
            register={register("password", {
              required: "Password is required",
            })}
            error={errors.password}
          />

          <p
            onClick={() => navigate("/reset-password")}
            className="text-blue-500 hover:underline pl-5 cursor-pointer"
          >
            Forgot password?
          </p>

          {/* Submit Button */}
          <SubmitButton
            loading={loading}
            text="Login"
            className="w-full bg-blue-500 text-white p-2 rounded-[60%] hover:bg-blue-600 disabled:opacity-50"
          />

          {/* Link to Signup */}
          <div className="mt-2 relative ml-15 flex items-center space-x-2">
            <p className="text-white text-sm">Don't have an account?</p>
            <Link
              to="/signup"
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        </form>
        <Divider />
      </div>
    </div>
  );
}
