import { ActionArgs, json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { deleteTask, getTaskById, markTaskCompleted } from "~/utils/api.server";

export const loader = async ({ params, request }: LoaderFunction) => {
  const taskId = params.taskId;

  const task = await getTaskById(taskId);

  return json({
    data: {
      ...task
    }
  });
}

export const action = async() => {
  console.log("tasks.$taskId._index.tsx::action");
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const date = new Date(data.data.dueDate);
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

  const formattedDueDate = `${year}-${month}-${day}`;
  console.log("Task::Index", formattedDueDate);

  return (
    <>
      <h1>Task details</h1>
      <h2>Task</h2>
      <label>
        Name:{" "}
        <input
          type="text"
          name="name"
          defaultValue={data.data.name}
          readOnly
        />
      </label>

      <label>
        Due date:{" "}
        <input
          type="date"
          name="dueDate"
          defaultValue={formattedDueDate}
          readOnly
        />
      </label>

      <label>
        Assignee:{" "}
        <input
          type="text"
          name="assignedTo"
          defaultValue={data.data.assignedTo}
          readOnly
        />
      </label>
    </>
  );
}
