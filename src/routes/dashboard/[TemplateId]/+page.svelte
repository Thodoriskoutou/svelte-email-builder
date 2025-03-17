<script lang="ts">
import type {EditorRef, EmailEditor, EmailEditorProps } from "react-email-editor";
import EmailEdit from "$lib/EmailEdit.svelte";
import { pb } from "$lib/pocketbase";
import type { PageProps } from './$types';

let { data }: PageProps = $props();
let emailEditorRef = $state<EditorRef>()
let editor:any
let templateid = data.posts?.id;
let templateSubject = data.posts?.Subject

const exportHtml = () => {
    editor.exportHtml((data) => {
        const { design, html } = data;
        console.log('exportHtml', html);
        navigator.clipboard.writeText(html)
        alert('Output HTML has been logged in your developer console.');

        // https://docs.unlayer.com/builder/export-html#inline-styles
    });
};
const currentUser = pb.authStore.record;
const saveDesign = () => {
    editor.saveDesign(async (design) => {
        const data = {
            "Subject": templateSubject,
            "Updated_by": currentUser?.email,
            "Content": design
        };
        const record = await pb.collection('newsletters').update(`${templateid}`, data);
    })
}

const onLoad: EmailEditorProps['onLoad'] = (unlayer) => {
    console.log('onLoad', unlayer);
    editor = unlayer;
    unlayer.addEventListener('design:loaded', onDesignLoad);
    unlayer.loadDesign(data.posts?.Content);
};

const onDesignLoad = (data: any) => {
    console.log('onDesignLoad', data);
};

const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    console.log('onReady', unlayer);
};
async function deleteTemplate() {
    let confirmed = window.confirm("Are you sure you want to delete this template?")
    if (confirmed) {
        await pb.collection('newsletters').delete(data.posts?.id);
        window.location.href = '/dashboard';
    }
}


</script>


<div class="Container">
    <div class="bar">
        <button onclick={exportHtml} >Copy HTML</button>
        <button onclick={saveDesign} >Save Design</button>
        <a href="/dashboard"><button>Back</button></a>
        <button onclick={deleteTemplate} >Delete template</button>
    </div>
    <EmailEdit onReady={onReady} onLoad={onLoad} options={{
        version: "latest",
        appearance: {
            theme: "modern_light"
        }
    }}/>
</div>


<style>
    .Container{
        display: flex;
        flex-direction: column;
        position: relative;
        height: 100vh;
    }
    .bar{
        flex: 1;
        background-color: #61dafb;
        color: #000;
        padding: 10px;
        display: flex;
        max-height: 60px;

        button {
            flex: 1;
            padding: 10px;
            margin-left: 10px;
            font-size: 14px;
            font-weight: bold;
            background-color: #000;
            color: #fff;
            border: 0px;
            max-width: 150px;
            cursor: pointer;
        }

    }
</style>