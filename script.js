document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    initStarfield();
});

async function fetchData() {
    try {
        const response = await fetch('website_data.json');
        const data = await response.json();
        renderApp(data);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function renderApp(data) {
    const chapterList = document.getElementById('chapter-list');
    const essayDisplay = document.getElementById('essay-display');
    const chapters = data.chapters;

    // Render Sidebar
    chapters.forEach((chapter, index) => {
        const item = document.createElement('div');
        item.className = `chapter-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `
            <span>Chapter ${chapter.id}</span>
            <h3>${chapter.title}</h3>
        `;
        item.addEventListener('click', () => {
            // Update UI
            document.querySelectorAll('.chapter-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            // Render Content
            renderChapter(chapter, essayDisplay);
        });
        chapterList.appendChild(item);
    });

    // Render Initial Chapter
    if (chapters.length > 0) {
        renderChapter(chapters[0], essayDisplay);
    }
}

function renderChapter(chapter, container) {
    // Fade out
    container.style.opacity = '0';

    setTimeout(() => {
        container.innerHTML = `
            <h1>${chapter.title}</h1>
            <div class="chapter-content">
                ${chapter.content}
            </div>
        `;
        // Fade in
        container.style.transition = 'opacity 0.4s ease';
        container.style.opacity = '1';

        // Scroll to top
        document.querySelector('.content-area').scrollTop = 0;
    }, 200);
}

// Starfield Animation
function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');

    let width, height;
    let stars = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        createStars();
    }

    function createStars() {
        stars = [];
        const count = 200;
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random()
            });
        }
    }

    function animate() {
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);

        stars.forEach(star => {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();

            star.y -= star.speed;
            if (star.y < 0) {
                star.y = height;
                star.x = Math.random() * width;
            }

            // Twinkle effect
            star.opacity += (Math.random() - 0.5) * 0.05;
            if (star.opacity > 1) star.opacity = 1;
            if (star.opacity < 0.2) star.opacity = 0.2;
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}
