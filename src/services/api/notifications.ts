import type { Notification } from '@/types';

export const notificationsApi = {
  async getAll(): Promise<Notification[]> {
    return Promise.resolve([]);
  },

  async markAsRead(id: string): Promise<void> {
    console.log(`Mark notification ${id} as read`);
    return Promise.resolve();
  }
};
