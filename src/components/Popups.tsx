import React from 'react';
import { useModalStore } from '@/store/modalStore';
import { membersApi } from '@/services/api/members';
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
  Copy,
  RefreshCw
} from 'lucide-react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

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

export function SuccessPopup({ isOpen, onClose, title = "Sucesso!", message, onConfirm }: PopupProps & { title?: string; message: string; onConfirm?: () => void }) {
  const handleClose = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-[#01001D] text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            onClick={handleClose}
            className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ErrorPopup({ isOpen, onClose, title = "Erro", message, onConfirm }: PopupProps & { title?: string; message: string; onConfirm?: () => void }) {
  const handleClose = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <DialogTitle className="text-[#01001D] text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            onClick={handleClose}
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
          <AlertDialogTitle className="text-[#01001D] text-center">{title}</AlertDialogTitle>
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

export function LogoutPopup({ isOpen, onClose, onConfirm }: PopupProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-red-600" />
          </div>
          <AlertDialogTitle className="text-[#01001D] text-center">Sair da Conta</AlertDialogTitle>
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

export function InfoPopup({ isOpen, onClose, title, message }: PopupProps & { title: string; message: string }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-blue-600" />
          </div>
          <DialogTitle className="text-[#01001D] text-center">{title}</DialogTitle>
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

export function DeleteConfirmationPopup({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Excluir item", 
  message = "Esta ação não pode ser desfeita. Tem certeza que deseja continuar?"
}: PopupProps & { title?: string; message?: string }) {
  const isLeaveGroup = title === "Sair do grupo";
  const IconComponent = isLeaveGroup ? LogOut : Trash2;
  const iconSize = isLeaveGroup ? "w-6 h-6" : "w-8 h-8";
  const confirmText = isLeaveGroup ? "Sair" : "Excluir";
  const bgColor = isLeaveGroup ? "bg-orange-100" : "bg-red-100";
  const iconColor = isLeaveGroup ? "text-orange-600" : "text-red-600";
  const buttonColor = isLeaveGroup ? "bg-orange-600 hover:bg-orange-700" : "bg-red-600 hover:bg-red-700";

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-center">
          <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <IconComponent className={`${iconSize} ${iconColor}`} />
          </div>
          <AlertDialogTitle className="text-[#01001D] text-center">{title}</AlertDialogTitle>
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
            className={`w-full sm:w-auto order-1 sm:order-2 ${buttonColor} text-white`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function InviteLinkPopup({ isOpen, onClose, groupId }: PopupProps & { groupId: string }) {
  const [inviteLink, setInviteLink] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [linkCopied, setLinkCopied] = React.useState(false);
  const { openModal, closeModal, showError, showSuccess } = useModalStore();

  React.useEffect(() => {
    if (isOpen && groupId) {
      setInviteLink('');
      setIsLoading(true);
      loadOrCreateInvite();
    } else if (!isOpen) {
      setInviteLink('');
      setIsLoading(false);
      setLinkCopied(false);
    }
  }, [isOpen, groupId]);

  const loadOrCreateInvite = async () => {
    if (!groupId) return;
    
    openModal('loading');
    
    try {
      const activeInvite = await membersApi.getActiveInvitation(groupId);
      
      if (activeInvite && activeInvite.inviteLink) {
        setInviteLink(activeInvite.inviteLink);
        setIsLoading(false);
        closeModal('loading');
        return;
      }
      
      const newInvite = await membersApi.invite(groupId);
      
      if (newInvite && newInvite.inviteLink) {
        setInviteLink(newInvite.inviteLink);
        setIsLoading(false);
        closeModal('loading');
        showSuccess('Convite criado', 'Um novo link de convite foi gerado com sucesso.');
      } else {
        throw new Error('Resposta da API não contém inviteLink');
      }
    } catch (error: any) {
      console.error('[InviteLinkPopup] Erro ao buscar/criar convite:', error);
      setIsLoading(false);
      closeModal('loading');
      showError(
        'Erro ao gerar convite',
        error.response?.data?.message || 'Não foi possível buscar ou criar o link de convite. Tente novamente.'
      );
    }
  };

  const handleCopyLink = async () => {
    if (inviteLink) {
      try {
        await navigator.clipboard.writeText(inviteLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      } catch (error) {
        const textArea = document.createElement('textarea');
        textArea.value = inviteLink;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      }
    }
  };

  const handleGenerateNewLink = async () => {
    setIsLoading(true);
    openModal('loading');
    
    try {
      try {
        await membersApi.cancelInvitation(groupId);
      } catch {
      }
      
      const newInvite = await membersApi.invite(groupId);
      setInviteLink(newInvite.inviteLink);
      setIsLoading(false);
      closeModal('loading');
      showSuccess('Novo convite criado', 'Um novo link de convite foi gerado com sucesso.');
    } catch (error: any) {
      console.error('[InviteLinkPopup] Erro ao gerar novo convite:', error);
      setIsLoading(false);
      closeModal('loading');
      showError(
        'Erro ao gerar novo convite',
        error.response?.data?.message || 'Não foi possível gerar um novo link de convite. Tente novamente.'
      );
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-blue-600" />
          </div>
          <DialogTitle className="text-[#01001D] text-center">Convidar Membros</DialogTitle>
          <DialogDescription className="text-center">
            Compartilhe este link para convidar novos membros para o grupo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#6496D8] animate-spin mr-2" />
              <p className="text-sm text-gray-600">Carregando link de convite...</p>
            </div>
          ) : inviteLink ? (
            <>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="text-sm text-gray-600 mb-2 text-center">Link de convite:</p>
                <p className="text-sm font-mono bg-white p-2 rounded border break-all text-center select-all">
                  {inviteLink}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleGenerateNewLink}
                  variant="outline"
                  disabled={isLoading}
                  className="flex-1 border-[#6496D8] text-[#6496D8] hover:bg-[#6496D8] hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Gerar novo convite
                </Button>
                <Button
                  onClick={handleCopyLink}
                  disabled={isLoading || !inviteLink}
                  className={`flex-1 ${linkCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-[#0E0652] hover:bg-[#130F61]'} text-white`}
                >
                  {linkCopied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar link
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600">Não foi possível carregar o link de convite.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}