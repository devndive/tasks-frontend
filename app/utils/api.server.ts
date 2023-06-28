import { Task, ApiTask, ApiTaskSingleResponse, ApiTasksListResponse } from "./types";

const API_SERVER_URL = "http://127.0.0.1:8000/api/tasks";

function mapApiTaskToTask(apiTask: ApiTask): Task {
  return {
    id: apiTask.id,
    name: apiTask.name,
    dueDate: apiTask.due_date,
    assignedTo: apiTask.assigned_to,
    isCompleted: apiTask.is_completed
  }
}

export async function getTaskById(taskId: string): Promise<Task> {
  const response = await fetch(`${API_SERVER_URL}/${taskId}`);
  const data = await response.json() as ApiTaskSingleResponse;

  return mapApiTaskToTask(data.data.task);
}


export async function getTasks(): Promise<Task[]> {
  const response = await fetch(API_SERVER_URL);
  const data = await response.json() as ApiTasksListResponse;

  if (response.ok) {
    return data.tasks.map(mapApiTaskToTask);
  } else {
    const text = await response.text();
    throw new Error(`response.statusText: ${text}`);
  }
}

export async function deleteTask(taskId: string) {
  const response = await fetch(`${API_SERVER_URL}/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.ok) {
    return response;
  } else {
    const text = await response.text();
    throw new Error(`response.statusText: ${text}`);
  }
}

export async function markTaskCompleted(taskId: string) {
  const response = await fetch(`${API_SERVER_URL}/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "is_completed": true
    })
  });

  if (response.ok) {
    return await response.json();
  } else {
    const text = await response.text();
    throw new Error(`response.statusText: ${text}`);
  }
}

export async function createNewTask(name, assignedTo, dueDate, createdBy = "Yann Duval") {
  const parts = dueDate.split('.');
  dueDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

  const response = await fetch(API_SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      created_by: createdBy,
      assigned_to: assignedTo,
      due_date: `${dueDate}T08:00:00.000000Z`
    })
  });

  if (response.ok) {
    return await response.json();
  } else {
    const text = await response.text();
    throw new Error(`response.statusText: ${text}`);
  }
}

export async function updateTask(taskId, name, assignedTo, dueDate) {
  const parts = dueDate.split('.');
  dueDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

  const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      assigned_to: assignedTo,
      due_date: `${dueDate}T08:00:00.000000Z`
    })
  });

  if (response.ok) {
    return await response.json();
  } else {
    const text = await response.text();
    throw new Error(`response.statusText: ${text}`);
  }
}
