(function () {
    const yearNode = document.getElementById("year");

    if (yearNode) {
        yearNode.textContent = String(new Date().getFullYear());
    }

    const navigationSlot = document.querySelector("[data-site-navigation]");

    if (!navigationSlot) {
        return;
    }

    const source = navigationSlot.getAttribute("data-navigation-src");

    if (!source) {
        return;
    }

    const normalisePath = function (path) {
        return path.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
    };

    const currentScript = document.currentScript;
    const scriptUrl = currentScript ? new URL(currentScript.getAttribute("src"), window.location.href) : null;
    const basePathMatch = scriptUrl ? scriptUrl.pathname.match(/^(.*)\/assets\/js\/site\.js$/) : null;
    const basePath = basePathMatch && basePathMatch[1] ? basePathMatch[1] : "";

    const withoutBasePath = function (path) {
        if (basePath && path.startsWith(basePath + "/")) {
            return path.slice(basePath.length) || "/";
        }

        return path;
    };

    const applyNavigationState = function () {
        const currentPath = normalisePath(withoutBasePath(window.location.pathname));

        navigationSlot.querySelectorAll("a[data-nav-key]").forEach(function (link) {
            const target = new URL(link.getAttribute("href"), window.location.origin);
            const targetPath = normalisePath(target.pathname);
            const resolvedPath = basePath + (targetPath === "/" ? "/" : targetPath + "/");

            link.setAttribute("href", resolvedPath);

            if (targetPath === currentPath) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    fetch(source)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Navigation could not be loaded.");
            }

            return response.text();
        })
        .then(function (html) {
            navigationSlot.innerHTML = html;
            applyNavigationState();
        })
        .catch(function () {
            navigationSlot.remove();
        });
})();
