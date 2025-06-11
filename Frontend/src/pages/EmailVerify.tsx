import { SubmitButton } from "@/components/SubmitButton";
import { useAppDispatch, useAppSelector } from "@/reduxThunkRTK/Hooks";
import { otpSchema } from "@/validation/authValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { verifyUserEmail } from "@/reduxThunkRTK/authUser";
import { useNavigate } from "react-router-dom";
import { OTPCountdown } from "@/Context/OTPCountdown";
import { OtpInput } from "@/components/OtpInput";
import { useState } from "react";

interface FormData {
  otp: string;
}

export default function EmailVerify() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const verifyOtpExpireAt = useAppSelector(
    (state) => state.sendOtpToEmail.user?.verifyOtpExpireAt
  );
  const { loading } = useAppSelector((state) => state.emailverify);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  console.log(verifyOtpExpireAt);
  const [stopCountdown, setStopCountdown] = useState(false); // ✅ Manage countdown state

  let id = user?.id;

  const {
    control,
    handleSubmit,
    setValue, // setValue("otp", 345564)
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (formData: FormData) => {
    if (!id || !token) {
      toast.error("User ID or token missing. Please login again.");
      return;
    }
    let otp = formData.otp;
    try {
      const response = await dispatch(
        verifyUserEmail({ id, otp, token })
      ).unwrap();
      console.log("aaaaaaa email successfull", response);
      toast.success(response?.message || "OTP verified successfully!", {
        duration: 5000,
      });
      setStopCountdown(true); // Stop the countdown when OTP is verified
      reset();
      if (response.success) {
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error || "Failed to send OTP.");
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh] p-4">
      <div className="p-8 rounded-xl shadow-lg max-w-sm w-full bg-[#01295a]">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Email Verification
            <hr className="border-t-2 border-gray-400 mt-2" />
          </h2>
          <p className="text-white text-left  text-lg ">
            Enter the 6-digit code sent to your email:{" "}
            <span className="text-green-500">{user?.email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="otp"
            control={control}
            defaultValue=""
            render={({ field: { onChange } }) => (
              <OtpInput onChange={onChange} setValue={setValue} /> // ✅ Correct typing
            )}
          />

          {errors.otp && (
            <p className="text-red-500 mt-2 text-sm  text-left">
              {errors.otp.message}
            </p>
          )}

          {verifyOtpExpireAt && !stopCountdown ? (
            <OTPCountdown
              expireAt={verifyOtpExpireAt}
              stopCountdown={stopCountdown}
            />
          ) : null}
          <SubmitButton
            loading={loading}
            text="Verify OTP"
            className="w-full bg-gray-600 mt-4 text-white text-lg sm:text-2xl p-2 rounded-xl cursor-pointer hover:bg-gray-700 disabled:opacity-50"
          />
        </form>
      </div>
    </div>
  );
}
