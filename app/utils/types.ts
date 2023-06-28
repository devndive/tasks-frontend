
export type Task = {
  id: string,
  name: string,
  dueDate: string,
  assignedTo: string,
  isCompleted: boolean,
}

export type ApiTask = {
  id: string,
  name: string,
  assigned_to: string,
  due_date: string,
  is_completed: boolean,
}

export type ApiTasksListResponse = {
  status: string,
  results: number,
  tasks: ApiTask[]
}

export type ApiTaskSingleResponse = {
  data: {
    task: ApiTask
  }
}
