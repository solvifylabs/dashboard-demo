import type { Extra } from "@/lib/types";

export const SEED_EXTRAS: Extra[] = [
  // Medallón (para cálculos de precio internos)
  { id: "e1000000-0000-0000-0000-000000000006", name: "Medallón", category: "extra", price: 1500, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  // Extras para hamburguesas
  { id: "e1000000-0000-0000-0000-000000000001", name: "Queso cheddar extra", category: "extra", price: 600, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000002", name: "Panceta", category: "extra", price: 800, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000003", name: "Huevo frito", category: "extra", price: 500, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000004", name: "Cebolla caramelizada", category: "extra", price: 400, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000005", name: "Jalapeños", category: "extra", price: 350, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  // Bebidas
  { id: "e1000000-0000-0000-0000-000000000010", name: "Coca-Cola 500ml", category: "drink", price: 1200, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000011", name: "Sprite 500ml", category: "drink", price: 1200, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000012", name: "Fanta 500ml", category: "drink", price: 1200, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000013", name: "Agua mineral 500ml", category: "drink", price: 800, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000016", name: "Limonada", category: "drink", price: 1400, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  // Papas fritas
  { id: "e1000000-0000-0000-0000-000000000020", name: "Papas fritas chicas", category: "fries", price: 1200, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000021", name: "Papas fritas grandes", category: "fries", price: 1800, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000022", name: "Papas con cheddar", category: "fries", price: 2400, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000023", name: "Papas con bacon y cheddar", category: "fries", price: 2900, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000024", name: "Papas rústicas", category: "fries", price: 2100, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  // Sides / Acompañamientos
  { id: "e1000000-0000-0000-0000-000000000030", name: "Aros de cebolla", category: "sides", price: 1800, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000031", name: "Nuggets x6", category: "sides", price: 2200, is_available: true, created_at: "2025-01-01T00:00:00Z" },
];
