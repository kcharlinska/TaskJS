fetch('https://www.reddit.com/r/funny.json')
    .then(response => {
        if (response.ok) {
            return response.json()
        } else {
            return Promise.reject({
                status: response.status,
                statusText: response.statusText
            })
        }
    })
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        if (error.status === 404) {
            alert("Something goes wrong :( Please try again later")
        }
    })