<script lang="ts">
import { applyAction, enhance } from '$app/forms'
import type { PageProps } from '../$types'
import PocketBase from 'pocketbase'

let { data }: PageProps = $props()

const pb = new PocketBase(data.pb_url)

$effect(async()=>{
    if(data.auth){
        await pb.collection('users').authWithOAuth2({ provider: data.auth });
    }
})
</script>

<div class="wrapper">
    <div class="container">
        <div class="heading">Log In</div>
        <form class="form" 
        method="POST"
        use:enhance={() => {
            return async ({ result }) => {
                pb.authStore.loadFromCookie(document.cookie)
                await applyAction(result)
            }
        }}
        >
            <input required class="input" type="email" name="email" id="email" placeholder="E-mail" >
            <input required class="input" type="password" name="password" id="password" placeholder="Password" > 
            <input class="login-button" type="submit" value="Sign In">
        </form>
    </div>
</div>

<style>
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container {
    max-width: 350px;
    background: #E8F9E9;
    background: linear-gradient(0deg, rgb(233, 248, 233) 0%, rgb(204, 236, 204) 100%);
    border-radius: 40px;
    padding: 25px 35px;
    border: 5px solid rgb(255, 255, 255);
    box-shadow: rgba(144, 211, 144, 0.8) 0px 30px 30px -20px;
    margin: 20px;
}

.heading {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    color: rgb(34, 139, 34);
}

.form {
    margin-top: 20px;
}

.form .input {
    width: 100%;
    background: white;
    border: none;
    padding: 15px 20px;
    border-radius: 20px;
    margin-top: 15px;
    box-shadow: #d6f8d6 0px 10px 10px -5px;
    border-inline: 2px solid transparent;
}

.form .input::-moz-placeholder {
    color: rgb(102, 153, 102);
}

.form .input::placeholder {
    color: rgb(102, 153, 102); 
}

.form .input:focus {
    outline: none;
    border-inline: 2px solid #32CD32;
}


.form .login-button {
    display: block;
    width: 100%;
    font-weight: bold;
    background: linear-gradient(45deg, rgb(34, 139, 34) 0%, rgb(50, 205, 50) 100%); 
    color: white;
    padding-block: 15px;
    margin: 20px auto;
    border-radius: 20px;
    box-shadow: rgba(144, 211, 144, 0.8) 0px 20px 10px -15px;
    border: none;
    transition: all 0.2s ease-in-out;
}

.form .login-button:hover {
    transform: scale(1.03);
    box-shadow: rgba(144, 211, 144, 0.8) 0px 23px 10px -20px;
}

.form .login-button:active {
    transform: scale(0.95);
    box-shadow: rgba(144, 211, 144, 0.8) 0px 15px 10px -10px;
}
</style>
