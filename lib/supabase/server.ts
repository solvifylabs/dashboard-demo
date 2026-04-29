import { createClient as _createDemoClient } from "@/lib/demo/mock-supabase"

export async function createClient() {
  return _createDemoClient()
}
