
document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = header.classList.contains('active');

            // Close all other items
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isOpen) {
                header.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                header.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Scroll Animation (Intersection The Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Handle Custom Video Placeholders
    const videoPlaceholders = document.querySelectorAll('.video-placeholder-content');
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function () {
            const wrapper = this.closest('.video-wrapper');
            const iframe = wrapper.querySelector('iframe');

            // Add playing class to hide placeholder
            this.classList.add('playing');

            // Trigger video play via postMessage (YouTube API)
            // This is cleaner than reloading src and keeps user interaction context
            iframe.contentWindow.postMessage(JSON.stringify({
                'event': 'command',
                'func': 'playVideo'
            }), '*');
        });
    });
});

// ------------------------------------------
// Back-Redirect Logic (Funnel Protection)
// ------------------------------------------
// Verifica se NÃO estamos na página ofertaespecial.html para evitar loops
if (!window.location.pathname.includes("ofertaespecial")) {
    // Empurra um estado no histórico para "prender" o usuário
    history.pushState(null, null, location.href);

    // Ouve o evento de "Voltar" do navegador
    window.addEventListener("popstate", function () {
        // Redireciona para a oferta especial
        window.location.href = "ofertaespecial.html" + window.location.search;
    });
}
