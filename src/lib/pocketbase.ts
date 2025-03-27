import PocketBase from 'pocketbase'

export function createInstance() {
  return new PocketBase(Bun.env.POCKETBASE_URL)
}

export const pb = createInstance()