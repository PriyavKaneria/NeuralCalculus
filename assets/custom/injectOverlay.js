
function injectOverlay(projectOnly = false) {
    // Inject the style into the head
    const style = document.createElement("style");
    style.innerHTML = `
      #overlay-iframe, #projects-iframe {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          z-index: 9999;
      }

      #projects-iframe {
          display: none;
          z-index: 8888;
      }
  `;
    document.head.appendChild(style);

    // Inject the iframe just before the closing body tag
    const iframe = document.createElement("iframe");
    iframe.id = "overlay-iframe";
    iframe.src = "about: blank";
    iframe.sandbox = "allow-scripts allow-forms allow-pointer-lock allow-same-origin allow-modals allow-popups";
    iframe.allowtransparency = "true";
    iframe.style.backgroundColor = "transparent";
    iframe.frameBorder = "0";
    if (!projectOnly) {
        document.body.insertBefore(iframe, document.body.firstChild);
    }
    iframe.src = "https://dock.priyavkaneria.com";

    // Inject projects iframe for smooth transition to projects page
    const projectsIframe = document.createElement("iframe");
    projectsIframe.id = "projects-iframe";
    projectsIframe.src = "about: blank";
    projectsIframe.sandbox = "allow-scripts allow-forms allow-pointer-lock allow-same-origin";
    projectsIframe.frameBorder = "0";
    document.body.insertBefore(projectsIframe, document.body.firstChild);
    projectsIframe.src = "https://projects.priyavkaneria.com/";

    // Helper function to check the URL and manage the iframe display
    function checkUrlAndManageIframe() {
        const currentUrl = window.location.href;
        const iframeElement = document.getElementById("overlay-iframe");

        if (currentUrl.includes("#blog")) {
            iframeElement.style.display = "none";
            document.documentElement.style.overflow = "auto"; // Re-enable scrolling
        } else if (currentUrl.includes("#projects")) {
            projectsIframe.style.display = "block";
        } else {
            iframeElement.style.display = "block";
            document.documentElement.style.overflow = "hidden"; // Disable scrolling
        }
    }

    // Initial check on page load
    checkUrlAndManageIframe();

    // Optionally, listen for URL changes (e.g., single-page applications)
    window.addEventListener(
        "hashchange",
        () => {
            checkUrlAndManageIframe();
        },
        false
    );

    window.addEventListener("message", (e) => {
        if (e.origin === "https://dock.priyavkaneria.com") {
            if (e.data[0] === "theme") {
                const theme = e.data[1];
                if (theme == "dark") {
                    document.documentElement.setAttribute("data-mode", "dark");
                } else {
                    document.documentElement.setAttribute("data-mode", "light");
                }
                iframe.style.pointerEvents = "none";
            } else if (e.data[0] === "href") {
                const href = e.data[1];
                // console.log("Received href", href);
                
                if (href === "#projects") {
                    window.location.href = "https://projects.priyavkaneria.com/";
                    return;
                }
                window.location.hash = href;
            } else if (e.data[0] === "asktheme") {
                // send current theme to iframe if present
                const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                if ((userPrefersDark && !sessionStorage.getItem("mode")) || sessionStorage.getItem("mode") === "dark") {
                    iframe.contentWindow.postMessage(
                        "dark",
                        "https://dock.priyavkaneria.com"
                    );
                }
            } else if (e.data[0] === "msg") {
                if (e.data[1] === "projects") {
                    window.location.hash = "#projects";
                }
            }
        }
    });
}

// do not show overlay when #blog is in the url
if (window.location.hash.includes("#blog")) {
    // redirect to /
    window.location.href = "/";
} else if (window.location.hash.includes("#dock")) {
    // inject overlay to show the dock
    injectOverlay();
} else if (window.location.hash.includes("#projects")) {
    // if no referrer, take to projects
    if (document.referrer === "" || document.referrer.pathname === "/") {
        window.location.href = "https://projects.priyavkaneria.com/";
    }
}
// if referred from this page itself, take to blog
else if (document.referrer.includes(window.location.origin)) {
    // if no hash and root, take to blog
    if (window.location.hash === "" && window.location.pathname === "/") {
        window.location.href = "/#blog";
    }
    // do nothing otherwise
}
else if (window.location.hash.includes("#interesume")) {
    // redirect to dock
    window.location.href = "/#dock";
    window.location.reload();
}
else {
    // take him to the dock
    window.location.href = "/#dock";
    window.location.reload();
}