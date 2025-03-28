import type { PageServerLoad, Actions } from './$types'
import { redirect } from '@sveltejs/kit'

export const actions = {
	logout: async ({locals}) => {
		locals.pb.authStore.clear()
		locals.user = null

        return redirect(302, '/login')
	}
} satisfies Actions;

