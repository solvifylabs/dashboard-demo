-- ============================================================
-- 003-seed-orders.sql
-- 600 pedidos entre 2026-03-01 y 2026-04-26
-- 8 pedidos el día de hoy (2026-04-27)
-- Usa los clientes y productos del 002-seed-data.sql
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

DO $$
DECLARE
  -- Clientes existentes
  v_cust_ids    UUID[] := ARRAY[
    'c0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000008'
  ]::UUID[];

  v_cust_names  TEXT[] := ARRAY[
    'Martín Rodríguez', 'Lucía Fernández', 'Sebastián Torres',
    'Valentina López',  'Gonzalo Méndez',  'Carolina Sánchez',
    'Diego Herrera',    'Florencia Castro'
  ];

  -- Dirección por defecto de cada cliente (NULL = sin dirección)
  v_cust_addrs  UUID[] := ARRAY[
    'ca000000-0000-0000-0000-000000000001', -- Martín
    'ca000000-0000-0000-0000-000000000002', -- Lucía
    'ca000000-0000-0000-0000-000000000004', -- Sebastián
    'ca000000-0000-0000-0000-000000000005', -- Valentina
    'ca000000-0000-0000-0000-000000000006', -- Gonzalo
    'ca000000-0000-0000-0000-000000000007', -- Carolina
    'ca000000-0000-0000-0000-000000000008', -- Diego
    NULL                                     -- Florencia (sin dirección)
  ]::UUID[];

  -- Hamburguesas existentes
  v_burg_ids    UUID[] := ARRAY[
    'b1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000005',
    'b1000000-0000-0000-0000-000000000006',
    'b1000000-0000-0000-0000-000000000007',
    'b1000000-0000-0000-0000-000000000008'
  ]::UUID[];

  v_burg_names  TEXT[] := ARRAY[
    'Clásica', 'Cheese', 'Bacon', 'BBQ',
    'Doble Clásica', 'Doble Cheese Bacon', 'Crispy Chicken', 'Veggie'
  ];

  v_burg_prices DECIMAL[] := ARRAY[
    3500, 3900, 4500, 4200, 5500, 6500, 4000, 3800
  ];

  -- Bebidas
  v_drink_ids   UUID[] := ARRAY[
    'e1000000-0000-0000-0000-000000000010',
    'e1000000-0000-0000-0000-000000000011',
    'e1000000-0000-0000-0000-000000000012',
    'e1000000-0000-0000-0000-000000000016'
  ]::UUID[];

  v_drink_names  TEXT[]    := ARRAY['Coca-Cola 500ml', 'Sprite 500ml', 'Fanta 500ml', 'Limonada'];
  v_drink_prices DECIMAL[] := ARRAY[1000, 1000, 1000, 1100];

  -- Papas / fries
  v_fries_ids   UUID[] := ARRAY[
    'e1000000-0000-0000-0000-000000000020',
    'e1000000-0000-0000-0000-000000000021',
    'e1000000-0000-0000-0000-000000000022',
    'e1000000-0000-0000-0000-000000000024'
  ]::UUID[];

  v_fries_names  TEXT[]    := ARRAY['Papas fritas chicas', 'Papas fritas grandes', 'Papas con cheddar', 'Papas rústicas'];
  v_fries_prices DECIMAL[] := ARRAY[1200, 1800, 2200, 2000];

  -- Extras de hamburguesa
  v_ext_ids   UUID[] := ARRAY[
    'e1000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000002',
    'e1000000-0000-0000-0000-000000000003',
    'e1000000-0000-0000-0000-000000000004',
    'e1000000-0000-0000-0000-000000000005'
  ]::UUID[];

  v_ext_names  TEXT[]    := ARRAY['Queso cheddar extra', 'Panceta', 'Huevo frito', 'Cebolla caramelizada', 'Jalapeños'];
  v_ext_prices DECIMAL[] := ARRAY[500, 700, 400, 350, 300];

  -- Variables de trabajo
  v_order_id   UUID;
  v_item_id    UUID;
  v_ci         INT;
  v_bi         INT;
  v_di         INT;
  v_fi         INT;
  v_ei         INT;
  v_order_date TIMESTAMPTZ;
  v_delivery   TEXT;
  v_payment    TEXT;
  v_status     TEXT;
  v_total      DECIMAL;
  v_n_burgers  INT;
  v_rnd        FLOAT;
  v_fee        DECIMAL;
  v_disc_type  TEXT;
  v_disc_val   DECIMAL;
  v_disc_amt   DECIMAL;
  v_addr_id    UUID;
  v_item_price DECIMAL;
