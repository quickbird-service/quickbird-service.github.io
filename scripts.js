// Quick Bird - Centralized Global Scripts (Analytics, AdSense, Index Posts Rendering & Temu Style Sequential Image Loading)
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

    // கீழே ஸ்க்ரோல் செய்யும்போது காட்டும் சுழலும் லோடிங் ஸ்பின்னர்
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

    // டெமு ஸ்டைல் வரிசை முறை பட லோடிங் (Sequential Temu Style Loading)
    function loadImagesSequentially(scopeElement) {
        const images = scopeElement.querySelectorAll('.post-img');
        if (images.length === 0) return;

        // ஆரம்பத்தில் அனைத்துப் படங்களுக்கும் லோகோவை மாற்றுவது
        images.forEach(img => {
            const originalSrc = img.getAttribute('data-original-src');
            if (!originalSrc) return;
            img.src = "image/favicon.png";
            img.style.width = "40px";
            img.style.height = "40px";
            img.style.objectFit = "contain";
            img.style.opacity = "0.4";
            img.style.margin = "auto";
        });

        let imgIndex = 0;

        function loadNext() {
            if (imgIndex >= images.length) return;

            const img = images[imgIndex];
            const originalSrc = img.getAttribute('data-original-src');
            if (!originalSrc) {
                imgIndex++;
                loadNext();
                return;
            }

            const tempImg = new Image();
            tempImg.src = originalSrc;

            tempImg.onload = function() {
                img.src = originalSrc;
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.objectFit = "contain";
                img.style.opacity = "1";
                imgIndex++;
                loadNext();
            };

            tempImg.onerror = function() {
                imgIndex++;
                loadNext();
            };
        }

        loadNext();
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








            
          let batchHTML = "";
            postsToDisplay.forEach(post => {
                batchHTML += `
                    <div class="col-6 col-md-4 mb-3">
                        <div class="card post-card h-100 shadow-sm border-0" style="border-radius: 8px;">
                            <div class="post-img-wrapper" style="height: 150px; background-color: #ffffff; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border-top-left-radius: 8px; border-top-right-radius: 8px; padding: 6px;">
                                <a href="${post.link}" class="w-100 h-100 d-flex align-items: center justify-content: center text-decoration-none">
                                    <img src="" data-original-src="${post.image}" class="post-img" alt="${post.title}" style="width: 100%; height: 100%; object-fit: contain;">
                                </a>
                            </div>
                            <div class="card-body p-2 d-flex flex-column justify-content-between">
                                <h2 class="post-title" style="font-size: 0.9rem; line-height: 1.3; margin-bottom: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                    <a href="${post.link}" class="text-decoration-none text-dark">${post.title}</a>
                                </h2>
                            </div>
                        </div>
                    </div>
                `;
            });

            // நேரடியாக container-க்குள் போஸ்ட்களைச் சேர்த்தல் (Grid சரியாக வேலை செய்ய இது உதவும்)
            container.insertAdjacentHTML('beforeend', batchHTML);

            // புதிதாக வந்த படங்களை டெமு ஸ்டைலில் வரிசையாக லோட் செய்வது
            loadImagesSequentially(container);

            currentIndex = nextIndex;
            isLoading = false;
        }, 300);
    }

          








    

    // JSON கோப்பிலிருந்து டேட்டாவை வாசித்தல்
    fetch("posts.json")
        .then(response => response.json())
        .then(posts => {
            // புதிதாகச் சேர்த்த போஸ்ட்கள் முதலில் வருவதற்கு இதைப் பயன்படுத்துகிறோம்
            allPosts = posts.reverse(); 
            container.innerHTML = ""; 
            renderPosts(); 
        })




        
        .catch(error => {
            console.error("Error loading posts:", error);
            hideLoader();
        });

    // கீழே ஸ்க்ரோல் செய்யும்போது அடுத்த போஸ்ட்கள் லோட் ஆவது (Infinite Scroll)
    window.addEventListener("scroll", function () {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 250) {
            if (!isLoading && currentIndex < allPosts.length) {
                renderPosts();
            }
        }
    });
});
