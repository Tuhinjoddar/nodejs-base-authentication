import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError() as { status?: number; message?: string }; // Type assertion

  console.log(error?.status);

  return (
    <div>
      <h1>Error {error?.status}</h1>
      <p>{error?.message || "Something went wrong!"}</p>
    </div>
  );
}
