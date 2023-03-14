import { Link } from "@remix-run/react";

export default function DomainIndexPage() {
  return (
    <p>
      No domain selected. Select a domain on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new domain.
      </Link>
    </p>
  );
}
