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

        const formatDate = (date) => {
            const addZero = (n) => (n <= 9) ? "0" + n : n;
            return `${addZero(date.getDate())}.${addZero((date.getMonth() + 1))}.${date.getFullYear()} ${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`;
        }

        const createPost = (item) => {
            const post = document.createElement('article');
            document.querySelector('.posts-wrapper').appendChild(post);
            post.className = 'post';
            const upvotes = document.createElement('div');
            post.appendChild(upvotes);
            upvotes.className = 'upvotes';
            upvotes.textContent = `${item.upvotes} upvotes`;
            const date = document.createElement('div');
            post.appendChild(date);
            date.className = 'created';
            date.textContent = formatDate(item.created);
            const txt = document.createElement('div');
            post.appendChild(txt);
            txt.className = 'txt';
            txt.textContent = item.title;
            const comments = document.createElement('div');
            post.appendChild(comments);
            comments.className = 'num_comments';
            comments.textContent = `${item.num_comments} comments`;
            const score = document.createElement('div');
            post.appendChild(score);
            score.className = 'score';
            score.textContent = `${item.score} score`;
        }
        const showPosts = (el) => {
            el.forEach(item => createPost(item))
        }

        const getSortedData = (prop) => {
            return postsData.posts.sort((a, b) => {
                return a[prop] - b[prop];
                // return (a[prop] < b[prop]) ? -1 : (a[prop] > b[prop]) ? 1 : 0;
            });
        }

        const cleanData = () => {
            const postWrapper = document.querySelector('.posts-wrapper');
            while (postWrapper.firstChild) {
                postWrapper.removeChild(postWrapper.firstChild);
            }
        }
        showPosts(postsData.posts);


        // let prop = document.querySelector('.upvotes').className;
        // console.log(prop);

        document.querySelectorAll('.options a').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(item.className);
                getSortedData(`${item.className}`);
                // document.querySelector('.posts-wrapper').innerHTML = '';
                cleanData();
                showPosts(postsData.posts);
                toggleSubMenu();
            })
        })
        const pickTopPost = () => {
            postsData.posts.forEach(item => {
                item.ratio = item.upvotes / item.num_comments
            })
            const topPost = postsData.posts.reduce((prev, current) => {
                return prev.ratio > current.ratio ? prev : current;
            })
            console.log(topPost);
            cleanData();
            createPost(topPost);
        }

        const sortLastDay = () => {
            const actualDate = new Date()
            console.log(actualDate);
            const previousDay = actualDate - 60 * 60 * 24 * 1000;
            console.log(previousDay);
            console.log(new Date(previousDay));
            const freshPosts = postsData.posts.filter((item) => {
                return item.created > previousDay;
            })
            console.log(freshPosts);
            cleanData();
            showPosts(freshPosts);
        }


        document.querySelector('.btn-home').addEventListener('click', (e) => {
            e.preventDefault();
            cleanData();
            getSortedData('created');
            showPosts(postsData.posts);
        })

        document.querySelector('.btn-top').addEventListener('click', (e) => {
            e.preventDefault();
            pickTopPost()
        });

        document.querySelector('.btn-lastDay').addEventListener('click', (e) => {
            e.preventDefault();
            sortLastDay()
        });

    })
    .catch(error => {
        if (error.status === 404) {
            alert("Something goes wrong :( Please try again later")
        }
    })



const toggleSubMenu = () => {
    document.querySelector('.options').classList.toggle('show');
}
document.querySelector('.btn-sort').addEventListener('click', (e) => {
    e.preventDefault();
    toggleSubMenu()
});