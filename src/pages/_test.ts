const getBlobFromUrl = (myImageUrl): Promise<any> => {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', myImageUrl, true);
        request.responseType = 'blob';
        request.onload = () => {
            resolve(request.response);
        };
        request.onerror = reject;
        request.send();
    })
}

const getDataFromBlob = (myBlob): Promise<any> => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(myBlob);
    })
}

export const convertUrlToImageData = async (myImageUrl): Promise<string> => {
    try {
        let myBlob = await getBlobFromUrl(myImageUrl);
        let myImageData = await getDataFromBlob(myBlob);
        return myImageData;
    } catch (err) {
        console.log(err);
        return null;
    }
}
