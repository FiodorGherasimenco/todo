import { DEFAULT_USER_ID } from "../constants/api";
import { service } from "./service";

export type Todo<T = object> = T & {
  id: number;
  todo: string;
  completed: boolean;
};

export type TodosOutput<T = object> = {
  todos: Todo<T>[];
  total: number;
  skip: number;
  limit: number;
};

type TodosConfig = {
  skip?: number;
  limit?: number;
};

export const getAllTasks = ({ skip = 0, limit = 10 }: TodosConfig = {}) =>
  service<TodosOutput>(
    `/todos?${new URLSearchParams({
      skip: String(skip),
      limit: String(limit),
    }).toString()}`,
  );

export const addTask = (todo: string) =>
  service<Todo>("/todos/add", {
    method: "POST",
    body: JSON.stringify({
      todo: todo,
      completed: false,
      userId: DEFAULT_USER_ID,
    }),
  });

export const completeTask = (taskId: number) =>
  service<Todo>(`/todos/${taskId}`, {
    method: "PUT",
    body: JSON.stringify({
      completed: true,
    }),
  });

export const deleteTask = (taskId: number) =>
  service<
    Todo<{
      isDeleted: boolean;
      deletedOn: string;
    }>
  >(`/todos/${taskId}`, {
    method: "DELETE",
    body: JSON.stringify({
      completed: true,
    }),
  });
