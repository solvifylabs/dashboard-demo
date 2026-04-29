"use client";

import { createContext, useContext } from "react";
import type { useOrderWizard } from "./hooks/use-order-wizard";

export type { WizardStep } from "@/lib/types";

export const OrderWizardContext = createContext<ReturnType<
  typeof useOrderWizard
> | null>(null);

export const useOrderWizardContext = () => {
  const ctx = useContext(OrderWizardContext);
  if (!ctx) throw new Error("OrderWizardProvider missing");
  return ctx;
};
