export function handleErrors(response) {
    if(!response.ok) {
        throw Error(response.messages)
    }
    return response;
}

export function formatDate(target, date) {
    
    const formats = {
        starts: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        },
        ends: {
            hour: 'numeric',
            minute: 'numeric',
        }
    }
    
    return new Intl.DateTimeFormat('en', formats[target]).format(date)
}

export function convertToPythonTimestamp(timestamp) {
    return new Date(timestamp).getTime() / 1000;
}