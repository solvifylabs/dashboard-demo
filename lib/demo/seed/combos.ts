// Combos, slots y reglas — shapes compatibles con useAllCombos()

export interface SeedCombo {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
  created_at: string;
}

export interface SeedComboSlot {
  id: string;
  combo_id: string;
  slot_type: "burger" | "drink" | "side" | "fries" | "nuggets";
  quantity: number;
  required: boolean;
  default_meat_quantity: number | null;
  created_at: string;
}

export interface SeedComboSlotRule {
  id: number;
  combo_slot_id: string;
  rule_type: string;
  rule_value: string;
  created_at: string;
}

export const SEED_COMBOS: SeedCombo[] = [
  {
    id: "c1000000-0000-0000-0000-000000000001",
    name: "Combo Clásico",
    description: "Burger a elección + papas fritas chicas + bebida",
    price: 7500,
    is_available: true,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "c1000000-0000-0000-0000-000000000002",
    name: "Combo Familiar",
    description: "2 burgers a elección + papas grandes + 2 bebidas",
    price: 14500,
    is_available: true,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "c1000000-0000-0000-0000-000000000003",
    name: "Combo Premium",
    description: "Burger especial + papas con cheddar + bebida",
    price: 9200,
    is_available: true,
    created_at: "2025-01-01T00:00:00Z",
  },
];

export const SEED_COMBO_SLOTS: SeedComboSlot[] = [
  // Combo Clásico
  { id: "s1000000-0000-0000-0000-000000000001", combo_id: "c1000000-0000-0000-0000-000000000001", slot_type: "burger", quantity: 1, required: true, default_meat_quantity: 1, created_at: "2025-01-01T00:00:00Z" },
  { id: "s1000000-0000-0000-0000-000000000002", combo_id: "c1000000-0000-0000-0000-000000000001", slot_type: "fries", quantity: 1, required: true, default_meat_quantity: null, created_at: "2025-01-01T00:00:00Z" },
  { id: "s1000000-0000-0000-0000-000000000003", combo_id: "c1000000-0000-0000-0000-000000000001", slot_type: "drink", quantity: 1, required: true, default_meat_quantity: null, created_at: "2025-01-01T00:00:00Z" },
  // Combo Familiar
  { id: "s1000000-0000-0000-0000-000000000004", combo_id: "c1000000-0000-0000-0000-000000000002", slot_type: "burger", quantity: 2, required: true, default_meat_quantity: 1, created_at: "2025-01-01T00:00:00Z" },
  { id: "s1000000-0000-0000-0000-000000000005", combo_id: "c1000000-0000-0000-0000-000000000002", slot_type: "fries", quantity: 1, required: true, default_meat_quantity: null, created_at: "2025-01-01T00:00:00Z" },
  { id: "s1000000-0000-0000-0000-000000000006", combo_id: "c1000000-0000-0000-0000-000000000002", slot_type: "drink", quantity: 2, required: true, default_meat_quantity: null, created_at: "2025-01-01T00:00:00Z" },
  // Combo Premium
  { id: "s1000000-0000-0000-0000-000000000007", combo_id: "c1000000-0000-0000-0000-000000000003", slot_type: "burger", quantity: 1, required: true, default_meat_quantity: 1, created_at: "2025-01-01T00:00:00Z" },
  { id: "s1000000-0000-0000-0000-000000000008", combo_id: "c1000000-0000-0000-0000-000000000003", slot_type: "fries", quantity: 1, required: true, default_meat_quantity: null, created_at: "2025-01-01T00:00:00Z" },
  { id: "s1000000-0000-0000-0000-000000000009", combo_id: "c1000000-0000-0000-0000-000000000003", slot_type: "drink", quantity: 1, required: true, default_meat_quantity: null, created_at: "2025-01-01T00:00:00Z" },
];

export const SEED_COMBO_SLOT_RULES: SeedComboSlotRule[] = [
  // Combo Clásico: papas chicas o grandes
  { id: 1, combo_slot_id: "s1000000-0000-0000-0000-000000000002", rule_type: "allowed_ids", rule_value: "e1000000-0000-0000-0000-000000000020,e1000000-0000-0000-0000-000000000021", created_at: "2025-01-01T00:00:00Z" },
  { id: 2, combo_slot_id: "s1000000-0000-0000-0000-000000000003", rule_type: "allowed_ids", rule_value: "e1000000-0000-0000-0000-000000000010,e1000000-0000-0000-0000-000000000011,e1000000-0000-0000-0000-000000000012,e1000000-0000-0000-0000-000000000013", created_at: "2025-01-01T00:00:00Z" },
  // Combo Familiar: papas grandes o con cheddar
  { id: 3, combo_slot_id: "s1000000-0000-0000-0000-000000000005", rule_type: "allowed_ids", rule_value: "e1000000-0000-0000-0000-000000000021,e1000000-0000-0000-0000-000000000022", created_at: "2025-01-01T00:00:00Z" },
  { id: 4, combo_slot_id: "s1000000-0000-0000-0000-000000000006", rule_type: "allowed_ids", rule_value: "e1000000-0000-0000-0000-000000000010,e1000000-0000-0000-0000-000000000011,e1000000-0000-0000-0000-000000000012,e1000000-0000-0000-0000-000000000013", created_at: "2025-01-01T00:00:00Z" },
  // Combo Premium: papas con cheddar o con bacon
  { id: 5, combo_slot_id: "s1000000-0000-0000-0000-000000000008", rule_type: "allowed_ids", rule_value: "e1000000-0000-0000-0000-000000000022,e1000000-0000-0000-0000-000000000023", created_at: "2025-01-01T00:00:00Z" },
  { id: 6, combo_slot_id: "s1000000-0000-0000-0000-000000000009", rule_type: "allowed_ids", rule_value: "e1000000-0000-0000-0000-000000000010,e1000000-0000-0000-0000-000000000011,e1000000-0000-0000-0000-000000000012,e1000000-0000-0000-0000-000000000016", created_at: "2025-01-01T00:00:00Z" },
];
