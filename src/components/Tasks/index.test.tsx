import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { Todo, TodosOutput } from "../../api/tasks";
import { TASKS_URLS } from "../../constants/api";
import { Tasks } from "./index";

const server = setupServer();

describe("<Tasks>", () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    cleanup();
  });

  test("snapshot", async () => {
    server.use(
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
    );

    const { container } = render(<Tasks />);
    expect(container).toMatchSnapshot();

    await waitFor(() => screen.getByRole("button", { name: /delete/i }));

    expect(container).toMatchSnapshot();
  });

  test("add new task", async () => {
    server.use(
      http.get(`${TASKS_URLS}/todos`, () =>
        HttpResponse.json<TodosOutput>({
          todos: [],
          total: 0,
          skip: 0,
          limit: 10,
        }),
      ),
      http.post<never, Omit<Todo, "id">, Todo>(
        `${TASKS_URLS}/todos/add`,
        async ({ request }) => {
          const json = await request.json();
          return HttpResponse.json<Todo>({
            id: 1,
            ...json,
          });
        },
      ),
    );

    render(<Tasks />);

    const buttonCreate = screen.getByRole("button", {
      name: /create/i,
    });
    const inputText = screen.getByRole("textbox");

    expect(inputText.hasAttribute("disabled")).toBeTruthy();
    expect(buttonCreate.hasAttribute("disabled")).toBeTruthy();

    await waitFor(() => expect(inputText.hasAttribute("disabled")).toBeFalsy());

    fireEvent.input(inputText, { target: { value: "dummy test task" } });

    expect(buttonCreate.hasAttribute("disabled")).toBeFalsy();

    fireEvent.click(buttonCreate);

    await waitFor(() =>
      expect(screen.getByText("dummy test task")).toBeDefined(),
    );
  });
});
