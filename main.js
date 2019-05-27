const getPosts = () => {
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
                    return b[prop] - a[prop];
                    // return (a[prop] < b[prop]) ? -1 : (a[prop] > b[prop]) ? 1 : 0;
                });
            }

            const pickTopPost = () => {
                postsData.posts.forEach(item => {
                    item.ratio = item.upvotes / item.num_comments
                })

                let highestRatio = [];
                postsData.posts.sort((a, b) => a.ratio - b.ratio);
                highestRatio.push(postsData.posts[postsData.posts.length - 1]);
                for (let i = 0; i < postsData.posts.length - 1; i++) {
                    if (highestRatio[0].ratio === postsData.posts[i].ratio) {
                        highestRatio.push(postsData.posts[i]);
                    }
                }
                if (highestRatio.length >= 2) highestRatio.reduce((prev, current) => {
                    return prev.created > current.created ? prev : current;
                })
                const topPost = highestRatio[0];
                cleanData();
                createPost(topPost);
            }


            const sortLastDay = () => {
                const actualDate = new Date()
                const previousDay = actualDate - 60 * 60 * 24 * 1000;
                const freshPosts = postsData.posts.filter((item) => {
                    return item.created > previousDay;
                })
                cleanData();
                showPosts(freshPosts);
            }

            document.querySelectorAll('.options a').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    getSortedData(`${item.className}`);
                    cleanData();
                    showPosts(postsData.posts);
                    toggleSubMenu();
                })
            })

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

            showPosts(postsData.posts);
        })
        .catch(error => {
            if (error.status === 404) {
                alert("Something goes wrong :( Please try again later")
            }
        })
}

const cleanData = () => {
    const postWrapper = document.querySelector('.posts-wrapper');
    while (postWrapper.firstChild) {
        postWrapper.removeChild(postWrapper.firstChild);
    }
}

const formatDate = (date) => {
    const addZero = (n) => (n <= 9) ? "0" + n : n;
    return `${addZero(date.getDate())}.${addZero((date.getMonth() + 1))}.${date.getFullYear()} ${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`;
}

const toggleSubMenu = () => {
    document.querySelector('.options').classList.toggle('show');
}

document.querySelector('.btn-sort').addEventListener('click', (e) => {
    e.preventDefault();
    toggleSubMenu()
});

document.addEventListener('DOMContentLoaded', getPosts);