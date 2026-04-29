"use client";

import { useMutation } from "@tanstack/react-query";
import { useDemoStore } from "@/lib/demo/store";

export function usePrintServiceStatus() {
  return { isAvailable: true, version: "demo", isChecking: false };
}

export function usePrintOrder() {
  const openPrintModal = useDemoStore((s) => s.openPrintModal);

  return useMutation({
    mutationFn: async (orderId: string) => {
      openPrintModal(orderId);
      return { orderId };
    },
    onSuccess: () => {},
    onError: () => {},
  });
}
