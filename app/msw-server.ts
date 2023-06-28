import { type SetupServerApi } from 'msw/node';
import { setupServer } from 'msw/node';
import { RequestHandler } from "msw";
import { ApiTask } from "./utils/types";

import { faker } from '@faker-js/faker';
import { build, perBuild } from "@jackfranklin/test-data-bot";
import { format } from 'date-fns';

declare global {
  var __MSW_SERVER: SetupServerApi | undefined;
  var __DATA_STORE: Array<ApiTask> | undefined;
}

const tasksBuilder = build<ApiTask>('ApiTask', {
  fields: {
    id: perBuild(() => faker.string.uuid()),
    name: perBuild(() => faker.lorem.words(5)),
    due_date: perBuild(() => format(faker.date.soon(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'")),
    assigned_to: perBuild(() => faker.person.fullName()),
    is_completed: perBuild(() => faker.datatype.boolean()),
  }
});

export const setup = (handlers: RequestHandler[]): SetupServerApi => setupServer(...handlers);

export const start = (server: SetupServerApi) => {
  server.listen({ onUnhandledRequest: "warn"});
  console.info("🔶 MSW mock server running...");

  process.once("SIGINT", () => {
    globalThis.__MSW_SERVER = undefined;
    globalThis.__DATA_STORE = undefined;
    server.close();
  });

  process.once("SIGTERM", () => {
    globalThis.__MSW_SERVER = undefined;
    globalThis.__DATA_STORE = undefined;
    server.close();
  });
};

const restart = (server: SetupServerApi, handlers: RequestHandler[]) => {
  server.close();
  console.info("🔶 Shutting down MSW Mock Server...");

  const _server = setup(handlers);
  globalThis.__MSW_SERVER = _server;

  console.info("🔶 Attempting to restart MSW Mock Server...");
  start(_server);
};

export const startMockServer = (handlers: RequestHandler[]) => {
  const IS_MSW_SERVER_RUNNING = globalThis.__MSW_SERVER !== undefined;
  const IS_DATA_AVAILABLE = globalThis.__DATA_STORE !== undefined;

  console.log("msw-server::startMockServer", { IS_MSW_SERVER_RUNNING, IS_DATA_AVAILABLE });
  if (IS_DATA_AVAILABLE === false) {
    console.log("msw-server::startMockServer", "No data!");
    globalThis.__DATA_STORE = tasksBuilder.many(20);
  }

  if (IS_MSW_SERVER_RUNNING === false) {
    const server = setup(handlers);
    globalThis.__MSW_SERVER = server;
    start(server);
  } else {
    const server = globalThis.__MSW_SERVER;
    if (server) {
      restart(server, handlers);
    }
  }
}
