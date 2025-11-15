import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Notification } from '@/types';

const STORAGE_KEY = 'ltg.notifications';

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

type NotificationPayload = Partial<Notification> &
  Pick<Notification, 'type'>;

interface NotificationsState {
  notifications: Notification[];
  addNotification: (notification: NotificationPayload) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      addNotification: (payload) => {
        const normalized: Notification = {
          id: payload.id ?? generateId(),
          type: payload.type,
          title: payload.title,
          message: payload.message,
          groupName: payload.groupName,
          destinationName: payload.destinationName,
          avatar: payload.avatar,
          actionRequired: payload.actionRequired,
          actions: payload.actions,
          createdAt: payload.createdAt ?? new Date().toISOString(),
          read: payload.read ?? false,
        };

        set((state) => ({
          notifications: [normalized, ...state.notifications].slice(0, 100),
        }));
      },
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((item) => ({
            ...item,
            read: true,
          })),
        }));
      },
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

