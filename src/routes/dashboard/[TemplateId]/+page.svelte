<script lang="ts">
import type {EditorRef, EmailEditor, EmailEditorProps } from "react-email-editor"
import EmailEdit from "$lib/EmailEdit.svelte"
import type { PageProps } from './$types'
import { enhance, applyAction } from '$app/forms'
import { goto } from '$app/navigation'

let { data }: PageProps = $props()
//let emailEditorRef = $state<EditorRef>()
let editor: any
let autosave: Timer

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
                document.querySelector('form#save').submit()
            }, data.autosave * 1000)
        } else {
            let lastAutoSave = new Date()
            unlayer.addEventListener('design:updated', function () {
                const now = new Date()
                if(now.getTime() - lastAutoSave.getTime() > 5000) { // 5 seconds minimum
                    lastAutoSave = now
                    // @ts-expect-error
                    document.querySelector('form#save').submit()
                }
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
            <form id="save" method="POST" action="?/save" use:enhance={async ({ formData }) => {
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
        <h1>{data.template.Subject}</h1>
        <div>
            <button onclick={() => editor.undo()}>Undo</button>
            <button onclick={() => editor.redo()}>Redo</button>
        </div>
    </div>
    <EmailEdit onLoad={onLoad} options={{
        version: '1.157.0',
        // designMode: 'edit', // enable for admins to lock down template sections
        editor: {
            autoSelectOnDrop: true,
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
    background-color: #f7f8fa;
}

.bar {
    flex: 0 1 60px;
    background-color: #4CAF50;
    color: #fff; 
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
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