<script lang="ts">
import type {EditorRef, EmailEditor, EmailEditorProps } from "react-email-editor"
import EmailEdit from "$lib/EmailEdit.svelte"
import type { PageProps } from './$types'
import { enhance, applyAction } from '$app/forms'
import { goto } from '$app/navigation'

let { data }: PageProps = $props()
//let emailEditorRef = $state<EditorRef>()
let editor:any

const copyHtml = () => {
    editor.exportHtml((exportData) => {
        const { html } = exportData
        navigator.clipboard.writeText(html)
        // https://docs.unlayer.com/builder/export-html#inline-styles
    })
}

const onDesignLoad = (data: any) => {
    console.log('onDesignLoad', data);
};
const onLoad: EmailEditorProps['onLoad'] = (unlayer) => {
    
    console.log('onLoad', unlayer);
    editor = unlayer;
    unlayer.addEventListener('design:loaded', onDesignLoad);
    unlayer.loadDesign(data.template?.Content);
    
    unlayer?.registerCallback("image", async function (file , done) {
        done({ progress: 0 })

        const formData = new FormData()
        formData.set('templateId', data.template.id)
        formData.set('file', file.attachments[0])

        const res = await fetch('?/addImage', {
            method: 'POST',
            body: formData,
            headers: {
                'x-sveltekit-action': 'true'
            }
        })

        if(res.status === 200) {
            const response = await res.json()
            const imageFileName = JSON.parse(response.data).pop()
            done({ progress: 100, url: `${data.pb_url}/api/files/newsletters/${data.template.id}/${imageFileName}` })
        } else {
            alert(`Image ${file.attachments[0].name} could not be uploaded`)
        }
    })
}
</script>

<div class="Container">
    <div class="bar">
        <a href="/dashboard"><button>Back</button></a>
        <form method="POST" action="?/delete" use:enhance={({ cancel }) => {
            const confirmed = window.confirm("Are you sure you want to delete this template?")
            if (!confirmed) {
                cancel()
            }
            return async ({ result }) => {
                if (result.type === 'redirect') {
                    goto(result.location)
                } else {
                    await applyAction(result)
                }
            }
        }}
        >
            <input type="hidden" name="templateId" value={data.template.id} />
            <button>Delete template</button>
        </form>
        <button onclick={copyHtml}>Copy HTML</button>
        <form method="POST" action="?/save" use:enhance={async ({ formData }) => {
            await new Promise<void>((resolve) => {
                editor.exportHtml((exportData) => {
                    formData.set("content", JSON.stringify(exportData.design))
                    formData.set("html", exportData.html)
                    resolve() // Ensures `enhance` waits for exportHtml to finish
                })
            })
        }}>
            <input type="hidden" name="templateId" value={data.template.id} />
            <button>Save Design</button>        
        </form>
    </div>
    <EmailEdit onLoad={onLoad} options={{
        version: '1.157.0',
        appearance: {
            theme: "modern_light"
        }
    }}/>
</div>


<style>.Container {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100vh;
    background-color: #f7f8fa;
}

.bar {
    flex: 0 1 60px;
    background-color: #4CAF50; 
    color: #fff; 
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    max-height: 60px;
    border-bottom: 1px solid #ccc;
}

.bar button {
    padding: 10px 20px;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    background-color: #333; 
    color: #fff;
    border: none;
    border-radius: 5px;
    max-width: 150px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    text-align: center;
    flex-shrink: 0;
}

.bar button:hover {
    background-color: #555; 
    transform: translateY(-3px);
}

.bar button:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.7);
}

</style>