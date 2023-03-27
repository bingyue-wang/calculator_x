// create a simple calculator component

export default function Calculator({user}) {
    return (
        <div className="text-3xl font-bold underline">
            <h1>Calculator - {user.username}</h1>
        </div>
    )
}
