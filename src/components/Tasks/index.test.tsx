import { beforeAll, describe, expect, test } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { render } from "@testing-library/react";
import { Tasks } from "./index";
import { TASKS_URLS } from "../../constants/api";
import { TodosOutput } from "../../api/tasks";

describe("<Tasks>", () => {
  beforeAll(() => {
    setupServer(
      http.get(`${TASKS_URLS}/todos`, () =>
        HttpResponse.json<TodosOutput>({
          todos: [
            {
              id: 1,
              todo: "fake_title",
              completed: false,
            },
          ],
          total: 1,
          skip: 0,
          limit: 10,
        }),
      ),
    ).listen();
  });

  test("happy path", async () => {
    const res = render(<Tasks />);
    console.log(res.container.outerHTML);
    expect(true).toBe(true);
  });
});
