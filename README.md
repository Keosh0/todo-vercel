# TodoList — деплой на Vercel

React-приложение «Мой список дел» (Vite), развёрнутое на Vercel с автоматическим деплоем из GitHub.
Основано на клиенте TodoList из задания по Express.js.

## Запуск локально

Требуется Node.js 20+.

```bash
npm install
npm run dev      # режим разработки, http://localhost:5173
npm run build    # продакшн-сборка в папку dist
npm run preview  # просмотр собранной версии
```

## Переменные окружения

Секреты не хранятся в репозитории: `.env` и `.env.local` исключены в `.gitignore`.
Для локальной работы скопируйте `.env.example` в `.env.local` и подставьте значения.

| Переменная | Назначение |
|---|---|
| `VITE_API_KEY` | API-ключ, передаётся в заголовке `x-api-key` при работе с сервером |
| `VITE_API_URL` | адрес Express API (необязательно); если не задан, задачи хранятся в `localStorage` браузера |

На Vercel те же переменные задаются в **Settings → Environment Variables**.

## Деплой на Vercel

Настройки сборки (также зафиксированы в `vercel.json`):

- Framework Preset — **Vite**
- Build Command — `npm run build`
- Output Directory — `dist`

CI/CD: каждый push в `main` обновляет продакшн-версию, push в любую другую ветку создаёт превью-деплой с отдельной ссылкой.
Внизу страницы приложение показывает окружение (`production` / `preview`) и ветку, из которой собрано.
