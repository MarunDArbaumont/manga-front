type ErrorProps = {
    message?: string
}

function ErrorMessage({message="Unknown error"}: ErrorProps) {
    return (
        <>
            <p>Error: {message}</p>
        </>
    )
}

export default ErrorMessage