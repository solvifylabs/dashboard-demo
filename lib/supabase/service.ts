import { createClient as _createDemoClient } from "@/lib/demo/mock-supabase"

export function createServiceClient() {
  return _createDemoClient()
}
