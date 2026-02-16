type LoadingProps = {
    message?: string
}

function Loading({message="Loading..."}: LoadingProps) {
    return (
        <>
            <p>{message}</p>
        </>
    )
}

export default Loading