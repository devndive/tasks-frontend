import { ActionArgs, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { createNewTask } from "~/utils/api.server";
import { badRequest } from "~/utils/request.server";
import { validateName } from "~/utils/validation";

export const action = async ({ request }: ActionArgs) => {
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

  await createNewTask(name, assignedTo, dueDate);

  return redirect("/");
}

export default function New() {
  const actionData = useActionData<typeof action>();

  return (
    <form method="post">
      <h1>Create task</h1>
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

      <button type="submit">Create</button>
    </form>
  );
}
