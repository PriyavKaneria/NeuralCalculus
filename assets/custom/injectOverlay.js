const dockURL = "https://dock.priyavkaneria.com" //prod
// const dockURL = "http://127.0.0.1:8080" //dev

// disable the bfcache, as it interferes with the custom navigation
// see - https://web.dev/articles/bfcache

function injectOverlay(projectOnly = false) {
    // Inject the style into the head
    const style = document.createElement("style");
    style.innerHTML = `
      #overlay-iframe, #projects-iframe, #index-iframe {
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

      #index-iframe {
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
    iframe.src = dockURL;

    // Inject projects iframe for smooth transition to projects page
    const projectsIframe = document.createElement("iframe");
    projectsIframe.id = "projects-iframe";
    projectsIframe.src = "about: blank";
    projectsIframe.loading = "lazy";
    projectsIframe.sandbox = "allow-scripts allow-forms allow-pointer-lock allow-same-origin";
    projectsIframe.frameBorder = "0";
    document.body.insertBefore(projectsIframe, document.body.firstChild);
    projectsIframe.src = "https://projects.priyavkaneria.com/";

    // Inject index iframe for smooth transition to index page
    const indexIframe = document.createElement("iframe");
    indexIframe.id = "index-iframe";
    indexIframe.src = "about: blank";
    indexIframe.sandbox = "allow-scripts allow-forms allow-pointer-lock allow-same-origin";
    indexIframe.frameBorder = "0";
    document.body.insertBefore(indexIframe, document.body.firstChild);
    indexIframe.src = "https://index.priyavkaneria.com/";

    // Helper function to check the URL and manage the iframe display
    function checkUrlAndManageIframe() {
        const currentUrl = window.location.href;
        const iframeElement = document.getElementById("overlay-iframe");

        if (currentUrl.includes("#blog")) {
            iframeElement.style.display = "none";
            document.documentElement.style.overflow = "auto"; // Re-enable scrolling
        } else if (currentUrl.includes("#projects")) {
            projectsIframe.style.display = "block";
        } else if (currentUrl.includes("#index")) {
            indexIframe.style.display = "block";
        } else if (currentUrl.includes("#dock")) {
            iframeElement.src = iframeElement.src;
            iframeElement.style.display = "block";
            iframeElement.style.pointerEvents = "auto";
            document.documentElement.style.overflow = "hidden"; // Disable scrolling
        }
    }

    // Initial check on page load
    checkUrlAndManageIframe();

    // Optionally, listen for URL changes
    window.addEventListener(
        "hashchange",
        () => {
            checkUrlAndManageIframe();
        },
        false
    );

    window.addEventListener("message", (e) => {
        if (e.origin === dockURL) {
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
                } else if (href === "#index") {
                    window.location.href = "https://index.priyavkaneria.com/";
                    return;
                }
                window.location.hash = href;
            } else if (e.data[0] === "asktheme") {
                // send current theme to iframe if present
                const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                if ((userPrefersDark && !sessionStorage.getItem("mode")) || sessionStorage.getItem("mode") === "dark") {
                    iframe.contentWindow.postMessage(
                        "dark",
                        dockURL
                    );
                }
            } else if (e.data[0] === "msg") {
                console.log("Received message", e.data[1]);
                if (e.data[1] === "projects") {
                    window.location.hash = "#projects";
                } else if (e.data[1] === "index") {
                    window.location.hash = "#index";
                }
            }
        }
    });
}

var perfEntries = performance.getEntriesByType("navigation");
console.log(perfEntries[0].type);

if (perfEntries[0].type === "back_forward") {
    // console.log("User navigated using back or forward button");
    handlePageShow(true);
}

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      console.log('This page was restored from the bfcache.');
      location.reload();
    }
});

function handlePageShow(backForward = false) {
    // do not show overlay when #blog is in the url
    if (window.location.hash.includes("#blog")) {
        // redirect to /
        window.location.href = "/";
    } else if (window.location.hash.includes("#dock")) {
        // inject overlay to show the dock
        injectOverlay();
    } else if (window.location.hash.includes("#projects")) {
        // if no referrer, take to projects
        console.log("Referrer", document.referrer);
        if (!backForward && (document.referrer === "" || document.referrer.pathname === "/")) {
            window.location.href = "https://projects.priyavkaneria.com/";
        } else {
            // take to dock
            window.location.href = "/#dock";
        }
    } else if (window.location.hash.includes("#index")) {
        // if no referrer, take to index
        console.log("Referrer", document.referrer);
        if (!backForward && (document.referrer === "" || document.referrer.pathname === "/")) {
            window.location.href = "https://index.priyavkaneria.com/";
        } else {
            // take to dock
            window.location.href = "/#dock";
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
    else if (window.location.pathname === "/") {
        // take him to the dock if no other path is matched
        window.location.href = "/#dock";
        window.location.reload();
    }
}

handlePageShow();