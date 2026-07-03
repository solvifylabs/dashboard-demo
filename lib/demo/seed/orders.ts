import type { Order, OrderItem, OrderItemExtra, ExternalIncome } from "@/lib/types";

// ============================================================
// Helpers
// ============================================================

let _uuid = 1;
function uid(prefix: string): string {
  const n = String(_uuid++).padStart(12, "0");
  return `${prefix}0000-0000-0000-${n}`;
}

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function dateStr(d: Date): string {
  return d.toISOString();
}

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

function setHour(d: Date, h: number, m = 0): Date {
  const r = new Date(d);
  r.setHours(h, m, 0, 0);
  return r;
}

// ============================================================
// Reference data (IDs must match seed burgers/extras/customers)
// ============================================================

export const BURGER_IDS   = ["b1000000-0000-0000-0000-000000000001","b1000000-0000-0000-0000-000000000002","b1000000-0000-0000-0000-000000000003","b1000000-0000-0000-0000-000000000004","b1000000-0000-0000-0000-000000000005","b1000000-0000-0000-0000-000000000006","b1000000-0000-0000-0000-000000000007","b1000000-0000-0000-0000-000000000008"];
export const BURGER_NAMES = ["California Roll","Philadelphia Roll","Sake Roll","Ebi Tempura Roll","Spicy Tuna Roll","New York Roll","Tako Roll","Veggie Roll"];
export const BURGER_PRICES= [4500,5200,4800,5500,5800,5400,5600,4300];

export const FRIES_IDS    = ["e1000000-0000-0000-0000-000000000020","e1000000-0000-0000-0000-000000000021","e1000000-0000-0000-0000-000000000022","e1000000-0000-0000-0000-000000000024"];
export const FRIES_NAMES  = ["Gyozas x4","Gyozas x6","Tempura de langostinos","Arroz gohan"];
export const FRIES_PRICES = [1200,1800,2400,2100];

export const DRINK_IDS    = ["e1000000-0000-0000-0000-000000000010","e1000000-0000-0000-0000-000000000011","e1000000-0000-0000-0000-000000000012","e1000000-0000-0000-0000-000000000016"];
export const DRINK_NAMES  = ["Coca-Cola 500ml","Sprite 500ml","Fanta 500ml","Limonada de jengibre"];
export const DRINK_PRICES = [1200,1200,1200,1400];

const EXT_IDS      = ["e1000000-0000-0000-0000-000000000001","e1000000-0000-0000-0000-000000000002","e1000000-0000-0000-0000-000000000003"];
const EXT_NAMES    = ["Queso crema extra","Palta extra","Salsa teriyaki"];
const EXT_PRICES   = [600,800,500];

export const CUST_IDS  = Array.from({length:15},(_,i)=>`cu000000-0000-0000-0000-${String(i+1).padStart(12,"0")}`);
export const CUST_NAMES= ["Martín Rodríguez","Lucía Fernández","Sebastián Torres","Valentina López","Gonzalo Méndez","Carolina Sánchez","Diego Herrera","Florencia Castro","Nicolás Gutiérrez","Agustina Morales","Facundo Romero","Camila Ortega","Ramiro Díaz","Julieta Vargas","Tomás Acosta"];
export const CUST_ADDRS= ["ca000000-0000-0000-0000-000000000001","ca000000-0000-0000-0000-000000000002",null,"ca000000-0000-0000-0000-000000000004","ca000000-0000-0000-0000-000000000005","ca000000-0000-0000-0000-000000000006","ca000000-0000-0000-0000-000000000007","ca000000-0000-0000-0000-000000000008",null,"ca000000-0000-0000-0000-000000000010","ca000000-0000-0000-0000-000000000011","ca000000-0000-0000-0000-000000000012","ca000000-0000-0000-0000-000000000013","ca000000-0000-0000-0000-000000000014","ca000000-0000-0000-0000-000000000015"];

// ============================================================
// Build one order + its items
// ============================================================

interface OrderBundle {
  order: Order;
  items: OrderItem[];
  extras: OrderItemExtra[];
}

