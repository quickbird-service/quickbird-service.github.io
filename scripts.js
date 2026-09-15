// Quick Bird - Centralized Global Scripts (Analytics & AdSense)
(function() {
    // 2. Google AdSense Script (உங்கள் ca-pub-xxxxxxxxxxxxxxxx ஐடியை மாற்றவும்)
/*    var adsScript = document.createElement('script');
    adsScript.async = true;
    adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx";
    adsScript.setAttribute("crossorigin", "anonymous");
    document.head.appendChild(adsScript);
*/
})();

document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("posts-container");
    if (!container) return;

    let allPosts = [];
    let currentIndex = 0;
    const itemsPerPage = 4; // ஒரே நேரத்தில் எத்தனை போஸ்ட்கள் காட்ட வேண்டும்

    // தானாக இன்றைய தேதியைக் கொண்டு வர
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    function renderPosts() {
        const nextIndex = currentIndex + itemsPerPage;
        const postsToDisplay = allPosts.slice(currentIndex, nextIndex);

        if (postsToDisplay.length === 0) return;

        postsToDisplay.forEach(post => {
            const postHTML = `
                <div class="col-6 col-md-4 mb-4">
                    <div class="card post-card h-100">
                        <div class="post-img-wrapper" style="background-color: #fff; display: flex; align-items: center; justify-content: center;">
                            <span class="category-badge">${post.category}</span>
                            <a href="${post.link}" class="w-100 h-100 d-flex align-items: center justify-content: center;">
                                <img src="${post.image}" class="post-img" alt="${post.title}" style="object-fit: contain; max-height: 100%; max-width: 100%;">
                            </a>
                        </div>
                        <div class="card-body p-3 d-flex flex-column">
                            <div class="text-muted small mb-2">
                                <i class="fa fa-calendar-alt me-1"></i> ${currentDate}
                            </div>
                            <h2 class="post-title" style="font-size: 1rem;">
                                <a href="${post.link}">${post.title}</a>
                            </h2>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += postHTML;
        });

        currentIndex = nextIndex;
    }

    // JSON கோப்பிலிருந்து டேட்டாவை வாசித்தல்
    fetch("posts.json")
        .then(response => response.json())
        .then(posts => {
            allPosts = posts;
            container.innerHTML = ""; // பழையதை அழிக்க
            renderPosts(); // முதல் தொகுதியை மட்டும் முதலில் காட்ட
        })
        .catch(error => console.error("Error loading posts:", error));

    // கீழே ஸ்க்ரோல் செய்யும்போது ஆட்டோமேட்டிக்காக அடுத்த போஸ்ட்கள் லோட் ஆக (Infinite Scroll)
    window.addEventListener("scroll", function () {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
            if (currentIndex < allPosts.length) {
                renderPosts();
            }
        }
    });
});
