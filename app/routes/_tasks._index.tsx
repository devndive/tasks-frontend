import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { formatDistanceToNow } from "date-fns";

import { CheckIcon, TrashIcon } from '@heroicons/react/20/solid';

import { getTasks } from "~/utils/api.server";
import { Task } from "~/utils/types";

export const loader = async () => {
  const tasks: Task[] = await getTasks();

  return json({ tasks });
}

function compareDates(a: string, b: string) {
  return new Date(a) - new Date(b);
}

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ')
}

const statuses = {
  Completed: 'text-green-700 bg-green-50 ring-green-600/20',
  'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}

function taskStatus(task: Task) {
  if (task.isCompleted) {
    return 'Completed';
  }

  return 'In progress';
}

export default function Index() {
  const { tasks } = useLoaderData<typeof loader>();

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {tasks.filter(t => !t.isCompleted).sort((a, b) => compareDates(a.dueDate, b.dueDate)).map((task) => (
        <li key={task.id} className="flex items-center justify-between py-5 px-5 hover:bg-gray-100">
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-gray-900">{task.name}</p>
              <p
                className={classNames(
                  statuses[taskStatus(task)],
                  'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                )}
              >
                {taskStatus(task)}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p className="whitespace-nowrap">
                Due in <time dateTime={task.dueDate}>{formatDistanceToNow(new Date(task.dueDate))}</time>
              </p>
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p className="truncate">Created by {"Someone"}</p>
            </div>
          </div>
          <form method="post" action={`${task.id}`} className="flex flex-none items-center gap-x-4">
            {!task.isCompleted ? 
            <button
              name="intent" type="submit" value="complete"
              className="hidden rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset hover:bg-green-50 sm:block text-green-700 bg-green-100 ring-green-600/20"
            >
              <CheckIcon className="h-5 w-5 inline" aria-hidden="true" />{" "}
              <span className="sr-only">Mark completed, {task.name}</span>
            </button>
            : null}
            <button
              name="intent" type="submit" value="delete"
              className="hidden rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset hover:bg-red-50 sm:block text-red-700 bg-red-100 ring-red-600/20"
            >
              <TrashIcon className="h-5 w-5 inline" aria-hidden="true" />{" "}
              <span className="sr-only">Remove, {task.name}</span>
            </button>
          </form>
        </li>
      ))}
    </ul>
  )
}
