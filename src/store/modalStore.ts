import { create } from 'zustand';

interface ModalState {
  loading: boolean;
  success: { show: boolean; title: string; message: string; onClose?: (() => void) | null };
  error: { show: boolean; title: string; message: string; onClose?: (() => void) | null };
  confirmation: { show: boolean; title: string; message: string; onConfirm: (() => void) | null };
  logout: boolean;
  info: { show: boolean; title: string; message: string };
  delete: { show: boolean; title: string; message: string; onConfirm: (() => void) | null };
  inviteLink: { show: boolean; groupId: string | null };
  openModal: (type: keyof Omit<ModalState, 'openModal' | 'closeModal' | 'showSuccess' | 'showError' | 'showConfirmation' | 'showInfo' | 'showDeleteConfirmation'>, data?: any) => void;
  closeModal: (type: string) => void;
  showSuccess: (title: string, message?: string, onClose?: () => void) => void;
  showError: (title: string, message?: string, onClose?: () => void) => void;
  showConfirmation: (message: string, onConfirm: () => void, title?: string) => void;
  showInfo: (title: string, message: string) => void;
  showDeleteConfirmation: (onConfirm: () => void, title?: string, message?: string) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  loading: false,
  success: { show: false, title: '', message: '', onClose: null },
  error: { show: false, title: '', message: '', onClose: null },
  confirmation: { show: false, title: '', message: '', onConfirm: null },
  logout: false,
  info: { show: false, title: '', message: '' },
  delete: { show: false, title: '', message: '', onConfirm: null },
  inviteLink: { show: false, groupId: null },
  openModal: (type, data?) => {
    if (type === 'loading' || type === 'logout') {
      set({ [type]: true });
    } else if (type === 'inviteLink') {
      set({ inviteLink: { show: true, groupId: data?.groupId || null } });
    } else if (type === 'success' || type === 'error' || type === 'info') {
      set({ [type]: { ...(set as any).getState()[type], show: true, ...(data || {}) } });
    } else if (type === 'confirmation' || type === 'delete') {
      set({ [type]: { show: true, ...(data || {}) } });
    }
  },
  closeModal: (type) => {
    if (type === 'loading' || type === 'logout') {
      set({ [type]: false });
    } else if (type === 'inviteLink') {
      set({ inviteLink: { show: false, groupId: null } });
    } else if (type === 'success' || type === 'error' || type === 'info') {
      set({ [type]: { show: false, title: '', message: '', ...(type === 'error' || type === 'success' ? { onClose: null } : {}) } });
    } else if (type === 'confirmation' || type === 'delete') {
      // Resetar estado de forma atômica para evitar renderizações intermediárias
      set({ [type]: { show: false, title: '', message: '', onConfirm: null } });
    }
  },
  showSuccess: (title, message = '', onClose) => {
    set({ success: { show: true, title, message, onClose: onClose || null } });
  },
  showError: (title, message = '', onClose) => {
    set({ error: { show: true, title, message, onClose: onClose || null } });
  },
  showConfirmation: (message, onConfirm, title = 'Confirmar ação') => {
    set({ confirmation: { show: true, title, message, onConfirm } });
  },
  showInfo: (title, message) => {
    set({ info: { show: true, title, message } });
  },
  showDeleteConfirmation: (onConfirm, title = 'Excluir item', message = 'Esta ação não pode ser desfeita. Tem certeza que deseja continuar?') => {
    set({ delete: { show: true, title, message, onConfirm } });
  },
}));

