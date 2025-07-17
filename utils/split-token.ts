

const splitToken = (mergedToken: string)=>{
    if (!mergedToken) {
        return;
    }
    const [  ,  token , uniqueKey] = mergedToken.split(' ')
    return { Authorization: `token ${token}`, "x-api-key": uniqueKey  };
} 

export default splitToken;