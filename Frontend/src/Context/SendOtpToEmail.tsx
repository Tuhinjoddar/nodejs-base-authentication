import { sendEmailOtp } from "@/reduxThunkRTK/authUser";
import { useAppDispatch } from "@/reduxThunkRTK/Hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function SendOtpToEmail() {
  const userEmail =
    JSON.parse(localStorage.getItem("user") || "{}")?.email || null;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!userEmail) {
      toast.error("Email not found. Please log in first.");
      return;
    }
    console.log("Sending OTP to:", userEmail);

    // .unwrap()  -- send { "message": "OTP sent successfully!" }
    // .unwrap() --  ERROR: message is undefined
    try {
      const response = await dispatch(sendEmailOtp(userEmail)).unwrap();

      toast.success(response.message || "OTP sent successfully!", {
        description: "Check your email for the OTP.",
        duration: 2000,
      });
      console.log("a", response);
      if (response.success) {
        navigate("/email-verify");
      }
    } catch (error: any) {
      if (error === "Account already verified") {
        toast.info("Your account is already verified.");
      } else {
        toast.error(error || "Failed to verify OTP.");
      }
    }
  };

  return (
    <button onClick={handleSendOtp} className="cursor-pointer">
      Verify Email
    </button>
  );
}
