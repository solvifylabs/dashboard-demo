/**
 * Mock Supabase client for the demo.
 *
 * Implements the same PostgREST builder interface so every existing hook
 * works without changes. Data is stored in the Zustand DemoStore (RAM only).
 *
 * Strategy: ignore the select-string, always return "fat" objects with
 * pre-computed joins. Extra fields are silently ignored by consumers.
 */

import { useDemoStore } from "./store";

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

type Row = Record<string, unknown>;
type MockResult<T> = { data: T; error: null; count?: number | null };
type MockError    = { data: null; error: { message: string; code?: string }; count?: null };

type FilterOp = "eq" | "neq" | "gte" | "lte" | "gt" | "lt" | "ilike" | "in";

interface Filter {
  column: string;
  op: FilterOp;
  value: unknown;
}

// ============================================================
// Joins — enrich rows with related data from the store
// ============================================================

function resolveRow(row: Row, table: TableName, store: ReturnType<typeof useDemoStore.getState>): Row {
  if (table === "orders") {
    const customer = store.customers.find((c) => c.id === row.customer_id) ?? null;
    const customerAddresses = customer
      ? store.customer_addresses.filter((a) => a.customer_id === customer.id)
      : [];
    const customerAddress = store.customer_addresses.find((a) => a.id === row.customer_address_id) ?? null;

    const order_items = store.order_items
      .filter((i) => i.order_id === row.id)
      .map((item) => {
        const order_item_extras = store.order_item_extras
          .filter((e) => e.order_item_id === item.id)
          .map((ext) => ({
            ...ext,
            extras: store.extras.find((e) => e.id === ext.extra_id) ?? null,
          }));
        return {
          ...item,
          order_item_extras,
          extras: order_item_extras, // alias used by some hooks
        };
      });

    return {
      ...row,
      customer: customer ? { ...customer, customer_addresses: customerAddresses } : null,
      customer_address: customerAddress,
      customerAddress: customerAddress,
      order_items,
      items: order_items, // alias used by useOrderForEdit
    };
  }

  if (table === "order_items") {
    const burger = store.burgers.find((b) => b.id === row.burger_id) ?? null;
    const extra  = store.extras.find((e) => e.id === row.extra_id) ?? null;
    const order_item_extras = store.order_item_extras
      .filter((e) => e.order_item_id === row.id)
      .map((ext) => ({
        ...ext,
        extras: store.extras.find((e) => e.id === ext.extra_id) ?? null,
      }));

    return { ...row, burgers: burger, extras: order_item_extras, order_item_extras };
  }

  if (table === "combos") {
    const combo_slots = store.combo_slots
      .filter((s) => s.combo_id === row.id)
      .map((slot) => ({
        ...slot,
        combo_slots_rules: store.combo_slots_rules.filter((r) => r.combo_slot_id === slot.id),
      }));
    return { ...row, combo_slots };
  }

  if (table === "customers") {
    const customer_addresses = store.customer_addresses.filter((a) => a.customer_id === row.id);
    return { ...row, customer_addresses };
  }

  return row;
}

// ============================================================
// Query builder
// ============================================================

class MockQueryBuilder<T = unknown> {
  private _table: TableName;
  private _filters: Filter[] = [];
  private _orFilter: string | null = null;
  private _orderCol: string | null = null;
  private _orderAsc = true;
  private _limitN: number | null = null;
  private _isSingle = false;
  private _isHead = false;
  private _countMode = false;

  // Mutation state
  private _insertData: Row | Row[] | null = null;
  private _updateData: Row | null = null;
  private _isDelete = false;

  constructor(table: TableName) {
    this._table = table;
  }

  // ── Query modifiers ──────────────────────────────────────────

  select(_cols?: string, opts?: { count?: string; head?: boolean }) {
    if (opts?.head) this._isHead = true;
    if (opts?.count) this._countMode = true;
    return this;
  }

  eq(col: string, val: unknown)    { this._filters.push({ column: col, op: "eq",  value: val }); return this; }
  neq(col: string, val: unknown)   { this._filters.push({ column: col, op: "neq", value: val }); return this; }
  gte(col: string, val: unknown)   { this._filters.push({ column: col, op: "gte", value: val }); return this; }
  lte(col: string, val: unknown)   { this._filters.push({ column: col, op: "lte", value: val }); return this; }
  gt(col: string, val: unknown)    { this._filters.push({ column: col, op: "gt",  value: val }); return this; }
  lt(col: string, val: unknown)    { this._filters.push({ column: col, op: "lt",  value: val }); return this; }
  ilike(col: string, pat: string)  { this._filters.push({ column: col, op: "ilike", value: pat }); return this; }
  in(col: string, vals: unknown[]) { this._filters.push({ column: col, op: "in", value: vals }); return this; }

