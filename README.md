# ToDo List: React + TypeScript + Axios + TanStack Query

Задача 271 «Практика TypeScript: React и API». ToDo List с авторизацией, переписанный на TypeScript. Запросы к серверу идут через Axios, данные и кэш ведёт TanStack Query. `any` в проекте не используется.

## Стек

React 19, TypeScript (strict), Vite, Axios, TanStack Query, react-router, react-hook-form.

## Запуск

```bash
npm install
npm run dev
```

В корне нужен файл `.env` (в git он не попадает):

```
VITE_API_URL=https://todo-redev.onrender.com
```

Токен вручную вписывать не нужно: он приходит при входе и хранится в `localStorage` под ключом `access_token`.

Проверка типов: `npx tsc --noEmit`.

## Структура

```
src/
  api/
    instance.ts          # настроенный Axios (baseURL из .env)
    getErrorMessage.ts   # unknown -> строка для пользователя
  features/
    auth/                # authApi.ts, LoginForm.tsx, RegistrationForm.tsx
    todos/               # todosApi.ts, TaskInput, TaskList, TaskItem, TaskFilter, Footer
  types.ts               # общие типы
  App.tsx                # useQuery, useMutation, маршруты
```

## Ключевые типы (`src/types.ts`)

Сущности и ответы API:

| Тип | Описание |
|---|---|
| `Task` | Задача: `id`, `title`, `completed`, `description: string \| null`, `createdAt`, `updatedAt`, `userId`. Даты приходят строками |
| `Meta` | Постраничная информация: `total`, `page`, `limit`, `totalPages` |
| `TaskResponse` | Ответ на `GET /todos`: `{ data: Task[]; meta: Meta }` |
| `LoginResponse` | Ответ на вход и регистрацию: `{ access_token: string }` |

Типы форм и интерфейса:

| Тип | Описание |
|---|---|
| `LoginFormValues` | Поля формы входа: `email`, `password` |
| `RegisterFormValues` | Поля формы регистрации: `name`, `gender: "male" \| "female"`, `email`, `password` |
| `Filter` | `"All" \| "Active" \| "Completed"` |
| `SortOrder` | `"newest" \| "oldest"` |

Типы пропсов (`TaskItemProps`, `TaskListProps`, `TaskInputProps`, `TaskFilterProps`, `FooterProps`, `LoginFormProps`, `RegisterFormProps`) лежат рядом с компонентами, потому что нужны только им.

### Как типизировано

- **Axios.** Тип ответа задаётся дженериком запроса: `instance.get<TaskResponse>("todos")`, `instance.post<Task>(...)`. Поэтому `response.data` имеет настоящий тип, а не `any`.
- **События.** `ChangeEvent<HTMLInputElement>`, `KeyboardEvent<HTMLInputElement>`, `MouseEvent<HTMLButtonElement>`.
- **Refs.** `useRef<HTMLInputElement>(null)`: после добавления задачи фокус возвращается в поле ввода.
- **Формы.** `useForm<LoginFormValues>` и `useForm<RegisterFormValues>`; обработчики `onSubmit` принимают значения формы с тем же типом.
- **Ошибки.** В `catch` ошибка имеет тип `unknown`. Функция `getErrorMessage(error: unknown): string` сужает её по шагам: `axios.isAxiosError` (текст сервера из `response.data.message`), затем `instanceof Error`, иначе запасной текст.

## Как обновляется список после mutation

Список задач хранится не в `useState`, а в кэше TanStack Query под ключом `["todos"]`.

1. `useQuery({ queryKey: ["todos"], queryFn: ... })` загружает список и отдаёт его компоненту (`data`, `isLoading`, `error`). Запрос включается только при наличии токена (`enabled: !!token`).
2. Для каждого изменения (добавить, отметить, изменить, удалить, очистить выполненные) создан `useMutation`.
3. Когда сервер отвечает успешно, срабатывает `onSuccess`, и в нём вызывается `queryClient.invalidateQueries({ queryKey: ["todos"] })`.
4. Инвалидация помечает кэш `["todos"]` устаревшим. `useQuery` с этим ключом сразу заново запрашивает список.
5. Новые данные попадают в `data`, компонент перерисовывается, список на экране обновлён. Руками менять состояние и вызывать `setTasks` не нужно.

Пока идёт любая мутация, `isPending` блокирует кнопки (общий флаг `actionLoading`). Ошибки запроса и всех мутаций собираются в одну переменную и показываются через `getErrorMessage`.
