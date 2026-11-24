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

    updateProgress();
    window.addEventListener("scroll", updateProgress, {passive: true});
    window.addEventListener("resize", updateProgress);
    document.querySelectorAll(".book-chapters").forEach(function (chapters) {
        chapters.addEventListener("toggle", updateProgress);
    });
})();
