<script>
</script>

<h1>Admin</h1>

<form action="?/login" method="post">
	<label for="email">Email:</label>
	<input type="email" name="email" />
	<label for="password">Password:</label>
	<input type="password" name="password" />
	<select name="permissions">
		<option value="organizer">Organizer</option>
		<option value="dev">Dev Team</option>
		<option value="admin">Admin</option>
	</select>
	<button type="submit">Login</button>
</form>
