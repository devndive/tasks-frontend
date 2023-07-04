import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { ActionArgs, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { createNewTask } from "~/utils/api.server";
import { badRequest } from "~/utils/request.server";
import { validateName } from "~/utils/validation";

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ')
}

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

const colors = {
  default: 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600',
  error: 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500',
};

function NameInput({ actionData, fieldName, label }) {
  const hasFieldError = Boolean(actionData?.fieldErrors?.[fieldName]);
  const errorFieldId = `${fieldName}-error`;

  return (
    <div>
      <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type="text"
          name={fieldName}
          id={fieldName}
          className={classNames(colors[hasFieldError ? 'error' : 'default'], "block w-full rounded-md border-0 py-1.5 pr-10 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6")}
          aria-describedby={errorFieldId}

          defaultValue={actionData?.fields?.[fieldName]}
          aria-invalid={hasFieldError}
          aria-errormessage={hasFieldError ? errorFieldId : undefined}
        />
        {hasFieldError ? 
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        : null}
      </div>

      {actionData?.fieldErrors?.[fieldName] ? (
      <p className="mt-2 text-sm text-red-600" id={errorFieldId}>
          {actionData.fieldErrors[fieldName]}
      </p>
      ) : null}
    </div>
  )
}

export default function New() {
  const actionData = useActionData<typeof action>();

  return (
    <form method="post">
      <NameInput actionData={actionData} fieldName={"name"} label={"Name"} />
      <NameInput actionData={actionData} fieldName={"dueDate"} label={"Due date"} />
      <NameInput actionData={actionData} fieldName={"assignedTo"} label={"Assignee"} />

      <button type="submit" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-3">Create</button>
    </form>
  );
}
