function LoginForm() {
    return (
        <>
        <form action="POST">
            <label>
                Username:
                <input type="text" name="username" />
            </label>
            <label>
                Password:
                <input type="password" name="password" />
            </label>
            <input type="submit" value="Submit" />
        </form>
        </>
    )
}

export default LoginForm