  or(filterStr: string) { this._orFilter = filterStr; return this; }

  order(col: string, opts?: { ascending?: boolean }) {
    this._orderCol = col;
    this._orderAsc = opts?.ascending ?? true;
    return this;
  }

  limit(n: number)  { this._limitN = n; return this; }
  single()          { this._isSingle = true; return this; }

  // ── Mutations ────────────────────────────────────────────────

  insert(data: Row | Row[]) {
    const clone = new MockQueryBuilder<T>(this._table);
    clone._insertData = data;
    return clone;
  }

  update(data: Row) {
    const clone = new MockQueryBuilder<T>(this._table);
    clone._updateData = data;
    clone._filters = [...this._filters];
    return clone;
  }

  delete() {
    const clone = new MockQueryBuilder<T>(this._table);
    clone._isDelete = true;
    clone._filters = [...this._filters];
    return clone;
  }

  // ── Execution ────────────────────────────────────────────────

  private _execute(): MockResult<unknown> | MockError {
    const store = useDemoStore.getState();

    // ── INSERT ──────────────────────────────────────────────
    if (this._insertData !== null) {
      const rows = Array.isArray(this._insertData) ? this._insertData : [this._insertData];
      let lastRow: Row | null = null;

      for (const row of rows) {
        lastRow = store.insertRow(this._table, row) as Row;
      }

      if (this._isSingle) {
        const enriched = resolveRow(lastRow!, this._table, useDemoStore.getState());
        return { data: enriched, error: null };
      }
      return { data: rows.length === 1 ? resolveRow(lastRow!, this._table, useDemoStore.getState()) : rows, error: null };
    }

    // ── UPDATE ──────────────────────────────────────────────
    if (this._updateData !== null) {
      const table = store[this._table] as Row[];
      const eqFilter = this._filters.find((f) => f.op === "eq" && f.column === "id");

      if (eqFilter) {
        store.updateRow(this._table, eqFilter.value as string, this._updateData);
      } else {
        // Update all matching rows (e.g. bulk update with eq on non-id col)
        const matching = this._applyFilters(table);
        for (const row of matching) {
          store.updateRow(this._table, row.id as string, this._updateData!);
        }
      }

      if (this._isSingle) {
        const eqId = eqFilter?.value as string | undefined;
        const fresh = useDemoStore.getState()[this._table] as Row[];
        const updated = eqId ? fresh.find((r) => r.id === eqId) : fresh[0];
        return { data: updated ? resolveRow(updated, this._table, useDemoStore.getState()) : null, error: null };
      }
      return { data: null, error: null };
    }

    // ── DELETE ──────────────────────────────────────────────
    if (this._isDelete) {
      const table = store[this._table] as Row[];
      const eqFilter = this._filters.find((f) => f.op === "eq" && f.column === "id");
      const inFilter  = this._filters.find((f) => f.op === "in"  && f.column === "id");

      if (eqFilter) {
        store.deleteRow(this._table, eqFilter.value as string);
      } else if (inFilter) {
        for (const id of inFilter.value as string[]) {
          store.deleteRow(this._table, id);
        }
      } else {
        // DELETE WHERE col = val  (e.g. delete by order_id)
        const nonIdEq = this._filters.find((f) => f.op === "eq");
        if (nonIdEq) store.deleteRowsWhere(this._table, nonIdEq.column, nonIdEq.value);
        else {
          // Delete all matching (fallback)
          const matching = this._applyFilters(table);
          for (const r of matching) store.deleteRow(this._table, r.id as string);
        }
      }
      return { data: null, error: null };
    }

    // ── SELECT ──────────────────────────────────────────────
    let rows = (store[this._table] as Row[]).slice();
    rows = this._applyFilters(rows);
    rows = rows.map((r) => resolveRow(r, this._table, store));

    // Count-only (HEAD)
    if (this._isHead) {
      return { data: null as unknown, error: null, count: rows.length };
    }

    // Order
    if (this._orderCol) {
      const col = this._orderCol;
      const asc = this._orderAsc;
      rows.sort((a, b) => {
        const av = a[col] as string;
        const bv = b[col] as string;
        if (av < bv) return asc ? -1 : 1;
        if (av > bv) return asc ? 1 : -1;
        return 0;
      });
    }

    // Limit
    if (this._limitN !== null) rows = rows.slice(0, this._limitN);

    // Single
    if (this._isSingle) {
      if (rows.length === 0) {
        return { data: null, error: { message: "Row not found", code: "PGRST116" } };
      }
      return { data: rows[0], error: null };
    }

    const result: MockResult<unknown> = { data: rows, error: null };
    if (this._countMode) result.count = rows.length;
    return result;
  }

