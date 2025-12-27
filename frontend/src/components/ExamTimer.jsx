import { useEffect, useRef, useState } from "react";

const ExamTimer = ({ durationInMinutes, onTimeUp }) => {
  const totalDuration = durationInMinutes * 60 * 1000;

  // persist endTime across renders (critical!)
  const endTimeRef = useRef(Date.now() + totalDuration);

  const [timeLeft, setTimeLeft] = useState(
    endTimeRef.current - Date.now()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = endTimeRef.current - Date.now();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  const minutes = Math.floor(timeLeft / 1000 / 60)
    .toString()
    .padStart(2, "0");

  const seconds = Math.floor((timeLeft / 1000) % 60)
    .toString()
    .padStart(2, "0");

  return (
    <div className="text-3xl font-bold text-red-600">
      {minutes}:{seconds}
    </div>
  );
};

export default ExamTimer;
