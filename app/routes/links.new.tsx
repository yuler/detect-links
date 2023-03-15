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
  const notifyEmail = formData.get("notifyEmail") as string;
  const notifyWecomToken = formData.get("notifyWecomToken") as string;
  const notifyWecomMobile = formData.get("notifyWecomMobile") as string;
  const notifyWebhook = formData.get("notifyWebhook") as string;

  if (typeof url !== "string" || url.length === 0) {
    return json({ error: "url is required" }, { status: 400 });
  }

  if (!url.startsWith("https://")) {
    return json({ error: "url must starts with https://" }, { status: 400 });
  }

  if (typeof remarks !== "string" || remarks.length === 0) {
    return json({ error: "remarks is required" }, { status: 400 });
  }

  if (notifyEmail && !notifyEmail.endsWith("@Wecom.com")) {
    return json(
      { error: "notifyEmail is must end with @col.com" },
      { status: 400 }
    );
  }

  // notifyWecomToken
  if (notifyWecomMobile && notifyWecomMobile.length !== 11) {
    return json(
      { error: "notifyWecomMobile is must length 11" },
      { status: 400 }
    );
  }

  if (notifyWebhook && !notifyWebhook.startsWith("https://")) {
    return json(
      {
        error: "notifyWebhook must starts with https://",
      },
      { status: 400 }
    );
  }

  const link = await createLink({ userId, url, remarks, notifyEmail, notifyWecomToken, notifyWecomMobile, notifyWebhook });

  return redirect(`/links/${link.id}`);
}

export default function New() {
  const actionData = useActionData<typeof action>();
  const urlRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.error) {
      urlRef.current?.focus();
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
          <span>URL: </span>
          <input
            ref={urlRef}
            name="url"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
        
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>remarks: </span>
          <textarea
            name="remarks"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
          />
        </label>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>notifyEmail: </span>
          <input
            name="notifyEmail"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>notifyWecomToken: </span>
          <input
            name="notifyWecomToken"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
        <label className="flex w-full flex-col gap-1">
          <span>notifyWecomMobile: </span>
          <input
            name="notifyWecomMobile"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>notifyWebhook: </span>
          <input
            name="notifyWebhook"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>

      {actionData?.error && (
        <div className="pt-1 text-red-700" id="url-error">
          {actionData.error}
        </div>
      )}

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
