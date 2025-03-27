import { type Handle } from '@sveltejs/kit'
import PocketBase from 'pocketbase'

function redirect(location: string, body?: string) {
	return new Response(body, {
		status: 303,
		headers: { location }
	});
}

export const handle: Handle = async ({ event, resolve }) => {
    const pb = new PocketBase(Bun.env.POCKETBASE_URL ?? 'http://127.0.0.1:8090')
    pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
    try {
        if (pb.authStore.isValid) {
            await pb.collection('users').authRefresh()
        } else {
            if (!event.url.pathname.startsWith('/login')) {
                return redirect('/login')
            }
        }
    } catch (_) {
        pb.authStore.clear()
    }

    if (event.url.pathname.length < 2) {
        return redirect('/dashboard')
    }

    event.locals.pb = pb
    event.locals.user = pb.authStore.record

    const response = await resolve(event)

    response.headers.set(
        'set-cookie',
        pb.authStore.exportToCookie({ httpOnly: false }),
    )

    return response
}