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
    var adsScript = document.createElement('script');
    adsScript.async = true;
    adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx";
    adsScript.setAttribute("crossorigin", "anonymous");
    document.head.appendChild(adsScript);

})();
