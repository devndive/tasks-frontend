import { faker } from '@faker-js/faker';
import { rest } from 'msw';
import { ApiTask } from '~/utils/types';

const tasks = globalThis.__DATA_STORE;

export const handlers = [
  rest.get('http://127.0.0.1:8000/api/tasks', (req, res, ctx) => {

    return res(
      ctx.status(200),
      ctx.json({ tasks }),
    );
  }),

  rest.get('http://127.0.0.1:8000/api/tasks/:taskId', (req, res, ctx) => {
    const task = tasks?.find(t => t.id === req.params.taskId);

    if (task) {
      return res(
        ctx.status(200),
        ctx.json({ data: { task } })
      );
    }

    return res(
      ctx.status(404),
    );
  }),

  rest.post('http://127.0.0.1:8000/api/tasks', async (req, res, ctx) => {
    const data = await req.json();

    const newTask: ApiTask = {
      id: faker.string.uuid(),
      name: data.name,
      due_date: data.due_date,
      assigned_to: data.assigned_to,
      is_completed: false
    };

    tasks.push(newTask);

    return res(
      ctx.status(200),
      ctx.json({ task: newTask }),
    );
  }),
];
