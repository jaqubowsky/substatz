"use client";

import { useState } from "react";

interface UseConfirmOptions {
  onConfirm: () => void | Promise<void>;
}

export function useConfirm({ onConfirm }: UseConfirmOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const confirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } finally {
      setIsLoading(false);
      close();
    }
  };

  return {
    isOpen,
    isLoading,
    open,
    close,
    confirm,
  };
}
