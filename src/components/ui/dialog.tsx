import React, { ReactNode, useEffect, useRef } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
  hideCloseButton?: boolean;
}

interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

interface DialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  onClick?: () => void;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      onClose={handleClose}
    >
      <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-auto mt-20 p-0">
        {children}
      </div>
    </dialog>
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({ children, className = '', hideCloseButton = false }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
      {!hideCloseButton && (
        <button
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
          onClick={() => window.dispatchEvent(new Event('dialog-close'))}
        >
          ×
        </button>
      )}
    </div>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
};

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, asChild = false, onClick }) => {
  if (asChild) {
    return (
      <div onClick={onClick}>
        {children}
      </div>
    );
  }
  
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
};

export default Dialog;
