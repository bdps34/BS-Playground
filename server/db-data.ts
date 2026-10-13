import { Conversation } from './models/conversation.model';
import { User } from './models/user.model';

// Kept for reference / potential future use, but intentionally not used to seed `conversations`.
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'How to create component in angular',
    promptId: 'angular-assistant',
    userId: 'user-1',
    messages: [
      {
        id: 'conv-1-msg-0',
        role: 'system',
        content: 'You are a helpful assistant that answers questions about Angular.',
      },
      {
        id: 'conv-1-msg-1',
        role: 'user',
        content: 'How do I create a new component in Angular?',
      },
      {
        id: 'conv-1-msg-2',
        role: 'assistant',
        content:
          'You can generate a new standalone component with the Angular CLI by running ' +
          '"ng generate component my-component". In Angular 20+, components are standalone ' +
          'by default, so there is no need to declare them in an NgModule.',
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Angular routing how it works',
    promptId: 'angular-assistant',
    userId: 'user-1',
    messages: [
      {
        id: 'conv-2-msg-1',
        role: 'user',
        content: 'Can you explain how routing works in Angular?',
      },
      {
        id: 'conv-2-msg-2',
        role: 'assistant',
        content:
          'Angular routing maps URL paths to components using the Router. You define a ' +
          'Routes array with path and component (or loadComponent for lazy loading) entries, ' +
          'provide it via provideRouter, and render the matched component through a ' +
          '<router-outlet> in your template.',
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'What is service in angular',
    promptId: 'angular-assistant',
    userId: 'user-1',
    messages: [
      {
        id: 'conv-3-msg-1',
        role: 'user',
        content: 'What exactly is a service in Angular?',
      },
      {
        id: 'conv-3-msg-2',
        role: 'assistant',
        content:
          'A service is a class with a focused responsibility, typically used to share logic ' +
          'or state across components. Services are usually marked with ' +
          '"providedIn: \'root\'" so Angular provides a single shared instance, and are ' +
          'obtained with the inject() function.',
      },
    ],
  },
];

export const conversations: Conversation[] = [];

// Password is "test", hashed with Argon2id (see server/services/password.service.ts).
export const users: User[] = [
  {
    id: 'user-1',
    email: 'test@test.io',
    passwordHash:
      '$argon2id$v=19$m=19456,t=2,p=1$tSaewjuhGx8JMKMZ9n9i3A$2Hc8VUZfL7ddA+ITFWdxENQfzJuXWBEugLNJD5LhoLk',
  },
];
