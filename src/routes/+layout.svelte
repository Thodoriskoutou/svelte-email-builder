<script lang="ts">
import '../app.css'

import { browser } from '$app/environment'
import { setUserContext } from '$lib/contexts/user'
import  { onDestroy,type Snippet } from 'svelte'
import type { LayoutData } from './$types'
import { pb } from '$lib/pocketbase'
import { writable } from 'svelte/store'


let { data, children }: { data: LayoutData, children: Snippet } = $props()


const user = writable(data.user)
setUserContext(user)

if (browser) {
    pb.authStore.loadFromCookie(document.cookie)

    const unsubscribe = pb.authStore.onChange(() => {
        user.set(pb.authStore.record)
        document.cookie = pb.authStore.exportToCookie({ httpOnly: false })
    }, true)
    onDestroy(unsubscribe)
}
</script>


<main >
    {@render children()}
</main>