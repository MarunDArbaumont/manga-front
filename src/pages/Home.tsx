import LoginForm from "../components/LoginForm"
import Me from "../components/MyUsername"

function Home() {
    return(
        <>
            <h1>This is the home page</h1>
            <LoginForm></LoginForm>
            <Me></Me>
        </>
    )
}

export default Home