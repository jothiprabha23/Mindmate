import User from "./schema"

async function create(name:string){
    const details=await User.create(name)
    return details.name
}

export default create