BEGIN

  -- ============================================================
  -- PARTE 1: 600 pedidos históricos (2026-03-01 → 2026-04-26)
  -- ============================================================
  FOR v_loop IN 1..600 LOOP

    v_order_id   := gen_random_uuid();
    v_ci         := floor(random() * 8)::INT + 1;

    -- Fecha aleatoria uniforme dentro del rango
    v_order_date := TIMESTAMPTZ '2026-03-01 10:00:00-03'
                  + (random() * EXTRACT(EPOCH FROM (
                      TIMESTAMPTZ '2026-04-26 22:30:00-03'
                    - TIMESTAMPTZ '2026-03-01 10:00:00-03'
                    ))) * INTERVAL '1 second';

    -- Estado: 90 % completado, 10 % cancelado
    v_status := CASE WHEN random() < 0.10 THEN 'canceled' ELSE 'completed' END;

    -- Tipo de entrega: 58 % pickup, 42 % delivery
    IF random() < 0.58 THEN
      v_delivery := 'pickup';
      v_fee      := 0;
      v_addr_id  := NULL;
    ELSE
      v_delivery := 'delivery';
      v_fee      := 800;
      v_addr_id  := v_cust_addrs[v_ci];
    END IF;

    -- Método de pago
    v_rnd := random();
    v_payment := CASE
      WHEN v_rnd < 0.50 THEN 'cash'
      WHEN v_rnd < 0.82 THEN 'transfer'
      ELSE 'card'
    END;

    -- Descuento (15 % de los pedidos)
    v_rnd := random();
    IF v_rnd < 0.10 THEN
      v_disc_type := 'percentage';
      v_disc_val  := (floor(random() * 3) + 1) * 5;  -- 5 %, 10 % o 15 %
    ELSIF v_rnd < 0.15 THEN
      v_disc_type := 'amount';
      v_disc_val  := (floor(random() * 4) + 1) * 500; -- $500, $1000, $1500, $2000
    ELSE
      v_disc_type := 'none';
      v_disc_val  := 0;
    END IF;

    -- Cantidad de hamburguesas: 35 % → 1, 45 % → 2, 20 % → 3
    v_rnd := random();
    v_n_burgers := CASE
      WHEN v_rnd < 0.35 THEN 1
      WHEN v_rnd < 0.80 THEN 2
      ELSE 3
    END;

    v_total := 0;

    -- Insertar orden (total = 0, se actualiza al final)
    INSERT INTO orders (
      id, customer_id, customer_name, customer_address_id,
      status, total_amount, is_paid,
      payment_method, delivery_type, delivery_fee,
      discount_type, discount_value, discount_amount,
      created_at, updated_at
    ) VALUES (
      v_order_id,
      v_cust_ids[v_ci], v_cust_names[v_ci], v_addr_id,
      v_status, 0,
      CASE WHEN v_status = 'completed' THEN true ELSE false END,
      v_payment, v_delivery, v_fee,
      v_disc_type, v_disc_val, 0,
      v_order_date, v_order_date
    );

    -- Items de hamburguesa
    FOR v_j IN 1..v_n_burgers LOOP
      v_item_id    := gen_random_uuid();
      v_bi         := floor(random() * 8)::INT + 1;
      v_item_price := v_burg_prices[v_bi];
      v_total      := v_total + v_item_price;

      INSERT INTO order_items (
        id, order_id, burger_id, burger_name,
        quantity, unit_price, subtotal, customizations
      ) VALUES (
        v_item_id, v_order_id, v_burg_ids[v_bi], v_burg_names[v_bi],
        1, v_item_price, v_item_price, NULL
      );

      -- 22 % de probabilidad de extra en esta hamburguesa
      IF random() < 0.22 THEN
        v_ei    := floor(random() * 5)::INT + 1;
        v_total := v_total + v_ext_prices[v_ei];
        INSERT INTO order_item_extras (
          order_item_id, extra_id, extra_name,
          quantity, unit_price, subtotal
        ) VALUES (
          v_item_id, v_ext_ids[v_ei], v_ext_names[v_ei],
          1, v_ext_prices[v_ei], v_ext_prices[v_ei]
        );
      END IF;
    END LOOP;

    -- 63 % de probabilidad de papas
    IF random() < 0.63 THEN
      v_fi    := floor(random() * 4)::INT + 1;
      v_total := v_total + v_fries_prices[v_fi];
      INSERT INTO order_items (
        id, order_id, burger_id, burger_name,
        quantity, unit_price, subtotal, customizations
      ) VALUES (
        gen_random_uuid(), v_order_id, NULL, v_fries_names[v_fi],
        1, v_fries_prices[v_fi], v_fries_prices[v_fi], NULL
      );
    END IF;

    -- 48 % de probabilidad de bebida
    IF random() < 0.48 THEN
      v_di    := floor(random() * 4)::INT + 1;
      v_total := v_total + v_drink_prices[v_di];
      INSERT INTO order_items (
        id, order_id, burger_id, burger_name,
        quantity, unit_price, subtotal, customizations
      ) VALUES (
        gen_random_uuid(), v_order_id, NULL, v_drink_names[v_di],
        1, v_drink_prices[v_di], v_drink_prices[v_di], NULL
      );
    END IF;

    -- Calcular descuento y total final
    v_disc_amt := CASE
      WHEN v_disc_type = 'none'       THEN 0
      WHEN v_disc_type = 'amount'     THEN LEAST(v_disc_val, v_total)
      WHEN v_disc_type = 'percentage' THEN ROUND(v_total * v_disc_val / 100.0, 2)
      ELSE 0
    END;

    v_total := GREATEST(v_total - v_disc_amt + v_fee, 0);

    UPDATE orders
    SET total_amount = v_total, discount_amount = v_disc_amt
    WHERE id = v_order_id;

  END LOOP;


  -- ============================================================
  -- PARTE 2: 8 pedidos de hoy (2026-04-27)
  -- 2 new → 2 ready → 4 completed
  -- Horarios distribuidos entre 11:00 y 21:30
  -- ============================================================
  FOR v_loop IN 1..8 LOOP

    v_order_id   := gen_random_uuid();
    v_ci         := floor(random() * 8)::INT + 1;

    -- Hora: cada pedido separado ~75 min + jitter de ±15 min
    v_order_date := TIMESTAMPTZ '2026-04-27 11:00:00-03'
                  + ((v_loop - 1) * INTERVAL '75 minutes')
                  + (random() * INTERVAL '20 minutes');

    -- Primeros 2 → new, siguientes 2 → ready, resto → completed
    v_status := CASE
      WHEN v_loop <= 2 THEN 'new'
      WHEN v_loop <= 4 THEN 'ready'
      ELSE 'completed'
    END;

    IF random() < 0.62 THEN
      v_delivery := 'pickup';
      v_fee      := 0;
      v_addr_id  := NULL;
    ELSE
      v_delivery := 'delivery';
      v_fee      := 800;
      v_addr_id  := v_cust_addrs[v_ci];
    END IF;

    v_rnd := random();
    v_payment := CASE
      WHEN v_rnd < 0.50 THEN 'cash'
      WHEN v_rnd < 0.82 THEN 'transfer'
      ELSE 'card'
    END;

    v_disc_type := 'none';
    v_disc_val  := 0;
    v_disc_amt  := 0;

    v_n_burgers := floor(random() * 2)::INT + 1; -- 1 o 2
    v_total     := 0;

    INSERT INTO orders (
      id, customer_id, customer_name, customer_address_id,
      status, total_amount, is_paid,
      payment_method, delivery_type, delivery_fee,
      discount_type, discount_value, discount_amount,
      created_at, updated_at
    ) VALUES (
      v_order_id,
      v_cust_ids[v_ci], v_cust_names[v_ci], v_addr_id,
      v_status, 0,
      CASE WHEN v_status = 'completed' THEN true ELSE false END,
      v_payment, v_delivery, v_fee,
      v_disc_type, v_disc_val, 0,
      v_order_date, v_order_date
    );

    FOR v_j IN 1..v_n_burgers LOOP
      v_item_id    := gen_random_uuid();
      v_bi         := floor(random() * 8)::INT + 1;
      v_item_price := v_burg_prices[v_bi];
      v_total      := v_total + v_item_price;

      INSERT INTO order_items (
        id, order_id, burger_id, burger_name,
        quantity, unit_price, subtotal, customizations
      ) VALUES (
        v_item_id, v_order_id, v_burg_ids[v_bi], v_burg_names[v_bi],
        1, v_item_price, v_item_price, NULL
      );
    END LOOP;

    IF random() < 0.70 THEN
      v_fi    := floor(random() * 4)::INT + 1;
      v_total := v_total + v_fries_prices[v_fi];
      INSERT INTO order_items (
        id, order_id, burger_id, burger_name,
        quantity, unit_price, subtotal, customizations
      ) VALUES (
        gen_random_uuid(), v_order_id, NULL, v_fries_names[v_fi],
        1, v_fries_prices[v_fi], v_fries_prices[v_fi], NULL
      );
    END IF;

    IF random() < 0.60 THEN
      v_di    := floor(random() * 4)::INT + 1;
      v_total := v_total + v_drink_prices[v_di];
      INSERT INTO order_items (
        id, order_id, burger_id, burger_name,
        quantity, unit_price, subtotal, customizations
      ) VALUES (
        gen_random_uuid(), v_order_id, NULL, v_drink_names[v_di],
        1, v_drink_prices[v_di], v_drink_prices[v_di], NULL
      );
    END IF;

    v_total := v_total + v_fee;

    UPDATE orders
    SET total_amount = v_total
    WHERE id = v_order_id;

  END LOOP;

END $$;
