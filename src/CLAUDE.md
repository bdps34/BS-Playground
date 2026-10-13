## Angular code rules

- always use Signal Forms. Don't use reactive or model-driven forms.

- don't use Rxjs and Observables unless explicitly told to. Define the API of your service layers with Promises.

- For handling async code, prefer Promises and the async /await syntax

- If you run into Angular APIs that are still Observable-based, convert them to Promises using firstValueFrom

- where applicable, keep a common CSS theme in shared files that you import/apply to the components,
  to make it easy to adapt the theme in the future.

- all HTTP requests target the backend by having the url start with /api.

- don't use inline HTML templates or CSS in Angular components. Always use external files.

## Folder structure

- `src/app/core/` holds app-wide singletons used once: services, interceptors and guards, grouped
  by concern (`auth`, `http`, `loading`, `user-messages`). The components rendered once in the app
  shell (global loading indicator, user messages) live in `core/layout/`.

- `src/app/shared/` holds reusable, stateless UI building blocks used by more than one area.

- `src/app/features/` holds one folder per feature (`auth`, `chat`), each with its own components,
  `services/` and `models/`.

- features may import from `core` and `shared`; `core` and `shared` never import from `features`,
  and features don't import from each other.

- in SCSS, import global styles with `@use 'styles/...'` (`src` is a style include path).
