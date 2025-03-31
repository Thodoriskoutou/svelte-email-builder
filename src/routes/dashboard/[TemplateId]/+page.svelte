<script lang="ts">
import type {EditorRef, EmailEditor, EmailEditorProps } from "react-email-editor"
import Icon from "@iconify/svelte/dist/Icon.svelte";
import EmailEdit from "$lib/EmailEdit.svelte"
import type { PageProps } from './$types'
import { enhance, applyAction } from '$app/forms'
import { goto } from '$app/navigation'

let { data }: PageProps = $props()
//let emailEditorRef = $state<EditorRef>()
let editor: any
let autosave: Timer
let lastSave = new Date()

$effect(() => {
    return () => {
        if(data.autosave !== null && data.autosave > 0) clearInterval(autosave);
    }
})

const copyHtml = () => {
    editor.exportHtml((exportData) => {
        const { html } = exportData
        navigator.clipboard.writeText(html)
        // https://docs.unlayer.com/builder/export-html#inline-styles
    })
}

const onLoad: EmailEditorProps['onLoad'] = (unlayer) => {
    editor = unlayer;
    unlayer.loadDesign(data.template?.Content)
    if(data.autosave !== null) {
        if(data.autosave > 0) {
            autosave = setInterval(function(){
                // @ts-expect-error
                document.querySelector('form#save button').click()
            }, data.autosave * 1000)
        } else {
            unlayer.addEventListener('design:updated', function () {
                // @ts-expect-error
                document.querySelector('form#save button').click()
            })
        }
    }
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
        <div>
            <a href="/dashboard"><button><Icon icon="material-symbols:keyboard-return-rounded"/>Back</button></a>
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
                <button><Icon icon="material-symbols:delete-outline-rounded"/>Delete template</button>
            </form>
            <button onclick={copyHtml}><Icon icon="material-symbols:content-copy-outline-rounded"/>Copy HTML</button>
            <form id="save" method="POST" action="?/save" use:enhance={async ({ formData, cancel }) => {
                if(data.autosave !== null) {
                    const now = new Date()
                    if(now.getTime() - lastSave.getTime() < 2000) { // 2 seconds minimum
                        cancel()
                    }
                }
                await new Promise<void>((resolve) => {
                    editor.exportHtml((exportData) => {
                        formData.set("content", JSON.stringify(exportData.design))
                        formData.set("html", exportData.html)
                        resolve() // Ensures `enhance` waits for exportHtml to finish
                    })
                })
                lastSave = new Date()
            }}>
                <input type="hidden" name="templateId" value={data.template.id} />
                <button><Icon icon="material-symbols:save-rounded"/>Save Design</button>      
            </form>
        </div>
        <h1>{data.template.Subject}</h1>
        <div>
            <button onclick={() => editor.undo()}><Icon icon="material-symbols:undo"/>Undo</button>
            <button onclick={() => editor.redo()}><Icon icon="material-symbols:redo-rounded"/>Redo</button>
        </div>
    </div>
    <EmailEdit onLoad={onLoad} options={{
        version: '1.157.0',
        designMode: 'edit', // enable for admins to lock down template sections
        editor: {
            autoSelectOnDrop: true,
            confirmOnDelete: false
        },
        features: {
            undoRedo: true,
            textEditor: {
                spellChecker: false,
                tables: true,
                cleanPaste: true
            }
        },
        devices: ['desktop', 'tablet', 'mobile'],
        displayMode: "email",
        env: {
            API_V1_BASE_URL: "http://127.0.0.1",
            API_V2_BASE_URL: "http://127.0.0.1",
            EVENTS_API_BASE_URL: "http://127.0.0.1",
            TOOLS_API_V1_BASE_URL: "http://127.0.0.1",
            TOOLS_CDN_BASE_URL: "http://127.0.0.1",
            CONSOLE_BASE_URL: "http://127.0.0.1"
        }
    }}/>
</div>

<style>
.Container {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100vh;
}

.bar {
    flex: 0 1 60px;
    background-color: #A8D5BA;
    color: #333333;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #80C78D;
}

.bar > div {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    max-height: 60px;
    gap: 10px;
}

.bar button {
    padding: 10px 20px;
    font-size: 15px;
    font-weight: bold;
    background-color: #6DBE45;
    color: #f1f1f1;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    text-align: center;
    text-wrap: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-shrink: 0;
}

.bar button:hover {
    background-color: #5CA539;
    transform: translateY(-3px);
}

.bar button:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(107, 190, 69, 0.7);
}


</style>