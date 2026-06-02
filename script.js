// Simple client-side feed demo: like, double-click like animation, add comments
const feedData = [{
        id: 'p1',
        username: 'travel_buddy',
        avatar: 'https://picsum.photos/seed/u1/80',
        location: 'Ooty, India',
        image: 'https://picsum.photos/seed/post1/900/700',
        caption: 'Sunset vibes at the hills 🌄',
        likes: 24,
        comments: [{
            user: 'friend1',
            text: 'Awesome!'
        }]
    },
    {
        id: 'p2',
        username: 'code_master',
        avatar: 'https://picsum.photos/seed/u2/80',
        location: 'Chennai',
        image: 'https://picsum.photos/seed/post2/900/700',
        caption: 'Built a small project today 🛠',
        likes: 12,
        comments: []
    },
    {
        id: 'p3',
        username: 'musiclover',
        avatar: 'https://picsum.photos/seed/u3/80',
        location: 'Tiruvannamalai',
        image: 'https://picsum.photos/seed/post3/900/700',
        caption: 'Great vibes with friends 🎶',
        likes: 48,
        comments: [{
            user: 'friend2',
            text: 'Let’s go!'
        }]
    }
];

const feedEl = document.getElementById('feed');
const template = document.getElementById('post-template');

function createPostEl(data) {
    const tpl = template.content.cloneNode(true);
    const post = tpl.querySelector('.post');
    post.dataset.id = data.id;

    tpl.querySelectorAll('.post-username').forEach(n => n.textContent = data.username);
    tpl.querySelector('.post-avatar').src = data.avatar;
    tpl.querySelector('.post-location').textContent = data.location || '';
    tpl.querySelector('.post-image').src = data.image;
    tpl.querySelector('.post-caption').textContent = data.caption;
    tpl.querySelector('.likes-count').textContent = data.likes;

    const commentsList = tpl.querySelector('.comments-list');
    data.comments.forEach(c => {
        const div = document.createElement('div');
        div.className = 'comment';
        div.innerHTML = < strong > $ {
            c.user
        } < /strong> ${escapeHtml(c.text)};
        commentsList.appendChild(div);
    });

    // Like button
    const likeBtn = tpl.querySelector('.like-btn');
    let liked = false;

    likeBtn.addEventListener('click', () => {
        liked = !liked;
        likeBtn.setAttribute('aria-pressed', liked ? 'true' : 'false');
        data.likes = liked ? data.likes + 1 : Math.max(0, data.likes - 1);
        tpl.querySelector('.likes-count').textContent = data.likes;
    });

    // Double click to like + animation
    const postImage = tpl.querySelector('.post-image');
    const heartAnim = tpl.querySelector('.heart-anim');

    let lastTap = 0;
    postImage.addEventListener('dblclick', () => flashHeart());
    // mobile double-tap detection (optional)
    postImage.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
            e.preventDefault();
            flashHeart();
        }
        lastTap = now;
    });

    function flashHeart() {
        // animate big heart
        heartAnim.style.transform = 'translate(-50%,-50%) scale(1)';
        heartAnim.style.opacity = '1';
        setTimeout(() => {
            heartAnim.style.transform = 'translate(-50%,-50%) scale(0)';
            heartAnim.style.opacity = '0';
        }, 600);

        // toggle like state if not liked
        if (!liked) {
            liked = true;
            likeBtn.setAttribute('aria-pressed', 'true');
            data.likes += 1;
            tpl.querySelector('.likes-count').textContent = data.likes;
        }
    }

    // Comment form
    const form = tpl.querySelector('.comment-form');
    const input = tpl.querySelector('.comment-input');
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        data.comments.push({
            user: 'you',
            text
        });
        const div = document.createElement('div');
        div.className = 'comment';
        div.innerHTML = < strong > you < /strong> ${escapeHtml(text)};
        commentsList.appendChild(div);
        input.value = '';
    });

    return tpl;
}

function renderFeed() {
    feedEl.innerHTML = '';
    feedData.forEach(p => {
        const postNode = createPostEl(p);
        feedEl.appendChild(postNode);
    });
}

function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": "&#039;"
        }[m];
    });
}

renderFeed();