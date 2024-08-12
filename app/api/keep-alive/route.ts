import { db } from "@/lib/db"

export async function GET() {
  try {
    await db.account.count()
    return new Response("alive")
  } catch (error) {
    return new Response(error)
  }
}