  private _applyFilters(rows: Row[]): Row[] {
    let result = rows;

    for (const f of this._filters) {
      result = result.filter((row) => {
        const val = row[f.column];
        switch (f.op) {
          case "eq":    return val === f.value;
          case "neq":   return val !== f.value;
          case "gte":   return (val as string) >= (f.value as string);
          case "lte":   return (val as string) <= (f.value as string);
          case "gt":    return (val as string) >  (f.value as string);
          case "lt":    return (val as string) <  (f.value as string);
          case "in":    return (f.value as unknown[]).includes(val);
          case "ilike": {
            const pattern = String(f.value).replace(/%/g, "").toLowerCase();
            return String(val ?? "").toLowerCase().includes(pattern);
          }
        }
      });
    }

    if (this._orFilter) {
      // Parse "col1.op.val1,col2.op.val2" — used by customer search
      const parts = this._orFilter.split(",");
      result = result.filter((row) =>
        parts.some((part) => {
          const segments = part.trim().split(".");
          const col = segments[0];
          const op  = segments[1];
          const rawVal = segments.slice(2).join("."); // handle dots in value
          const rowVal = String(row[col] ?? "").toLowerCase();
          if (op === "ilike") {
            const pattern = rawVal.replace(/%/g, "").toLowerCase();
            return rowVal.includes(pattern);
          }
          return false;
        }),
      );
    }

    return result;
  }

  // Make the builder awaitable (PromiseLike)
  then<TResult1 = MockResult<T>, TResult2 = never>(
    resolve: (value: MockResult<T>) => TResult1 | PromiseLike<TResult1>,
    reject?: (reason: unknown) => TResult2 | PromiseLike<TResult2>,
  ): Promise<TResult1 | TResult2> {
    try {
      const result = this._execute();
      return Promise.resolve(resolve(result as MockResult<T>));
    } catch (err) {
      if (reject) return Promise.resolve(reject(err));
      return Promise.reject(err);
    }
  }
}

// ============================================================
// Auth stub
// ============================================================

const DEMO_USER = {
  id: "demo-admin-00000000-0000-0000-0000",
  email: "demo@kibo.com",
  user_metadata: { role: "admin", name: "Demo Admin" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

const demoAuth = {
  getUser: async () => ({ data: { user: DEMO_USER }, error: null }),
  signInWithPassword: async () => ({ data: { user: DEMO_USER, session: { access_token: "demo" } }, error: null }),
  signOut: async () => ({ error: null }),
  onAuthStateChange: (_event: string, _cb: unknown) => ({ data: { subscription: { unsubscribe: () => {} } } }),
  admin: {
    listUsers: async () => ({ data: { users: [] }, error: null }),
    createUser: async () => ({ data: { user: null }, error: null }),
    updateUserById: async () => ({ data: { user: null }, error: null }),
  },
};

// ============================================================
// Storage stub
// ============================================================

const demoStorage = {
  from: (_bucket: string) => ({
    upload: async (_path: string, _file: unknown) => ({
      data: { path: _path },
      error: null,
    }),
    getPublicUrl: (_path: string) => ({
      data: { publicUrl: "https://placehold.co/400x300/f97316/ffffff?text=Demo" },
    }),
    remove: async () => ({ error: null }),
  }),
};

// ============================================================
// Channel stub (Realtime — not used in demo)
// ============================================================

const demoChannel = {
  on: () => demoChannel,
  subscribe: () => demoChannel,
  unsubscribe: () => Promise.resolve("ok" as const),
};

// ============================================================
// Public factory
// ============================================================

export function createClient() {
  return {
    from: (table: string) => new MockQueryBuilder(table as TableName),
    auth: demoAuth,
    storage: demoStorage,
    channel: (_name: string) => demoChannel,
    removeChannel: () => Promise.resolve("ok" as const),
  };
}
