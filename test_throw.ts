import { createServerFn } from '@tanstack/react-start';

export const testThrow = createServerFn({ method: 'GET' })
  .handler(async () => {
    throw new Error("This is a standard error");
  });
