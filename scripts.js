// Quick Bird - Centralized Global Scripts (Analytics & AdSense)
(function() {
    // 2. Google AdSense Script 
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
    let isLoading = false;  // இரட்டை லோடிங்கைத் தவிர்க்க

    // தானாக இன்றைய தேதியைக் கொண்டு வர
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // 2. கீழே ஸ்க்ரோல் செய்யும்போது காட்டும் சுழலும் லோடிங் ஸ்பின்னர் (Loading Spinner)
    function showLoader() {
        if (document.getElementById("loading-spinner")) return;
        const loaderDiv = document.createElement("div");
        loaderDiv.id = "loading-spinner";
        loaderDiv.className = "col-12 text-center my-3";
        loaderDiv.innerHTML = `
            <div class="spinner-border text-warning" role="status" style="width: 2rem; height: 2rem;">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
        container.parentNode.appendChild(loaderDiv);
    }

    function hideLoader() {
        const loaderDiv = document.getElementById("loading-spinner");
        if (loaderDiv) {
            loaderDiv.remove();
        }
    }

    function renderPosts() {
        if (isLoading) return;
        isLoading = true;
        
        showLoader();

        setTimeout(() => {
            const nextIndex = currentIndex + itemsPerPage;
            const postsToDisplay = allPosts.slice(currentIndex, nextIndex);

            hideLoader();

            if (postsToDisplay.length === 0) {
                isLoading = false;
                return;
            }

            postsToDisplay.forEach(post => {
                const postHTML = `
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card post-card h-100 shadow-sm border-0" style="border-radius: 8px;">
                            <!-- 1 & 3. படத்தின் உயரம் குறைவு மற்றும் படம் வெட்டப்படாமல் முழுமையாகத் தெரிய CSS அமைப்பு -->
                            <div class="post-img-wrapper" style="height: 150px; background-color: #ffffff; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border-top-left-radius: 8px; border-top-right-radius: 8px; padding: 6px;">
                                <span class="category-badge" style="font-size: 0.65rem; padding: 2px 8px; top: 6px; left: 6px; z-index: 2;">${post.category}</span>
                                <a href="${post.link}" class="w-100 h-100 d-flex align-items: center justify-content: center text-decoration-none">
                                    <img src="${post.image}" class="post-img" alt="${post.title}" style="width: 100%; height: 100%; object-fit: contain;">
                                </a>
                            </div>
                            <div class="card-body p-2 d-flex flex-column justify-content-between">
                                <div class="text-muted" style="font-size: 0.7rem; margin-bottom: 4px;">
                                    <i class="fa fa-calendar-alt me-1"></i> ${currentDate}
                                </div>
                                <h2 class="post-title" style="font-size: 0.9rem; line-height: 1.3; margin-bottom: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                    <a href="${post.link}" class="text-decoration-none text-dark">${post.title}</a>
                                </h2>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += postHTML;
            });

            currentIndex = nextIndex;
            isLoading = false;
        }, 500);
    }

    // JSON கோப்பிலிருந்து டேட்டாவை வாசித்தல்
    fetch("posts.json")
        .then(response => response.json())
        .then(posts => {
            allPosts = posts;
            container.innerHTML = ""; 
            renderPosts(); 
        })
        .catch(error => {
            console.error("Error loading posts:", error);
            hideLoader();
        });

    // 2. கீழே ஸ்க்ரோல் செய்யும்போது ஆட்டோமேட்டிக்காக அடுத்த போஸ்ட்கள் லோட் ஆவது (Infinite Scroll)
    window.addEventListener("scroll", function () {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 250) {
            if (!isLoading && currentIndex < allPosts.length) {
                renderPosts();
            }
        }
    });
});
