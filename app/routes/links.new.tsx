import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import { createLink } from "~/models/link.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const url = formData.get("url");
  const remarks = formData.get("remarks");

  if (typeof url !== "string" || url.length === 0) {
    return json(
      { errors: { url: "url is required", remarks: null } },
      { status: 400 }
    );
  }

  // Must starts with https:// or http://
  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    return json(
      {
        errors: {
          url: "url must starts with https:// or http://",
          remarks: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof remarks !== "string" || remarks.length === 0) {
    return json(
      { errors: { url: null, remarks: "remarks is required" } },
      { status: 400 }
    );
  }

  const link = await createLink({ url, remarks, userId });

  return redirect(`/links/${link.id}`);
}

export default function New() {
  const actionData = useActionData<typeof action>();
  const urlRef = React.useRef<HTMLInputElement>(null);
  const remarksRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.url) {
      urlRef.current?.focus();
    } else if (actionData?.errors?.remarks) {
      remarksRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>url: </span>
          <input
            ref={urlRef}
            name="url"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.url ? true : undefined}
            aria-errormessage={
              actionData?.errors?.url ? "url-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.url && (
          <div className="pt-1 text-red-700" id="url-error">
            {actionData.errors.url}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>remarks: </span>
          <textarea
            ref={remarksRef}
            name="remarks"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.remarks ? true : undefined}
            aria-errormessage={
              actionData?.errors?.remarks ? "remarks-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.remarks && (
          <div className="pt-1 text-red-700" id="remarks-error">
            {actionData.errors.remarks}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
