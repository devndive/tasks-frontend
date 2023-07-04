import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { getTaskById, updateTask } from "~/utils/api.server";
import { badRequest } from "~/utils/request.server";
import { validateName } from "~/utils/validation";

export const loader = async ({ params }: LoaderArgs) => {
  const taskId = params.taskId;

  const task = await getTaskById(taskId);

  return json({ data: task });
}

export const action = async ({ params, request }: ActionArgs) => {
  const taskId = params.taskId;

  const form = await request.formData();
  const name = form.get("name");
  const dueDate = form.get("dueDate");
  const assignedTo = form.get("assignedTo");

  if (
    typeof name !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly",
    });
  }

  const fieldErrors = {
    name: validateName(name)
  };

  const fields = { name, dueDate, assignedTo };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields, formError: null });
  }

  await updateTask(taskId, name, assignedTo, dueDate);

  return redirect("/");
}

export default function Edit() {
  const data = useLoaderData<typeof loader>();
  let actionData = useActionData<typeof action>();

  const pickedDate = actionData === undefined ? data.data.dueDate : actionData?.fields?.dueDate

  const date = new Date(pickedDate);
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
  const formattedDueDate = `${day}.${month}.${year}`;

  if (actionData === undefined) {
    actionData = {
      fields: {
        name: data.data.name,
        dueDate: formattedDueDate,
        assignedTo: data.data.assignedTo
      }
    }
  } else {
    actionData.fields.dueDate = formattedDueDate;
  }

  return (
    <form method="post">
      <h1>Edit task</h1>
      <h2>Task</h2>
      <label>
        Name:{" "}
        <input
          type="text"
          name="name"
          defaultValue={actionData?.fields?.name}
          aria-invalid={Boolean(actionData?.fieldErrors?.name)}
          aria-errormessage={actionData?.fieldErrors?.name ? "name-error" : undefined}
        />
      </label>
      {actionData?.fieldErrors?.name ? (
        <p id="name-error" role="alert">
          {actionData.fieldErrors.name}
        </p>
      ) : null}

      <label>
        Due date:{" "}
        <input
          type="text"
          name="dueDate"
          defaultValue={actionData?.fields?.dueDate}
          aria-invalid={Boolean(actionData?.fieldErrors?.dueDate)}
          aria-errormessage={actionData?.fieldErrors?.dueDate ? "dueDate-error" : undefined}
        />
      </label>
      {actionData?.fieldErrors?.dueDate ? (
        <p id="dueDate-error" role="alert">
          {actionData.fieldErrors.dueDate}
        </p>
      ) : null}

      <label>
        Assignee:{" "}
        <input
          type="text"
          name="assignedTo"
          defaultValue={actionData?.fields?.assignedTo}
          aria-invalid={Boolean(actionData?.fieldErrors?.assignedTo)}
          aria-errormessage={actionData?.fieldErrors?.assignedTo ? "assignedTo-error" : undefined}
        />
      </label>
      {actionData?.fieldErrors?.assignedTo ? (
        <p id="assignedTo" role="alert">
          {actionData.fieldErrors.assignedTo}
        </p>
      ) : null}

      <button type="submit">Update</button>
    </form>
  );
}
