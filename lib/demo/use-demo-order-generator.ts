"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useDemoStore } from "./store"
import {
  BURGER_IDS, BURGER_NAMES, BURGER_PRICES,
  FRIES_IDS, FRIES_NAMES, FRIES_PRICES,
  DRINK_IDS, DRINK_NAMES, DRINK_PRICES,
  CUST_IDS, CUST_NAMES, CUST_ADDRS,
} from "./seed/orders"
import { formatCurrency } from "@/lib/utils/format"
import type { Order } from "@/lib/types"

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function buildLiveOrder(): Order {
  const { insertRow } = useDemoStore.getState()

  const ci = rnd(0, 14)
  const hasAddress = CUST_ADDRS[ci] !== null
  const isDelivery = hasAddress && Math.random() < 0.45
  const deliveryFee = isDelivery ? 2000 : 0

  let subtotal = 0

  const burgerPicks = Array.from({ length: rnd(1, 2) }, () => {
    const bi = rnd(0, 7)
    return { id: BURGER_IDS[bi], name: BURGER_NAMES[bi], price: BURGER_PRICES[bi] }
  })
  burgerPicks.forEach((b) => { subtotal += b.price })

  const friesIdx = Math.random() < 0.62 ? rnd(0, 3) : null
  if (friesIdx !== null) subtotal += FRIES_PRICES[friesIdx]

  const drinkIdx = Math.random() < 0.50 ? rnd(0, 3) : null
  if (drinkIdx !== null) subtotal += DRINK_PRICES[drinkIdx]

  const orderRow = insertRow("orders", {
    customer_id:         CUST_IDS[ci],
    customer_name:       CUST_NAMES[ci],
    customer_address_id: isDelivery ? CUST_ADDRS[ci] : null,
    status:              "new",
    is_paid:             false,
    total_amount:        subtotal + deliveryFee,
    delivery_type:       isDelivery ? "delivery" : "pickup",
    delivery_fee:        deliveryFee,
    payment_method:      Math.random() < 0.6 ? "cash" : "transfer",
    delivery_time:       (() => {
      const d = new Date()
      d.setMinutes(d.getMinutes() + rnd(25, 75))
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
    })(),
    discount_type:       "none",
    discount_value:      0,
    discount_amount:     0,
    notes:               null,
  }) as unknown as Order

  for (const b of burgerPicks) {
    insertRow("order_items", {
      order_id:      orderRow.id,
      burger_id:     b.id,
      combo_id:      null,
      burger_name:   b.name,
      quantity:      1,
      unit_price:    b.price,
      subtotal:      b.price,
      customizations: null,
    })
  }
  if (friesIdx !== null) {
    insertRow("order_items", {
      order_id:      orderRow.id,
      burger_id:     null,
      combo_id:      null,
      burger_name:   FRIES_NAMES[friesIdx],
      quantity:      1,
      unit_price:    FRIES_PRICES[friesIdx],
      subtotal:      FRIES_PRICES[friesIdx],
      customizations: null,
    })
  }
  if (drinkIdx !== null) {
    insertRow("order_items", {
      order_id:      orderRow.id,
      burger_id:     null,
      combo_id:      null,
      burger_name:   DRINK_NAMES[drinkIdx],
      quantity:      1,
      unit_price:    DRINK_PRICES[drinkIdx],
      subtotal:      DRINK_PRICES[drinkIdx],
      customizations: null,
    })
  }

  return orderRow
}

export function useDemoOrderGenerator() {
  const queryClient = useQueryClient()
  const generatorEnabled = useDemoStore((s) => s.generatorEnabled)

  useEffect(() => {
    if (!generatorEnabled) return

    let timer: ReturnType<typeof setTimeout>

    const schedule = () => {
      const delay = 45_000 + Math.random() * 30_000
      timer = setTimeout(() => {
        const order = buildLiveOrder()
        queryClient.setQueryData<Order[]>(["orders"], (old) =>
          old ? [...old, order] : [order]
        )
        toast("🔔 Nuevo pedido", {
          description: `#${order.order_number} · ${order.customer_name} · ${formatCurrency(order.total_amount)}`,
          duration: 6000,
        })
        schedule()
      }, delay)
    }

    schedule()
    return () => clearTimeout(timer)
  }, [generatorEnabled, queryClient])
}
