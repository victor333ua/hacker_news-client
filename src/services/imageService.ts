type Options = {
    isAuthed: boolean,
    accessToken: string | undefined, 
    clientId: string | undefined
};

const getHeaders = (options: Options ) => {
    const myHeaders = new Headers();
    let strAuth;
    if (options.isAuthed) strAuth = 'Bearer ' + options. accessToken;
    else strAuth = 'Client-ID ' + options.clientId;
    myHeaders.append("Authorization", strAuth);
    return myHeaders;
};

export const uploadImage = async (file: File, options: Options) => {
    const path = options.isAuthed ? 'upload' : 'image';
    const url = 'https://api.imgur.com/3/' + path;

    const myHeaders = getHeaders(options);
    const formdata = new FormData();
    formdata.append("image", file);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata
    };

    const response = await fetch(url, requestOptions);
    if (response.ok) {
        const { data: { deletehash, link }} = await response.json();
        return { deletehash, link };
    }
    throw new Error(`error upload image status=${response.status} type=${response.type}`);
};

export const deleteImage = async (
    inputs: { link: string, deletehash: string }, options: Options) => {

    let url = 'https://api.imgur.com/3/image/';
    if (options.isAuthed) {
        const imageId = inputs.link.split('/').pop()?.split('.').shift(); 
        url += imageId;   
    } else
        url += inputs.deletehash;

    const myHeaders = getHeaders(options);
    const formdata = new FormData();
    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: formdata
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) throw new Error('error deleting image');
};

