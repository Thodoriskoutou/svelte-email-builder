import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    user: locals.pb.authStore.record,
    pb_url: Bun.env.POCKETBASE_URL
  }
}