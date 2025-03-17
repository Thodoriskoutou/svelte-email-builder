import PocketBase from 'pocketbase'

export function createInstance() {
  return new PocketBase('http://127.0.0.1:8090')
}

export const pb = createInstance()