import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getDomain, deleteDomain } from "~/models/domain.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.id, "id not found");

  const domain = await getDomain({ userId, id: params.id });
  if (!domain) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ domain });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.id, "id not found");

  await deleteDomain({ userId, id: params.id });

  return redirect("/domains");
}

export default function Id() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.domain.url}</h3>
      <p className="py-6">{data.domain.remarks}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-red-500  py-2 px-4 text-white hover:bg-red-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Domain not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
