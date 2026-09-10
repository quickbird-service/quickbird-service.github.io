// Quick Bird - Centralized Global Scripts (Analytics & AdSense)
(function() {
    
    // 1. Google Analytics Script (உங்கள் G-XXXXXXXXXX ஐடியை மாற்றவும்)
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX";
    document.head.appendChild(gaScript);

    var gaInline = document.createElement('script');
    gaInline.text = "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXXXXX');";
    document.head.appendChild(gaInline);


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

    fetch("posts.json")
        .then(response => response.json())
        .then(posts => {
            container.innerHTML = "";
            posts.forEach(post => {
                const postHTML = `
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="card post-card h-100">
                            <div class="post-img-wrapper">
                                <span class="category-badge">${post.category}</span>
                                <a href="${post.link}">
                                    <img src="${post.image}" class="post-img" alt="${post.title}">
                                </a>
                            </div>
                            <div class="card-body p-3">
                                <h2 class="post-title">
                                    <a href="${post.link}">${post.title}</a>
                                </h2>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += postHTML;
            });
        })
        .catch(error => console.error("Error loading posts:", error));
});

