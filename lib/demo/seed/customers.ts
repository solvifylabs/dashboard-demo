import type { Customer, CustomerAddress } from "@/lib/types";

export const SEED_CUSTOMERS: Customer[] = [
  { id: "cu000000-0000-0000-0000-000000000001", name: "Martín Rodríguez", phone: "11-2345-6789", address: null, created_at: "2025-06-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000002", name: "Lucía Fernández", phone: "11-3456-7890", address: null, created_at: "2025-06-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000003", name: "Sebastián Torres", phone: "11-4567-8901", address: null, created_at: "2025-07-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000004", name: "Valentina López", phone: "11-5678-9012", address: null, created_at: "2025-07-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000005", name: "Gonzalo Méndez", phone: "11-6789-0123", address: null, created_at: "2025-08-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000006", name: "Carolina Sánchez", phone: "11-7890-1234", address: null, created_at: "2025-08-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000007", name: "Diego Herrera", phone: "11-8901-2345", address: null, created_at: "2025-09-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000008", name: "Florencia Castro", phone: "11-9012-3456", address: null, created_at: "2025-09-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000009", name: "Nicolás Gutiérrez", phone: "11-0123-4567", address: null, created_at: "2025-10-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000010", name: "Agustina Morales", phone: "11-1234-5678", address: null, created_at: "2025-10-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000011", name: "Facundo Romero", phone: "11-2345-6780", address: null, created_at: "2025-11-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000012", name: "Camila Ortega", phone: "11-3456-7891", address: null, created_at: "2025-11-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000013", name: "Ramiro Díaz", phone: "11-4567-8902", address: null, created_at: "2025-12-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000014", name: "Julieta Vargas", phone: "11-5678-9013", address: null, created_at: "2025-12-01T00:00:00Z" },
  { id: "cu000000-0000-0000-0000-000000000015", name: "Tomás Acosta", phone: "11-6789-0124", address: null, created_at: "2026-01-01T00:00:00Z" },
];

export const SEED_CUSTOMER_ADDRESSES: CustomerAddress[] = [
  { id: "ca000000-0000-0000-0000-000000000001", customer_id: "cu000000-0000-0000-0000-000000000001", label: "Casa", address: "Av. Corrientes 1234, Piso 3B", is_default: true, notes: "Timbre 3B", created_at: "2025-06-01T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000002", customer_id: "cu000000-0000-0000-0000-000000000002", label: "Casa", address: "Calle Lavalle 567", is_default: true, notes: null, created_at: "2025-06-01T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000003", customer_id: "cu000000-0000-0000-0000-000000000002", label: "Trabajo", address: "Av. Santa Fe 1890, Piso 7", is_default: false, notes: "Dejar en recepción", created_at: "2025-06-15T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000004", customer_id: "cu000000-0000-0000-0000-000000000003", label: "Casa", address: "Mendoza 890", is_default: true, notes: null, created_at: "2025-07-01T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000005", customer_id: "cu000000-0000-0000-0000-000000000004", label: "Casa", address: "Av. Rivadavia 2345, Dpto 4A", is_default: true, notes: "Portero automático", created_at: "2025-07-01T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000006", customer_id: "cu000000-0000-0000-0000-000000000005", label: "Casa", address: "Thames 678", is_default: true, notes: null, created_at: "2025-08-01T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000007", customer_id: "cu000000-0000-0000-0000-000000000006", label: "Casa", address: "Av. Cabildo 345, PB", is_default: true, notes: "Casa con portón negro", created_at: "2025-08-01T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000008", customer_id: "cu000000-0000-0000-0000-000000000007", label: "Casa", address: "Uriarte 1234", is_default: true, notes: null, created_at: "2025-09-01T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000009", customer_id: "cu000000-0000-0000-0000-000000000009", label: "Casa", address: "Gurruchaga 789", is_default: true, notes: null, created_at: "2025-10-01T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000010", customer_id: "cu000000-0000-0000-0000-000000000010", label: "Casa", address: "Av. Scalabrini Ortiz 456", is_default: true, notes: "PB, puerta del fondo", created_at: "2025-10-01T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000011", customer_id: "cu000000-0000-0000-0000-000000000011", label: "Casa", address: "El Salvador 901", is_default: true, notes: null, created_at: "2025-11-01T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000012", customer_id: "cu000000-0000-0000-0000-000000000012", label: "Casa", address: "Honduras 123", is_default: true, notes: null, created_at: "2025-11-01T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000013", customer_id: "cu000000-0000-0000-0000-000000000013", label: "Casa", address: "Nicaragua 567", is_default: true, notes: null, created_at: "2025-12-01T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000014", customer_id: "cu000000-0000-0000-0000-000000000014", label: "Casa", address: "Costa Rica 890", is_default: true, notes: "Casa amarilla", created_at: "2025-12-01T00:00:00Z" },
  { id: "ca000000-0000-0000-0000-000000000015", customer_id: "cu000000-0000-0000-0000-000000000015", label: "Casa", address: "Guatemala 234", is_default: true, notes: null, created_at: "2026-01-01T00:00:00Z" },
];
