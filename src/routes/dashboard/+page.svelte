<script lang="ts">
import type { PageProps } from './$types'
import { enhance, applyAction } from '$app/forms'
import { goto } from '$app/navigation'
import Icon from "@iconify/svelte/dist/Icon.svelte";
import type { Editor, EmailEditorProps } from 'react-email-editor';
let { data }: PageProps = $props()
let editor: Editor
let locale: Intl.DateTimeFormat = $state(new Intl.DateTimeFormat('en-US', {
    dateStyle: "short",
    timeStyle: "short",
}))

let renameIndex = $state(null);

let deleteIndex = $state(null)

function deletetemplate(templateId){
    deleteIndex = deleteIndex === templateId ? null : templateId;
}

$effect(()=>{
    locale = new Intl.DateTimeFormat(data.user.locale, {
        dateStyle: "short",
        timeStyle: "short",
    })
    
})

</script>

<section class="welcome-message">
    <h1>Welcome to the Email Builder!</h1>
    <div class="input-button-group">
        <form method="POST" action="?/create" use:enhance={() => {
            return async ({ result, update }) => {
                if (result.type === 'success') {
                    await update()
                } else {
                    await applyAction(result)
                }
		    }
        }}>
            <input 
                type="text" 
                placeholder="Enter subject..." 
                name="subject"
                class="subject-input"
                required
            />
            <button class="create-template-btn"><span class="create">Create Template<Icon icon="material-symbols:add"/></span></button>
        </form>
        <form method="POST" action="?/logout" use:enhance={() => {
            return async ({ result }) => {
                if (result.type === 'redirect') {
                    goto(result.location, { invalidateAll: true })
                } else {
                    await applyAction(result)
                }
            }
        }}>
            <button class="logout-btn"><span class="create">Logout<Icon icon="material-symbols:logout"/></span></button>
        </form>
    </div>
</section>
<ul class="newsletter-list">
{#each data.templates as template,index}
        <li class="newsletter-item">
            <a href="/dashboard/{template.id}">
            {#if template.Preview}
                <img src={template.thumbnail} alt={template.Subject} />
            {:else}
                <div class="placeholder">Unsaved</div>
            {/if}
            <h2 class="newsletter-title">{template.Subject}</h2>
            <p class="newsletter-date">Created At: {locale.format(new Date(Date.UTC(...template.Created_at.split(/-|\s|:|\.|Z/g).slice(0,7).map((a, i) => (i===1)? parseInt(a)-1 : parseInt(a)))))}</p>
            <p class="newsletter-author">Created By: {template.Created_by}</p>
            {#if template.Updated_at}
                <p class="newsletter-author">Updated By: {template.Updated_by}</p>
                <p class="newsletter-author">Updated At: {locale.format(new Date(Date.UTC(...template.Updated_at.split(/-|\s|:|\.|Z/g).slice(0,7).map((a, i) => (i===1)? parseInt(a)-1 : parseInt(a)))))}</p>
            {/if}
        </a>
        <div style="display:flex">
            <button onclick={() => renameIndex = template.id}>Rename</button>
            <form method="POST" action="?/delete" use:enhance={({ cancel }) => {
                const confirmed = window.confirm("Are you sure you want to delete this template?")
                if (!confirmed) {
                    cancel()
                }
                return async ({ result,update }) => {
                    if (result.type === 'success') {
                        await update()
                    } else {
                        await applyAction(result)
                    }
                }
            }}
            >
                <button onclick={() => deletetemplate(template.id)}>Delete</button>
                <input type="hidden" name="templateId" value={template.id} />
            </form>
            <form method="POST" action="?/clone" use:enhance>
                <button>Clone</button>
                <input type="hidden" name="templateId" value={template.id} />
            </form>
        </div>
        {#if renameIndex === template.id}
            <div>
                <form method="POST" action="?/rename" use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            await update()
                        } else {
                            await applyAction(result)
                        }
                        renameIndex = null
                    }
                }}>
                    <input type="text" name="rename" id="rename" placeholder="Enter new name">
                    <input type="hidden" name="templateId" value={template.id} />
                    <button>Submit</button>
                </form>
            </div>
        {/if}
        </li>

    
{:else}
    <li>No newsletters available.</li>
{/each}
</ul>


<style>
.welcome-message {
    background-color: #f5fff5;
    padding: 2rem;
    border-radius: 10px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    animation: fadeIn 0.8s ease-out;
}

h1 {
    color: #2e7d32;
    margin-bottom: 1.5rem;
    font-size: 2.5rem;
    animation: slideInFromLeft 0.8s ease-out;
}

.input-button-group {
    display: flex;
    gap: 1rem;
    align-items: center;
}
.create{
    display: flex;
    gap: 0.2rem;
    align-items: center;
}
.subject-input {
    padding: 0.8rem;
    border: 2px solid #c8e6c9;
    border-radius: 5px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.subject-input:focus {
    outline: none;
    border-color: #66bb6a;
    box-shadow: 0 0 0 2px #a5d6a7;
}

button {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.create-template-btn {
    background-color: #66bb6a;
    color: white;
    animation: bounceIn 0.8s ease-out;
}

.create-template-btn:hover {
    background-color: #4caf50;
    transform: scale(1.05);
}

.logout-btn {
    background-color: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #c8e6c9;
    animation: bounceIn 0.8s ease-out 0.2s;
}

.logout-btn:hover {
    background-color: #c8e6c9;
    transform: scale(1.05);
}

.newsletter-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 0;
}

.newsletter-item {
    background: white;
    border-radius: 10px;
    padding: 1.5rem;
    list-style: none;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #e0f2e9;
    animation: fadeInUp 0.6s ease-out;
}

.newsletter-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.newsletter-title {
    color: #1b5e20;
    margin: 1rem 0;
    font-size: 1.2rem;
}

.newsletter-date, .newsletter-author {
    color: #666;
    font-size: 0.9rem;
    margin: 0.3rem 0;
}

img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 5px;
    margin-bottom: 1rem;
    animation: scaleIn 0.6s ease-out;
}

.placeholder {
    background-color: #e8f5e9;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #66bb6a;
    font-weight: bold;
    border-radius: 5px;
    animation: fadeIn 0.8s ease-out;
}

a {
    text-decoration: none;
    color: inherit;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideInFromLeft {
    from {
        transform: translateX(-20px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes bounceIn {
    0% {
        transform: scale(0.8);
        opacity: 0;
    }
    50% {
        transform: scale(1.1);
        opacity: 1;
    }
    100% {
        transform: scale(1);
    }
}

@keyframes fadeInUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes scaleIn {
    from {
        transform: scale(0.9);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
