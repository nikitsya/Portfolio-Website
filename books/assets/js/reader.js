(function () {
    const progress = document.querySelector(".read-progress");

    const updateProgress = () => {
        if (!progress) {
            return;
        }

        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const value = scrollable > 0 ? window.scrollY / scrollable : 0;
        progress.style.transform = `scaleX(${Math.min(Math.max(value, 0), 1)})`;
    };

    const openSection = function (target) {
        const disclosure = target && (target.closest(".book-disclosure") || target.querySelector(".book-disclosure"));

        if (disclosure) {
            disclosure.open = true;
        }
    };

    const revealHashTarget = function () {
        const target = document.getElementById(window.location.hash.slice(1));
        openSection(target);

        if (target) {
            target.scrollIntoView();
        }

        updateProgress();
    };

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function () {
            openSection(document.getElementById(link.hash.slice(1)));
        });
    });

    revealHashTarget();
    window.addEventListener("hashchange", revealHashTarget);
    window.addEventListener("scroll", updateProgress, {passive: true});
    window.addEventListener("resize", updateProgress);
    document.querySelectorAll(".book-disclosure").forEach(function (disclosure) {
        disclosure.addEventListener("toggle", updateProgress);
    });
})();
