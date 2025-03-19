<script lang="ts">
import type {EditorRef, EmailEditor, EmailEditorProps } from "react-email-editor";
import EmailEdit from "$lib/EmailEdit.svelte";
import { pb } from "$lib/pocketbase";
import type { PageProps } from './$types';

let { data }: PageProps = $props();
//let emailEditorRef = $state<EditorRef>()
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
    alert("Design saved")
}
const onDesignLoad = (data: any) => {
    console.log('onDesignLoad', data);
};
const onLoad: EmailEditorProps['onLoad'] = (unlayer) => {
    
    console.log('onLoad', unlayer);
    editor = unlayer;
    unlayer.addEventListener('design:loaded', onDesignLoad);
    unlayer.loadDesign(data.posts?.Content);
    
    unlayer?.registerCallback("image", async function (file , done) {
        done({ progress: 0})
        console.log(file)

        pb.collection('newsletters').update(templateid, {
            "Images+": file.attachments[0]
        })
        .then((updatedRecord) => {
            const images = updatedRecord.Images;
            const newImage = images[images.length - 1];
            const imageUrl = `http://127.0.0.1:8090/api/files/newsletters/${templateid}/${newImage}`
            done({ progress: 100, url: imageUrl });
        })
        

    })
};

const onReady: EmailEditorProps['onReady'] = async (unlayer) => {
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
    background-color: #333; /* Changed to dark gray */
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
    background-color: #555; /* Lighter gray on hover */
    transform: translateY(-3px);
}

.bar button:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.7);
}

</style>