import { useRef } from "react";
import { UseFormSetValue } from "react-hook-form";

interface OTPInputProps {
  onChange: (otp: string) => void;
  setValue: UseFormSetValue<{ otp: string }>;
}

export const OtpInput: React.FC<OTPInputProps> = ({ onChange, setValue }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]); // Correctly store references

  // Handle OTP input change
  const handleInput = (index: number, value: string) => {
    // if (!/^[a-zA-Z0-9@#$%^&*!]?$/.test(value)) return; // Allow letters, numbers, and special characters
    //if (!/^[a-zA-Z0-9]?$/.test(value)) return; // Allow letters (A-Z, a-z) and numbers (0-9)
    if (!/^\d?$/.test(value)) return; // Allow only single digit

    const otpArray = inputRefs.current.map((input) => input?.value || "");
    otpArray[index] = value; //  ['6', '5', '4', '6', '6', '']
    console.log("otpArray", otpArray);

    if (value && index < 5) inputRefs.current[index + 1]?.focus(); // move to next input

    const otpValue = otpArray.join(""); // 868656
    console.log("otpValue", otpValue);

    if (otpValue.length === 6) setValue("otp", otpValue);

    console.log("onChange", onChange(otpValue));
  };

  // Moves focus backward
  const handleBackspace = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Backspace" &&
      index > 0 &&
      !inputRefs.current[index]?.value
    ) {
      inputRefs.current[index - 1]!.value = "";
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ClipboardEvent is an event in React (and JavaScript) that handles actions related to copying, cutting, and pasting data.
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    console.log("object", event.clipboardData);
    const pastedData = event.clipboardData.getData("text").trim();
    console.log("pastedData", pastedData);
    if (/^\d{6}$/.test(pastedData)) {
      pastedData.split("").forEach((char, i) => {
        if (inputRefs.current[i]) inputRefs.current[i]!.value = char;
      });
      setValue("otp", pastedData);
      onChange(pastedData);
    }
  };
  return (
    <div className="flex gap-2 justify-center ">
      {Array.from({ length: 6 }, (_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          ref={(element) => {
            if (element) {
              inputRefs.current[index] = element;
            }
          }}
          // event handlers
          //Handle OTP Input Change or Moves focus to the next input box automatically.
          onChange={(e) => handleInput(index, e.target.value)}
          //Purpose: Deletes the value in the current input field and moves focus to the previous input box when backspace is pressed.
          onKeyDown={(e) => handleBackspace(index, e)}
          //Purpose: Allows users to paste a 6-digit OTP all at once.
          onPaste={(e) => handlePaste(e)}
          className="w-10 sm:w-12 h-12 text-center bg-white  text-2xl border rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        />
      ))}
    </div>
  );
};
