import type { Extra } from "@/lib/types";

export const SEED_EXTRAS: Extra[] = [
  // Porción extra (para cálculos de precio internos)
  { id: "e1000000-0000-0000-0000-000000000006", name: "Porción extra", category: "extra", price: 1500, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  // Extras para rolls
  { id: "e1000000-0000-0000-0000-000000000001", name: "Queso crema extra", category: "extra", price: 600, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000002", name: "Palta extra", category: "extra", price: 800, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000003", name: "Salsa teriyaki", category: "extra", price: 500, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000004", name: "Cebolla crispy", category: "extra", price: 400, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000005", name: "Salsa spicy", category: "extra", price: 350, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  // Bebidas
  { id: "e1000000-0000-0000-0000-000000000010", name: "Coca-Cola 500ml", category: "drink", price: 1200, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000011", name: "Sprite 500ml", category: "drink", price: 1200, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000012", name: "Fanta 500ml", category: "drink", price: 1200, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000013", name: "Agua mineral 500ml", category: "drink", price: 800, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000016", name: "Limonada de jengibre", category: "drink", price: 1400, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  // Guarniciones
  { id: "e1000000-0000-0000-0000-000000000020", name: "Gyozas x4", category: "fries", price: 1200, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000021", name: "Gyozas x6", category: "fries", price: 1800, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000022", name: "Tempura de langostinos", category: "fries", price: 2400, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000023", name: "Yakimeshi", category: "fries", price: 2900, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000024", name: "Arroz gohan", category: "fries", price: 2100, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  // Entradas / Sides
  { id: "e1000000-0000-0000-0000-000000000030", name: "Edamame", category: "sides", price: 1800, is_available: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "e1000000-0000-0000-0000-000000000031", name: "Sopa miso", category: "sides", price: 2200, is_available: true, created_at: "2025-01-01T00:00:00Z" },
];
