-- Restaurant Operations Dashboard Schema
-- Run this file first, then 002-seed-data.sql

-- ============================================
-- SEQUENCES
-- ============================================
CREATE SEQUENCE IF NOT EXISTS orders_order_number_seq START 1;

-- ============================================
-- CUSTOMERS
-- ============================================
CREATE TABLE customers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  phone       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CUSTOMER ADDRESSES
-- ============================================
CREATE TABLE customer_addresses (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID        NOT NULL REFERENCES customers(id),
  label       TEXT        NOT NULL,
  address     TEXT,
  notes       TEXT,
  is_default  BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL UNIQUE,
  type       TEXT        NOT NULL CHECK (type IN ('burger', 'extra', 'drink', 'fries')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BURGERS
-- ============================================
CREATE TABLE burgers (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT        NOT NULL,
  description           TEXT,
  base_price            DECIMAL(10,2) NOT NULL,
  ingredients           TEXT[]      DEFAULT '{}',
  is_available          BOOLEAN     DEFAULT TRUE,
  image_url             TEXT,
  default_meat_quantity SMALLINT    DEFAULT 2,
  default_fries_quantity DECIMAL    DEFAULT 1,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXTRAS
-- ============================================
CREATE TABLE extras (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT          NOT NULL,
  category     TEXT          NOT NULL CHECK (category IN ('extra', 'drink', 'fries', 'sides')),
  price        DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN       DEFAULT TRUE,
  created_at   TIMESTAMPTZ   DEFAULT NOW()
);

-- ============================================
-- COMBOS
-- ============================================
CREATE TABLE combos (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT          NOT NULL DEFAULT '',
  description  TEXT,
  price        DECIMAL(10,2),
  is_available BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================
-- COMBO SLOTS
-- ============================================
CREATE TABLE combo_slots (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id            UUID          REFERENCES combos(id),
  slot_type           TEXT          DEFAULT 'burger',
  quantity            DECIMAL       DEFAULT 0,
  required            BOOLEAN       DEFAULT TRUE,
  default_meat_quantity DECIMAL,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================
-- COMBO SLOT RULES
-- ============================================
CREATE TABLE combo_slots_rules (
  id            BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  combo_slot_id UUID        REFERENCES combo_slots(id),
  rule_type     TEXT,
  rule_value    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        INTEGER       NOT NULL DEFAULT nextval('orders_order_number_seq'),
  customer_id         UUID          REFERENCES customers(id),
  customer_name       TEXT          NOT NULL,
  customer_address_id UUID          REFERENCES customer_addresses(id),
  status              TEXT          NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'ready', 'completed', 'canceled')),
  total_amount        DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_paid             BOOLEAN       DEFAULT FALSE,
  payment_method      TEXT          NOT NULL DEFAULT 'cash',
  delivery_type       TEXT          DEFAULT 'pickup',
  delivery_fee        DECIMAL(10,2),
  delivery_time       TEXT,
  discount_type       TEXT          CHECK (discount_type IN ('amount', 'percentage', 'none')),
  discount_value      DECIMAL(10,2) DEFAULT 0,
  discount_amount     DECIMAL(10,2) DEFAULT 0,
  notes               TEXT,
  created_at          TIMESTAMPTZ   DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE order_items (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  burger_id      UUID          REFERENCES burgers(id),
  combo_id       UUID          REFERENCES combos(id),
  extra_id       UUID          REFERENCES extras(id),
  burger_name    TEXT          NOT NULL,
  quantity       INTEGER       NOT NULL DEFAULT 1,
  unit_price     DECIMAL(10,2) NOT NULL,
  subtotal       DECIMAL(10,2) NOT NULL,
  customizations TEXT,
  created_at     TIMESTAMPTZ   DEFAULT NOW()
);

-- ============================================
-- ORDER ITEM EXTRAS
-- ============================================
CREATE TABLE order_item_extras (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID          NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  extra_id      UUID          NOT NULL REFERENCES extras(id),
  extra_name    TEXT          NOT NULL,
  quantity      INTEGER       NOT NULL DEFAULT 1,
  unit_price    DECIMAL(10,2) NOT NULL,
  subtotal      DECIMAL(10,2) NOT NULL,
  created_at    TIMESTAMPTZ   DEFAULT NOW()
);

-- ============================================
-- EXTERNAL INCOME
-- ============================================
CREATE TABLE external_income (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  date        DATE          NOT NULL,
  amount      DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ   DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_item_extras_order_item_id ON order_item_extras(order_item_id);
CREATE INDEX idx_customer_addresses_customer_id ON customer_addresses(customer_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE customers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories          ENABLE ROW LEVEL SECURITY;
ALTER TABLE burgers             ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras              ENABLE ROW LEVEL SECURITY;
ALTER TABLE combos              ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_slots         ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_slots_rules   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_extras   ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_income     ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for internal dashboard)
CREATE POLICY "Allow all on customers"          ON customers          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on customer_addresses" ON customer_addresses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on categories"         ON categories         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on burgers"            ON burgers            FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on extras"             ON extras             FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on combos"             ON combos             FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on combo_slots"        ON combo_slots        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on combo_slots_rules"  ON combo_slots_rules  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on orders"             ON orders             FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on order_items"        ON order_items        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on order_item_extras"  ON order_item_extras  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on external_income"    ON external_income    FOR ALL USING (true) WITH CHECK (true);
