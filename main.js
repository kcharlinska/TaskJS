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
        const postsData = new Object();
        postsData.posts = [];
        data.data.children.forEach(item => {
            postsData.posts.push({
                title: item.data.title,
                upvotes: item.data.ups,
                score: item.data.score,
                num_comments: item.data.num_comments,
                created: new Date(item.data.created_utc * 1000)
            })
        });
        postsData.count = postsData.posts.length;
        console.log(postsData);
    })
    .catch(error => {
        if (error.status === 404) {
            alert("Something goes wrong :( Please try again later")
        }
    })