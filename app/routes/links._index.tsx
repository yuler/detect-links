import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <p>
      No link selected. Select a link on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new link.
      </Link>
    </p>
  );
}
