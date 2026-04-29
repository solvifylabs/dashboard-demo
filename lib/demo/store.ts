"use client";

import { create } from "zustand";
import type { Burger, Extra, Customer, CustomerAddress, Order, OrderItem, OrderItemExtra, ExternalIncome } from "@/lib/types";
import type { SeedCombo, SeedComboSlot, SeedComboSlotRule } from "./seed/combos";
import {
  SEED_BURGERS,
  SEED_EXTRAS,
  SEED_COMBOS,
  SEED_COMBO_SLOTS,
  SEED_COMBO_SLOT_RULES,
  SEED_CUSTOMERS,
  SEED_CUSTOMER_ADDRESSES,
  generateSeedOrders,
} from "./seed";

// Generate orders once at module load — stable for the session
const { orders: SEED_ORDERS, order_items: SEED_ORDER_ITEMS, order_item_extras: SEED_ORDER_ITEM_EXTRAS, external_income: SEED_EXTERNAL_INCOME } = generateSeedOrders();

// ============================================================
// Types
// ============================================================

type TableName =
  | "burgers"
  | "extras"
  | "combos"
  | "combo_slots"
  | "combo_slots_rules"
  | "customers"
  | "customer_addresses"
  | "orders"
  | "order_items"
  | "order_item_extras"
  | "external_income";

interface DemoStore {
  // Tables
  burgers: Burger[];
  extras: Extra[];
  combos: SeedCombo[];
  combo_slots: SeedComboSlot[];
  combo_slots_rules: SeedComboSlotRule[];
  customers: Customer[];
  customer_addresses: CustomerAddress[];
  orders: Order[];
  order_items: OrderItem[];
  order_item_extras: OrderItemExtra[];
  external_income: ExternalIncome[];

  _nextOrderNumber: number;

  // Primitive mutations used by the mock Supabase builder
  insertRow(table: TableName, data: Record<string, unknown>): Record<string, unknown>;
  updateRow(table: TableName, id: string, patch: Record<string, unknown>): void;
  deleteRow(table: TableName, id: string): void;
  deleteRowsWhere(table: TableName, col: string, val: unknown): void;

  // Print modal state
  printModalOrderId: string | null;
  openPrintModal(orderId: string): void;
  closePrintModal(): void;

  // Demo order generator
  generatorEnabled: boolean;
  setGeneratorEnabled(v: boolean): void;

  // Guided tour
  tourActive: boolean;
  tourStep: number;
  tourCompleted: boolean;
  startTour(): void;
  skipTour(): void;
  nextTourStep(): void;
  prevTourStep(): void;

  // Wizard control for tour
  wizardTourOpen: boolean;
  wizardTourForceStep: string | null;
  setWizardTourState(open: boolean, step: string | null): void;
}

// ============================================================
// Store
// ============================================================

export const useDemoStore = create<DemoStore>((set, get) => ({
  burgers: SEED_BURGERS,
  extras: SEED_EXTRAS,
  combos: SEED_COMBOS,
  combo_slots: SEED_COMBO_SLOTS,
  combo_slots_rules: SEED_COMBO_SLOT_RULES,
  customers: SEED_CUSTOMERS,
  customer_addresses: SEED_CUSTOMER_ADDRESSES,
  orders: SEED_ORDERS,
  order_items: SEED_ORDER_ITEMS,
  order_item_extras: SEED_ORDER_ITEM_EXTRAS,
  external_income: SEED_EXTERNAL_INCOME,

  _nextOrderNumber: Math.max(...SEED_ORDERS.map((o) => o.order_number)) + 1,

  insertRow(table, data) {
    const id  = crypto.randomUUID();
    const now = new Date().toISOString();
    const row: Record<string, unknown> = { id, created_at: now, updated_at: now, ...data };

    if (table === "orders") {
      const num = get()._nextOrderNumber;
      row.order_number = num;
      set((s) => ({ _nextOrderNumber: s._nextOrderNumber + 1 }));
    }

    set((s) => ({ [table]: [...(s[table] as unknown[]), row] }));
    return row;
  },

  updateRow(table, id, patch) {
    const now = new Date().toISOString();
    set((s) => ({
      [table]: (s[table] as unknown as Array<Record<string, unknown>>).map((r) =>
        r.id === id ? { ...r, ...patch, updated_at: now } : r,
      ),
    }));
  },

  deleteRow(table, id) {
    set((s) => ({
      [table]: (s[table] as unknown as Array<Record<string, unknown>>).filter((r) => r.id !== id),
    }));
  },

  deleteRowsWhere(table, col, val) {
    set((s) => ({
      [table]: (s[table] as unknown as Array<Record<string, unknown>>).filter((r) => r[col] !== val),
    }));
  },

  printModalOrderId: null,
  openPrintModal: (orderId) => set({ printModalOrderId: orderId }),
  closePrintModal: () => set({ printModalOrderId: null }),

  generatorEnabled: true,
  setGeneratorEnabled: (v) => set({ generatorEnabled: v }),

  tourActive: false,
  tourStep: 0,
  tourCompleted: false,
  startTour: () => set({ tourActive: true, tourStep: 0 }),
  skipTour: () => set({ tourActive: false, tourCompleted: true, wizardTourOpen: false, wizardTourForceStep: null }),
  nextTourStep: () => set((s) => ({ tourStep: s.tourStep + 1 })),
  prevTourStep: () => set((s) => ({ tourStep: Math.max(0, s.tourStep - 1) })),

  wizardTourOpen: false,
  wizardTourForceStep: null,
  setWizardTourState: (open, step) => set({ wizardTourOpen: open, wizardTourForceStep: step }),
}));
