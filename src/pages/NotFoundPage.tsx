import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function NotFoundPage() {
  const err = useRouteError();

  let title = "Oops!";
  let message = "Page not found or an error occurred.";

  if (isRouteErrorResponse(err)) {
    title = `${err.status} - ${err.statusText}`;
    message =
      typeof err.data === "string" ? err.data : err.data?.message ?? message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  return (
    <section>
      <h1>{title}</h1>
      <p>{message}</p>
      <p>
        <Link to="/">← Back home</Link>
      </p>
    </section>
  );
}
