<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<p>
	{#if $page.data.session}
		{#if $page.data.session.user?.image}
			<span style="background-image: url('{$page.data.session.user.image}')" class="avatar"></span>
		{/if}
		<span class="signInBox">
			<small>Signed in as</small><br />
			<span class="signInBox__tag">
				<button on:click="{() => signOut()}" class="button">Sign out</button>
				<strong class="signInBox__name">{$page.data.session.user?.name ?? 'User'}</strong>
				<img src="{$page.data.session.user?.image}" alt="user" />
			</span>
		</span>
	{:else}
		<span class="signInBox">
			<span>You are not signed in</span>
			<button on:click="{() => signIn('google')}">Sign In with Google</button>
		</span>
	{/if}
</p>

<style lang="scss">
	.signInBox {
		display: flex;
		position: fixed;
		flex-direction: column;
		top: 0;
		right: 20px;
		small {
			position: absolute;
		}
		&__tag {
			display: flex;
			align-items: center;
			gap: 10px;
			img {
				width: 65px;
				height: 65px;
				border-radius: 50%;
				border: 3px solid black;
			}
		}
	}
</style>
