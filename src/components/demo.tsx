import { createContext, useContext, useState } from "react"


const context = createContext({
    count: 0,
    setCount: (_: any)=>{}
})


function RedComponent(){
    const { count, setCount} = useContext(context)
    return <>
        <button onClick={()=>setCount(count + 1)} className="btn btn-primary">
            { count }
        </button>
    </>
}

function BlackComponent(){
    return <>
        <RedComponent />
    </>
}

export function RootComponent(){
    const [count, setCount] = useState(0)

    return <>
        <context.Provider value={{count, setCount}}>
            <BlackComponent />
            <BlackComponent  />
        </context.Provider>
    </>
}