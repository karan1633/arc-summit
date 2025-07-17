

const splitToken = (mergedToken: string)=>{
    if (!mergedToken) {
        return;
    }
    const [  ,  token , uniqueKey] = mergedToken.split(' ')
    console.log({token, uniqueKey}, "split token")
    return { Authorization: `token ${token}`, "x-api-key": uniqueKey  };
} 

export default splitToken;