function addMins(date: Date, mins: number): string {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + mins);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function buildOrder(orderDate: Date, status: Order["status"], orderNum: number): OrderBundle {
  const orderId  = uid("oo");
  const ci       = rnd(0, 14);
  const isDelivery = Math.random() < 0.42;
  const addrId   = isDelivery ? (CUST_ADDRS[ci] ?? null) : null;
  const fee      = isDelivery ? 900 : 0;
  const payment  = pick(["cash","cash","transfer","transfer","transfer"] as Order["payment_method"][]);
  const isPaid   = status === "completed";

  // Discount: ~12% of orders
  let discType: Order["discount_type"] = "none";
  let discVal  = 0;
  const dr = Math.random();
  if (dr < 0.08)  { discType = "percentage"; discVal = pick([5,10,15]); }
  else if (dr < 0.12) { discType = "amount"; discVal = pick([500,1000,2000]); }

  const nBurgers = Math.random() < 0.4 ? 1 : Math.random() < 0.65 ? 2 : 3;
  const items: OrderItem[] = [];
  const extras: OrderItemExtra[] = [];
  let subtotal = 0;

  for (let j = 0; j < nBurgers; j++) {
    const bi    = rnd(0, 7);
    const price = BURGER_PRICES[bi];
    const qty   = 1;
    const itemId = uid("ii");
    subtotal += price * qty;
    items.push({
      id: itemId,
      order_id: orderId,
      burger_id: BURGER_IDS[bi],
      combo_id: null,
      burger_name: BURGER_NAMES[bi],
      quantity: qty,
      unit_price: price,
      subtotal: price * qty,
      customizations: null,
      created_at: dateStr(orderDate),
    });
    // 20% chance of extra on this burger
    if (Math.random() < 0.20) {
      const ei    = rnd(0, 2);
      const extId = uid("xe");
      subtotal += EXT_PRICES[ei];
      extras.push({
        id: extId,
        order_item_id: itemId,
        extra_id: EXT_IDS[ei],
        extra_name: EXT_NAMES[ei],
        quantity: 1,
        unit_price: EXT_PRICES[ei],
        subtotal: EXT_PRICES[ei],
        created_at: dateStr(orderDate),
      });
    }
  }

  // 62% fries
  if (Math.random() < 0.62) {
    const fi = rnd(0, 3);
    subtotal += FRIES_PRICES[fi];
    items.push({ id: uid("ii"), order_id: orderId, burger_id: null, combo_id: null, burger_name: FRIES_NAMES[fi], quantity: 1, unit_price: FRIES_PRICES[fi], subtotal: FRIES_PRICES[fi], customizations: null, created_at: dateStr(orderDate) });
  }

  // 50% drink
  if (Math.random() < 0.50) {
    const di = rnd(0, 3);
    subtotal += DRINK_PRICES[di];
    items.push({ id: uid("ii"), order_id: orderId, burger_id: null, combo_id: null, burger_name: DRINK_NAMES[di], quantity: 1, unit_price: DRINK_PRICES[di], subtotal: DRINK_PRICES[di], customizations: null, created_at: dateStr(orderDate) });
  }

  const discAmt = discType === "percentage" ? Math.round(subtotal * discVal / 100) : discType === "amount" ? Math.min(discVal, subtotal) : 0;
  const total   = Math.max(0, subtotal - discAmt + fee);

  const order: Order = {
    id: orderId,
    order_number: orderNum,
    customer_id: CUST_IDS[ci],
    customer_name: CUST_NAMES[ci],
    customer_address_id: addrId,
    status,
    is_paid: isPaid,
    total_amount: total,
    delivery_type: isDelivery ? "delivery" : "pickup",
    delivery_fee: fee,
    payment_method: payment,
    delivery_time: (status === "new" || status === "ready")
      ? addMins(orderDate, rnd(25, 75))
      : null,
    discount_type: discType,
    discount_value: discVal,
    discount_amount: discAmt,
    notes: null,
    created_at: dateStr(orderDate),
    updated_at: dateStr(orderDate),
  };

  return { order, items, extras };
}

// ============================================================
// Generate historical orders — last ~4 months
// ============================================================

export interface SeedOrderData {
  orders: Order[];
  order_items: OrderItem[];
  order_item_extras: OrderItemExtra[];
  external_income: ExternalIncome[];
}

export function generateSeedOrders(): SeedOrderData {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const allOrders:  Order[]          = [];
  const allItems:   OrderItem[]      = [];
  const allExtras:  OrderItemExtra[] = [];
  const allIncome:  ExternalIncome[] = [];

  let orderNum = 100;

  // ── Historical: 120 days back → yesterday ──────────────────
  for (let daysAgo = 120; daysAgo >= 1; daysAgo--) {
    const day = addDays(today, -daysAgo);

    // Volume: recent months more active; weekends slightly heavier
    const monthsAgo = daysAgo / 30;
    const baseVolume =
      monthsAgo > 3 ? rnd(4, 7) :
      monthsAgo > 2 ? rnd(5, 9) :
      monthsAgo > 1 ? rnd(6, 11) :
                       rnd(8, 14);
    const volume = baseVolume + rnd(0, 2); // noise

    for (let k = 0; k < volume; k++) {
      const hour = rnd(11, 22);
      const min  = rnd(0, 59);
      const orderDate = setHour(day, hour, min);

      // 10% canceled
      const status: Order["status"] = Math.random() < 0.10 ? "canceled" : "completed";
      const { order, items, extras } = buildOrder(orderDate, status, orderNum++);

      allOrders.push(order);
      allItems.push(...items);
      allExtras.push(...extras);
    }
  }

  // ── Today: 3 new + 1 ready + 4 completed ───────────────────
  const todayStatuses: Order["status"][] = ["completed","completed","completed","completed","ready","new","new","new"];
  for (let k = 0; k < todayStatuses.length; k++) {
    const hour = 11 + k * 1;
    const orderDate = setHour(today, hour, rnd(0, 45));
    const { order, items, extras } = buildOrder(orderDate, todayStatuses[k], orderNum++);
    allOrders.push(order);
    allItems.push(...items);
    allExtras.push(...extras);
  }

  // ── External income — 2-3 entries per month ────────────────
  const incomeDescriptions = [
    "Catering evento corporativo",
    "Catering cumpleaños privado",
    "Venta de merch",
    "Catering evento universitario",
    "Depósito anticipo catering",
    "Evento privado fin de semana",
  ];
  for (let m = 3; m >= 0; m--) {
    const count = rnd(2, 3);
    for (let k = 0; k < count; k++) {
      const incomeDay = addDays(today, -(m * 30 + rnd(1, 25)));
      allIncome.push({
        id: uid("ic"),
        date: incomeDay.toISOString().slice(0, 10),
        amount: rnd(8, 28) * 1000,
        description: pick(incomeDescriptions),
        created_at: dateStr(incomeDay),
      });
    }
  }

  return {
    orders: allOrders,
    order_items: allItems,
    order_item_extras: allExtras,
    external_income: allIncome,
  };
}
