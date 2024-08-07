import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { Todo } from "../../api/tasks";
import { TASKS_URLS } from "../../constants/api";
import { Task } from "./index";
import style from "./style.module.css";

const server = setupServer();

describe("<Task>", () => {
  const fakeTask = {
    id: 1,
    todo: "dummy task",
    completed: false,
  } satisfies Todo;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    cleanup();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("snapshot", () => {
    const { container } = render(<Task task={fakeTask} />);

    expect(container).toMatchSnapshot();
  });

  test("complete task", async () => {
    server.use(
      http.put<never, { completed: boolean }, Todo>(
        `${TASKS_URLS}/todos/1`,
        async ({ request }) => {
          const { completed } = await request.json();

          return HttpResponse.json<Todo>({
            ...fakeTask,
            completed,
          });
        },
      ),
    );

    render(<Task task={fakeTask} />);

    const button = screen.getByRole("button", { name: /complete/i });

    expect(button.hasAttribute("disabled")).toBeFalsy();

    fireEvent.click(button);

    // runAllTimers should be wrapped with act becuase testing library will use original timers
    // https://github.com/testing-library/react-testing-library/issues/1198
    await act(() => vi.runAllTimers());

    expect(button.hasAttribute("disabled")).toBeTruthy();

    expect(
      screen.getByText("dummy task").classList.contains(style.truncated),
    ).toBeTruthy();
  });

  test("delete task", async () => {
    server.use(
      http.delete<never, { completed: boolean }, Todo>(
        `${TASKS_URLS}/todos/1`,
        async () => {
          return HttpResponse.json<
            Todo<{
              isDeleted: boolean;
              deletedOn: string;
            }>
          >({
            ...fakeTask,
            isDeleted: true,
            deletedOn: new Date().toISOString(),
          });
        },
      ),
    );

    const { container } = render(<Task task={fakeTask} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });

    expect(deleteButton.hasAttribute("disabled")).toBeFalsy();

    fireEvent.click(deleteButton);

    // runAllTimers should be wrapped with act becuase testing library will use original timers
    // https://github.com/testing-library/react-testing-library/issues/1198
    await act(() => vi.runAllTimers());

    expect(container.hasChildNodes()).toBeFalsy();
  });

  test("undo deletion task", async () => {
    render(<Task task={fakeTask} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });

    expect(deleteButton.hasAttribute("disabled")).toBeFalsy();
    expect(screen.queryByRole("button", { name: /undo/i })).toBeNull();

    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByRole("button", { name: /undo/i }));

    expect(deleteButton.hasAttribute("disabled")).toBeFalsy();
  });
});
