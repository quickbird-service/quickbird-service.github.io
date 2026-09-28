// Quick Bird - Search & General Global Scripts
(function() {
    // Google AdSense Script 
})();

document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("posts-container");
    
    let allPosts = [];
    let currentIndex = 0;
    const initialItemsPerPage = 12; 
    const subsequentItemsPerPage = 12; 
    let isLoading = false;  

    function showLoader() {
        if (!container) return;
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

    function loadImagesSequentially(scopeElement) {
        const images = scopeElement.querySelectorAll('.post-img');
        if (images.length === 0) return;

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

    function updateLoadMoreButton() {
        const loadMoreContainer = document.getElementById("load-more-container");
        if (!loadMoreContainer) return;
        if (currentIndex < allPosts.length) {
            loadMoreContainer.style.display = "block";
        } else {
            loadMoreContainer.style.display = "none";
        }
    }

    function renderPosts(count) {
        if (!container) return;
        if (isLoading) return;
        isLoading = true;
        
        showLoader();

        setTimeout(() => {
            const nextIndex = currentIndex + count;
            const postsToDisplay = allPosts.slice(currentIndex, nextIndex);

            hideLoader();

            if (postsToDisplay.length === 0) {
                isLoading = false;
                updateLoadMoreButton();
                return;
            }

            let batchHTML = "";
            postsToDisplay.forEach(post => {
                batchHTML += `
                    <div class="col-6 col-md-3 mb-3">
                        <div class="card post-card h-100 shadow-sm border-0" style="border-radius: 8px;">
                            <div class="post-img-wrapper" style="height: 150px; background-color: #ffffff; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border-top-left-radius: 8px; border-top-right-radius: 8px; padding: 6px;">
                                <a href="post.html?id=${post.id}" class="w-100 h-100 d-flex align-items: center justify-content: center text-decoration-none">
                                    <img src="" data-original-src="${post.image}" class="post-img" alt="${post.title}" style="width: 100%; height: 100%; object-fit: contain;">
                                </a>
                            </div>
                            <div class="card-body p-2 d-flex flex-column justify-content-between">
                                <h2 class="post-title" style="font-size: 0.9rem; line-height: 1.3; margin-bottom: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                    <a href="post.html?id=${post.id}" class="text-decoration-none text-dark">${post.title}</a>
                                </h2>
                            </div>
                        </div>
                    </div>
                `;
            });

            container.insertAdjacentHTML('beforeend', batchHTML);
            loadImagesSequentially(container);

            currentIndex = nextIndex;
            isLoading = false;

            updateLoadMoreButton();
        }, 300);
    }

    // JSON கோப்பிலிருந்து போஸ்ட்கள் மற்றும் கேட்டகிரிகளை ஏற்றி வழங்குதல்
    fetch("posts.json")
        .then(response => response.json())
        .then(posts => {
            allPosts = posts; 
            
            if (container) {
                container.innerHTML = ""; 
                renderPosts(initialItemsPerPage); 
            }

            // கேட்டகிரிகள் மற்றும் சப்-கேட்டகிரிகளை உருவாக்குதல்
            const categoriesMap = {};

            posts.forEach(post => {
                const catName = post.category || "General";
                const subCatName = post.subcategory || "Others";

                if (!categoriesMap[catName]) {
                    categoriesMap[catName] = new Set();
                }
                categoriesMap[catName].add(subCatName);
            });

            // 1. நேவிகேஷன் மெனுவிற்கான கேட்டகரி HTML-ஐ உருவாக்குதல்
            const dropdownContainer = document.getElementById("dynamic-categories");
            if (dropdownContainer) {
                dropdownContainer.innerHTML = ""; 

                let catIndex = 0;
                for (const [catName, subCategories] of Object.entries(categoriesMap)) {
                    catIndex++;
                    const mainCollapseId = "mainCatCollapse" + catIndex;

                    const catLi = document.createElement("li");
                    catLi.className = "px-2 mb-2";
                    
                    let subLinksHTML = "";
                    subCategories.forEach(subCat => {
                        subLinksHTML += `<a class="dropdown-item py-2 ps-4 text-light small text-wrap" href="search.html?category=${encodeURIComponent(subCat)}" style="background-color: #212f3d; margin-bottom: 2px; border-radius: 4px;">— ${subCat}</a>`;
                    });

                    catLi.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center text-warning fw-bold px-3 py-2 rounded shadow-sm" style="background-color: #2c3e50; cursor: pointer;" onclick="const el = document.getElementById('${mainCollapseId}'); el.style.display = el.style.display === 'none' ? 'block' : 'none';">
                            <span>${catName}</span>
                            <i class="fa fa-chevron-down small"></i>
                        </div>
                        <div class="ps-2 mt-1" id="${mainCollapseId}" style="display: none;">
                            ${subLinksHTML}
                        </div>
                    `;
                    dropdownContainer.appendChild(catLi);
                }

                if (Object.keys(categoriesMap).length === 0) {
                    dropdownContainer.innerHTML = `<li><span class="dropdown-item text-muted">No categories found</span></li>`;
                }

                dropdownContainer.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }

            // 2. சைட் பார் (Sidebar)-விற்கான கேட்டகரி பட்டியல் HTML-ஐ உருவாக்குதல் (Index மற்றும் Post பக்கங்களுக்குப் பொருந்தும்)
            const sidebarCategoriesContainer = document.getElementById("sidebar-categories");
            if (sidebarCategoriesContainer) {
                sidebarCategoriesContainer.innerHTML = "";

                let sidebarHTML = "<ul class='sidebar-categories-list'>";
                let sideIndex = 0;

                for (const [catName, subCategories] of Object.entries(categoriesMap)) {
                    sideIndex++;
                    const sideCollapseId = "sidebarCatCollapse" + sideIndex;

                    let subSidebarLinks = "";
                    subCategories.forEach(subCat => {
                        subSidebarLinks += `<li><a href="search.html?category=${encodeURIComponent(subCat)}" class="small ps-3 py-1 text-muted d-block text-decoration-none"><i class="fa fa-angle-right me-1"></i> ${subCat}</a></li>`;
                    });

                    sidebarHTML += `
                        <li class="mb-2 border-bottom pb-2">
                            <div class="d-flex justify-content-between align-items-center text-dark fw-bold px-2 py-1 rounded" style="background-color: #f1f2f6; cursor: pointer;" onclick="const el = document.getElementById('${sideCollapseId}'); el.style.display = el.style.display === 'none' ? 'block' : 'none';">
                                <span><i class="fa fa-folder text-warning me-1"></i> ${catName}</span>
                                <i class="fa fa-chevron-down small text-muted"></i>
                            </div>
                            <ul class="list-unstyled mt-1 ps-2" id="${sideCollapseId}" style="display: none;">
                                ${subSidebarLinks}
                            </ul>
                        </li>
                    `;
                }
                sidebarHTML += "</ul>";
                sidebarCategoriesContainer.innerHTML = sidebarHTML;
            }

        })
        .catch(error => {
            console.error("Error loading posts or categories:", error);
            hideLoader();
        });

    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", function() {
            if (!isLoading && currentIndex < allPosts.length) {
                renderPosts(subsequentItemsPerPage);
            }
        });
    }
});
