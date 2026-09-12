// Quick Bird - Centralized Global Scripts (Analytics & AdSense)
(function() {
    

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JEQ5HH2WB9"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-JEQ5HH2WB9');
</script>
    


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
            
            // தானாக இன்றைய தேதியைக் கொண்டு வர
            const currentDate = new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            posts.forEach(post => {
                const postHTML = `
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="card post-card h-100">
                            <div class="post-img-wrapper" style="background-color: #fff; display: flex; align-items: center; justify-content: center;">
                                <span class="category-badge">${post.category}</span>
                                <a href="${post.link}" class="w-100 h-100 d-flex align-items: center. justify-content: center;">
                                    <img src="${post.image}" class="post-img" alt="${post.title}" style="object-fit: contain; max-height: 100%; max-width: 100%;">
                                </a>
                            </div>
                            <div class="card-body p-3 d-flex flex-column">
                                <div class="text-muted small mb-2">
                                    <i class="fa fa-calendar-alt me-1"></i> ${currentDate}
                                </div>
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
