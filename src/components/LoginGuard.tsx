import { useNavigate } from "react-router"
import { useUser } from "../hooks/pb.context"
import { PropsWithChildren } from "react"




export default function LoginGuard({ children }: PropsWithChildren){
    const { loading, user } = useUser()
    const navigate = useNavigate()
    if(loading){
        return <div>
            <div className="spinner spinner-lg"></div>
        </div>
    }else if(!user){
        navigate("/login")
    }else{
        return children
    }
    
}