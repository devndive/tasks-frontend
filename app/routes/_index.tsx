import type { V2_MetaFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { formatDistance, formatDistanceToNow } from "date-fns";
import { getTasks } from "~/utils/api.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Taskmanager" },
    { name: "description", content: "Manage your tasks" },
  ];
};

export const loader = async () => {
  const tasks = await getTasks();

  return json({ tasks });
}

export default function Index() {
  const { tasks } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <a href="/tasks/new">New task</a>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Assignee</th>
            <th>Due in</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.sort((a, b) => { return new Date(a.dueDate) - new Date(b.dueDate) }).map((t) =>
            <tr key={t.id}>
              <td>
              </td>
              <td>
                <a href={`/tasks/${t.id}/edit`} data-testid="task-name">
                  {t.isCompleted
                    ? <b>{t.name}</b>
                    : <>{t.name}</>
                  }
                </a>
              </td>
              <td>{t.assignedTo}</td>
              <td>{formatDistanceToNow(new Date(t.dueDate))}</td>
              <td>
                <form method="post" action={`tasks/${t.id}`}>
                  <button name="intent" type="submit" value="complete">Complete</button>
                  <button name="intent" type="submit" value="delete">Delete</button>
                </form>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div >
  );
}
