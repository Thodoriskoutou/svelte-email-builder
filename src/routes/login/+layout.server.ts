import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
    if (locals.user) {
        redirect(303, '/dashboard')
    }

    const auth = Bun.env.OAUTH2_PROVIDER ?? ''

    return {
        auth
    }
}