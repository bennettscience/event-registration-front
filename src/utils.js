export function handleErrors(response) {
    console.log(response.ok)
    if(!response.ok) {
        throw Error(response.data)
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

export class Requester {
    constructor(baseUrl) {
        this._baseUrl = baseUrl;
    }
    
    async get_request(url) {
        let fullUrl = url;
        const opts = {
            "method": "GET",
            "headers": {
                'Content-Type': 'application/json'
            },
        }

        let resp = await fetch(fullUrl)
        if(resp.ok) {
            let data = await resp.json()
            return data;
        }
        
    }
    
    post_request_(url, headers, data=null, payload={}) {
        const opts = {
            "method": "POST",
            "contentType": "application/json",
            "headers": headers
        }
        
        if(payload) opts['payload'] = JSON.stringify(payload)
    }
    
    put_request_(url, headers, data=null, payload={}) {
        const opts = {
            "method": "PUT",
            "contentType": "application/json",
            "headers": headers
        }
    }
    
    async request(method, endpoint, url, payload=null, headers=null) {
        let query = '';
        let requestMethod, response, result;

        method = method.toUpperCase();
        const fullUrl = url || `${this._baseUrl}${endpoint}`;
        console.log(fullUrl)
        
        if(method === "GET") {
            requestMethod = this.get_request.bind(this);
        } else if(method === "POST") {
            requestMethod = this.post_request.bind(this);
            throw new NotImplementedError('POST not implemented. Use a native UrlFetchApp.fetch() request.')
        } else if(method === "PUT") {
            requestMethod = this.put_request.bind(this);
            throw new NotImplementedError('PUT not implemented. Use a native UrlFetchApp.fetch() request.')
        } else if(method === "DELETE") {
            requestMethod = this.delete_request.bind(this);
            throw new NotImplementedError('DELETE not implemented. Use a native UrlFetchApp.fetch() request.')
        }

        response = requestMethod(fullUrl, headers, payload)
        console.log(response)
        return response;
    }
}

export function mapFields(fieldArray) {
    // take in an array
    // do the mapping
    // which params?
}