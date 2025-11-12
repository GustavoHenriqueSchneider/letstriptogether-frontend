import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "./ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  LogOut, 
  Loader2,
  Info,
  Trash2,
  Share2,
  Copy
} from 'lucide-react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

// Loading Popup
export function LoadingPopup({ isOpen }: { isOpen: boolean }) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-[#6496D8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-[#6496D8] animate-spin" />
          </div>
          <DialogTitle className="text-[#01001D]">Carregando...</DialogTitle>
          <DialogDescription>
            Por favor, aguarde enquanto processamos sua solicitação.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

// Success Popup
export function SuccessPopup({ isOpen, onClose, title = "Sucesso!", message }: PopupProps & { title?: string; message: string }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-[#01001D]">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            onClick={onClose}
            className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Error Popup
export function ErrorPopup({ isOpen, onClose, title = "Erro", message }: PopupProps & { title?: string; message: string }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <DialogTitle className="text-[#01001D]">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            onClick={onClose}
            variant="destructive"
            className="w-full"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Confirmation Popup
export function ConfirmationPopup({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar ação", 
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default"
}: PopupProps & { 
  title?: string; 
  message: string; 
  confirmText?: string; 
  cancelText?: string;
  variant?: 'default' | 'destructive';
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            variant === 'destructive' ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            <AlertTriangle className={`w-8 h-8 ${
              variant === 'destructive' ? 'text-red-600' : 'text-yellow-600'
            }`} />
          </div>
          <AlertDialogTitle className="text-[#01001D]">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className={`w-full sm:w-auto order-1 sm:order-2 ${
              variant === 'destructive' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-[#0E0652] hover:bg-[#130F61] text-white'
            }`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Logout Confirmation Popup
export function LogoutPopup({ isOpen, onClose, onConfirm }: PopupProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-red-600" />
          </div>
          <AlertDialogTitle className="text-[#01001D]">Sair da Conta</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar seus grupos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className="w-full sm:w-auto order-1 sm:order-2 bg-red-600 hover:bg-red-700 text-white"
          >
            Sair
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Info Popup
export function InfoPopup({ isOpen, onClose, title, message }: PopupProps & { title: string; message: string }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-blue-600" />
          </div>
          <DialogTitle className="text-[#01001D]">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            onClick={onClose}
            className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
          >
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Delete Confirmation Popup
export function DeleteConfirmationPopup({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Excluir item", 
  message = "Esta ação não pode ser desfeita. Tem certeza que deseja continuar?"
}: PopupProps & { title?: string; message?: string }) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <AlertDialogTitle className="text-[#01001D]">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className="w-full sm:w-auto order-1 sm:order-2 bg-red-600 hover:bg-red-700 text-white"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Invite Link Popup
export function InviteLinkPopup({ isOpen, onClose }: PopupProps) {
  const inviteLink = "https://letstrip.app/invite/grupo-europa-2024";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    // Poderia mostrar uma confirmação de que foi copiado
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-blue-600" />
          </div>
          <DialogTitle className="text-[#01001D]">Convidar Membros</DialogTitle>
          <DialogDescription className="text-center">
            Compartilhe este link para convidar novos membros para o grupo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg border">
            <p className="text-sm text-gray-600 mb-2">Link de convite:</p>
            <p className="text-sm font-mono bg-white p-2 rounded border break-all">
              {inviteLink}
            </p>
          </div>
          
          <Button
            onClick={handleCopyLink}
            className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar Link
          </Button>
        </div>

        <DialogFooter>
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}