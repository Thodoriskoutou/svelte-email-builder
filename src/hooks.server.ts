import { redirect, type Handle } from '@sveltejs/kit'
import PocketBase from 'pocketbase'

const unprotectedPrefix = ['/login', '/register', '/auth' ]

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.pb = new PocketBase(Bun.env.POCKETBASE_URL ?? 'http://127.0.0.1:8090')
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
    try {
        event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh()
    } catch (_) {
        event.locals.pb.authStore.clear()
    }

    if (event.url.pathname === '/') {
        redirect(303, '/dashboard')
    }

	if (!unprotectedPrefix.some((path) => event.url.pathname.startsWith(path))) {
		const loggedIn = event.locals.pb.authStore.record
		if (!loggedIn) {
			redirect(303, '/login')
		}
	}

    const response = await resolve(event)
    response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie({ sameSite: 'Lax' }))
    return response
}