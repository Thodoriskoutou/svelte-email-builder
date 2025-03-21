<script lang="ts">
import { goto } from "$app/navigation";
import {pb} from "$lib/pocketbase"
    $effect(()=>{
    if(!pb.authStore.record){
        goto("/login")
    }
})
</script>