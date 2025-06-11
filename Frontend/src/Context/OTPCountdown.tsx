import { useState, useEffect } from "react";

interface OTPCountdownProps {
  expireAt: string;
  stopCountdown: boolean;
}

export const OTPCountdown: React.FC<OTPCountdownProps> = ({
  expireAt,
  stopCountdown,
}) => {
  const calculateTimeLeft = () => {
    const expireTime = new Date(expireAt).getTime();
    const currentTime = Date.now();
    const difference = Math.floor((expireTime - currentTime) / 1000);
    return difference > 0 ? difference : 0;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft()); // Reset timeLeft when expireAt changes
  }, [expireAt]);

  useEffect(() => {
    if (timeLeft <= 0 || stopCountdown) {
      console.log("Timer stopped due to expiration or submit button clicked.");
      return;
    }

    //console.log("⏳ Timer started...");

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      clearInterval(timer);
      //console.log("Timer cleared due to component unmount or state change.");
    };
  }, [timeLeft, stopCountdown]); // Now updates dynamically every second

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };
  return (
    <div className="text-white text-left  py-2 ">
      {timeLeft > 0 ? (
        <p>
          OTP expires in:
          <span className="text-green-600 font-bold ml-2 text-lg">
            {formatTime(timeLeft)}
          </span>
        </p>
      ) : (
        <p className="text-red-500 font-bold text-lg">OTP has expired.</p>
      )}
    </div>
  );
};
