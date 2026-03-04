
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
            let targetId = this.getAttribute('href');

            // Tratamento caso algum script de UTM adicione parâmetros ao href
            if (targetId && targetId.includes('?')) {
                targetId = targetId.split('?')[0];
            }

            if (targetId && targetId.startsWith('#') && targetId !== '#') {
                try {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                } catch (error) {
                    console.error("Erro ao buscar elemento para scroll:", error);
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
    // Implementação robusta (Double-PushState) para não conflitar com links internos
    history.pushState({ backRedirect: 1 }, null, location.href);
    history.pushState({ backRedirect: 2 }, null, location.href);

    // Ouve o evento de "Voltar" do navegador
    window.addEventListener("popstate", function (event) {
        // Apenas redireciona se o estado corresponder ao primeiro pushState
        if (event.state && event.state.backRedirect === 1) {
            window.location.href = "ofertaespecial.html" + window.location.search;
        }
    });
}
