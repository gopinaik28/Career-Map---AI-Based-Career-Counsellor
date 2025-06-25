// components/Modal.tsx
import React, { useEffect, useRef } from 'react';

export type ModalType = 'success' | 'warning' | 'confirmation' | 'error';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | React.ReactNode;
  type: ModalType;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancelButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling

      // Focus trapping
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0];
      const lastElement = focusableElements?.[focusableElements.length - 1];

      firstElement?.focus();

      const trapFocus = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      };
      modalRef.current?.addEventListener('keydown', trapFocus);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'auto';
        modalRef.current?.removeEventListener('keydown', trapFocus);
        previouslyFocusedElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-700/30 mb-5">
            <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
      case 'error': // Using same icon for warning and error for now, can be differentiated later
        return (
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-700/30' : 'bg-red-100 dark:bg-red-700/30'} mb-5`}>
            <svg className={`h-10 w-10 ${type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
        );
      case 'confirmation':
         return (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-700/30 mb-5">
            <svg className="h-10 w-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getConfirmButtonClass = () => {
    if (type === 'confirmation' && (confirmText?.toLowerCase().includes('delete') || confirmText?.toLowerCase().includes('clear'))) {
      return 'bg-red-600 hover:bg-red-700 focus-visible:outline-red-600';
    }
    if (type === 'success') {
      return 'bg-green-600 hover:bg-green-700 focus-visible:outline-green-600';
    }
    return 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus-visible:outline-indigo-600';
  };
  
  const getCancelButtonClass = () => {
    return 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 focus-visible:outline-gray-400';
  };


  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-modal-overlay-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
      onClick={onClose} // Close on overlay click
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-2xl transition-all animate-modal-content-in"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal content
      >
        <button
            type="button"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        {getIcon()}
        
        <h3 id="modal-title" className="text-2xl font-bold leading-tight text-center text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        <div id="modal-message" className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>

        <div className={`mt-6 flex ${type === 'confirmation' && showCancelButton ? 'justify-between gap-3' : 'justify-center'}`}>
          {type === 'confirmation' && showCancelButton && (
            <button
              type="button"
              className={`w-full sm:w-auto rounded-md px-6 py-2.5 text-sm font-semibold shadow-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${getCancelButtonClass()}`}
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            className={`w-full sm:w-auto rounded-md px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${getConfirmButtonClass()}`}
            onClick={() => {
              if (onConfirm) {
                onConfirm();
              }
              onClose(); // Always close after confirm action or if it's just an OK button
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
