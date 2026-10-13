export type UserMessageType = 'error' | 'warning' | 'info' | 'success';

export type UserMessage = {
  id: string;
  type: UserMessageType;
  text: string;
};
