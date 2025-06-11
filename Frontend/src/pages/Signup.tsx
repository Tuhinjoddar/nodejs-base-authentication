import { useForm } from "react-hook-form";
import { signupValidation } from "../validation/authValidation.tsx";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { EnvelopeIcon, UserIcon, PhoneIcon } from "@heroicons/react/24/solid"; // Import Heroicons
import { InputField } from "@/components/InputField.tsx";
import { SubmitButton } from "@/components/SubmitButton.tsx";
import { PasswordInput } from "@/components/PasswordInput.tsx";
import { Divider } from "@/components/Divider.tsx";
import { useAppDispatch, useAppSelector } from "@/reduxThunkRTK/Hooks.ts";
import { signupUser } from "@/reduxThunkRTK/authUser.ts";
import { clearMessages } from "@/reduxThunkRTK/AllSlices/SignupSlice.ts";
import { zodResolver } from "@hookform/resolvers/zod";

//FormData (User Input Data)
//Represents the data sent from the frontend to the backend.
// using TypeScript
type FormData = {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agree?: boolean;
};

export default function Signup() {
  const dispatch = useAppDispatch();

  const { loading, successMessage, errorMessage } = useAppSelector(
    (state) => state.signup
  );

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signupValidation),
  });

  const onSubmit = (formData: FormData) => {
    dispatch(signupUser(formData));
  };

  // Reset only when signup is successful
  useEffect(() => {
    if (successMessage) {
      reset(); // ✅ Reset form only on success
    }

    if (successMessage || errorMessage) {
      setTimeout(() => {
        dispatch(clearMessages());
      }, 2000);
    }
  }, [successMessage, errorMessage, dispatch, reset]);

  // ✅ Navigate to "/" 5 seconds after successful login/signup
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken || successMessage) {
      const navigateTimer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(navigateTimer); // Cleanup if component unmounts
    }
  }, [successMessage, navigate]);

  return (
    <div className="flex justify-center items-center m-6 ">
      <div className=" p-8 rounded-xl shadow-lg w-96 bg-[#01295a]">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Sign Up
        </h2>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 border border-green-500 rounded text-center">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-2 bg-red-100 text-red-800 border border-red-500 rounded text-center">
            {errorMessage}
          </div>
        )}

        {/* handleSubmit(onSubmit) first validates the form.
          If validation passes, it calls onSubmit(formData).
          If validation fails, it prevents submission and updates errors.
          The onSubmit in <form> is the HTML event, which is handled by handleSubmit(onSubmit). */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate // prevent browser validation, add noValidate to the <form>
        >
          {/* UserName Input */}
          <InputField
            type="text"
            placeholder="Username"
            register={register("username", {
              required: "Username is required",
            })}
            error={errors.username}
            icon={<UserIcon />}
          />

          {/* Email Input */}
          <InputField
            type="email"
            placeholder="Email"
            register={register("email", { required: "Email is required" })}
            error={errors.email}
            icon={<EnvelopeIcon />}
          />

          {/* Phone Number Input */}
          <InputField
            type="text"
            placeholder="Phone Number"
            register={register("phoneNumber", {
              required: "Phone number is required",
            })}
            error={errors.phoneNumber}
            icon={<PhoneIcon />}
          />

          {/* Password Input */}
          <PasswordInput
            placeholder="Password"
            register={register("password", {
              required: "Password is required",
            })}
            error={errors.password}
          />

          {/* Confirm Password Input */}
          <PasswordInput
            placeholder="Confirm Password"
            register={register("confirmPassword", {
              required: "Confirm Password is required",
            })}
            error={errors.confirmPassword}
          />

          {/* Terms & Conditions Checkbox */}
          <div className="relative">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("agree", {
                  required: "You must accept the Terms & Conditions",
                })}
                className="w-4 h-4 bg-gray-200"
              />
              <label className="text-sm text-white">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-500 hover:underline">
                  Terms & Conditions
                </Link>
              </label>
            </div>
            {errors.agree?.message && (
              <p className="text-red-700 text-sm px-4 mt-1">
                {errors.agree.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <SubmitButton
            loading={loading}
            text="Sign Up"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          />
        </form>

        {/* Links for Login */}
        <div className="mt-4 flex  justify-center text-center space-x-2">
          <p className="text-sm text-white ">Already a member?</p>
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>

        {/* Basic Horizontal Line */}
        <Divider />
      </div>
    </div>
  );
}
