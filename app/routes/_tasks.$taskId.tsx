import { ActionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { deleteTask, markTaskCompleted } from "~/utils/api.server";

export const action = async ({ params, request }: ActionArgs) => {
  console.log("tasks.$taskId.tsx::action");

  const form = await request.formData();
  const intent = form.get("intent") || "";

  if (intent !== "delete" && intent !== "complete") {
    throw new Response(`The intent ${intent} is not supported`, { status: 400 });
  }

  const taskId = params.taskId;
  if (intent === "delete") {
    await deleteTask(taskId!);
  }

  if (intent === "complete") {
    await markTaskCompleted(taskId!);
  }

  return redirect("/");
}

export default function Index() {
  return (<Outlet />)
}
