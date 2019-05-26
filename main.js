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

        const showPosts = () => {
            postsData.posts.forEach(item => {
                const post = document.createElement('article');
                document.querySelector('.posts-wrapper').appendChild(post);
                post.className = 'post';
                const date = document.createElement('div');
                post.appendChild(date);
                date.className = 'date';
                date.textContent = item.created;
                const upvotes = document.createElement('div');
                post.appendChild(upvotes);
                upvotes.className = 'upvotes';
                upvotes.textContent = `${item.upvotes} upvotes`;
                const txt = document.createElement('div');
                post.appendChild(txt);
                txt.className = 'txt';
                txt.textContent = item.title;
                const comments = document.createElement('div');
                post.appendChild(comments);
                comments.className = 'comments';
                comments.textContent = `${item.num_comments} comments`;
                const score = document.createElement('div');
                post.appendChild(score);
                score.className = 'score';
                score.textContent = `${item.score} score`;
            })
        }

        const getSortedData = (prop) => {
            return postsData.posts.sort((a, b) => {
                return a[prop] - b[prop];
                // return (a[prop] < b[prop]) ? -1 : (a[prop] > b[prop]) ? 1 : 0;
            });
        }

        const cleanData = (el) => {
            // while (el.firstChild) el.removeChild(el.firstChild);
            while (el.firstChild) {
                el.removeChild(el.firstChild);
                // element.forEach(item => item.parentNode.removeChild(element))
            }
        }
        showPosts();


        // let prop = document.querySelector('.upvotes').className;
        // console.log(prop);

        document.querySelectorAll('.options a').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(item.className);
                getSortedData(`${item.className}`);
                document.querySelector('.posts-wrapper').innerHTML = '';
                // cleanData(document.querySelector('.posts-wrapper'));
                showPosts();
                toggleSubMenu();
            })
        })

    })
    .catch(error => {
        if (error.status === 404) {
            alert("Something goes wrong :( Please try again later")
        }
    })

const toggleSubMenu = () => {
    document.querySelector('.options').classList.toggle('show');
}
document.querySelector('.btn-sort').addEventListener('click', toggleSubMenu)