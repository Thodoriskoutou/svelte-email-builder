<script lang="ts">
import { createElement } from "react";
import { createRoot } from 'react-dom/client'
import { EmailEditor, type EmailEditorProps } from "react-email-editor";


let rootEl: HTMLElement
let props:EmailEditorProps = $props()



$effect(()=>{
    const root = createRoot(rootEl)
    import('react-email-editor').then(({ EmailEditor })=>{
        const editor = createElement(EmailEditor,{...props},
        )
        root.render(editor)
    })


    return () => root.unmount()
})

</script>

<div class="wrapper" bind:this={rootEl}></div>


<style>
    .wrapper{
        display: flex;
        flex-grow: 1;
    }
</style>