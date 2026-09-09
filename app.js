// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
    initNavigation();
    initVideoPlayer();
    initKeyboardNav();
});

// Navigation & Section Indicator Observer
function initNavigation() {
    const sections = document.querySelectorAll('.section-presentation');
    const indicator = document.getElementById('sectionIndicator');
    const navDotsContainer = document.getElementById('navDots');

    // Create 15 side navigation dots
    sections.forEach((sec, idx) => {
        const dot = document.createElement('div');
        dot.className = `nav-dot ${idx === 0 ? 'active' : ''}`;
        dot.title = `Section ${sec.getAttribute('data-index')}`;
        dot.addEventListener('click', () => {
            sec.scrollIntoView({ behavior: 'smooth' });
        });
        navDotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.nav-dot');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const indexStr = entry.target.getAttribute('data-index');
                const indexNum = parseInt(indexStr, 10);

                if (indicator) {
                    indicator.textContent = `${indexStr} / 15`;
                }

                dots.forEach((d, i) => {
                    if (i === indexNum - 1) {
                        d.classList.add('active');
                    } else {
                        d.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));
}

// Custom Video Player Controls
function initVideoPlayer() {
    const video = document.getElementById('promediaVideo');
    const overlay = document.getElementById('videoOverlay');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const seek = document.getElementById('videoSeek');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const container = document.getElementById('promediaVideoContainer');

    if (!video || !overlay) return;

    function togglePlay() {
        if (video.paused || video.ended) {
            video.play();
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            if (playPauseBtn) playPauseBtn.innerHTML = '<i data-lucide="pause" class="w-5 h-5"></i>';
        } else {
            video.pause();
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
            if (playPauseBtn) playPauseBtn.innerHTML = '<i data-lucide="play" class="w-5 h-5"></i>';
        }
        if (window.lucide) window.lucide.createIcons();
    }

    overlay.addEventListener('click', togglePlay);
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);

    video.addEventListener('timeupdate', () => {
        if (seek && video.duration) {
            seek.value = (video.currentTime / video.duration) * 100;
        }
    });

    if (seek) {
        seek.addEventListener('input', () => {
            if (video.duration) {
                video.currentTime = (seek.value / 100) * video.duration;
            }
        });
    }

    if (fullscreenBtn && container) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(err => {
                    console.error('Error attempting fullscreen:', err);
                });
            } else {
                document.exitFullscreen();
            }
        });
    }
}

// Global Lightbox
function openLightbox(src, caption = '') {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImage');
    const cap = document.getElementById('lightboxCaption');

    if (!modal || !img) return;

    img.src = src;
    if (cap) cap.textContent = caption;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (!modal) return;

    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

// DOP Selected Works Modal
function openDopWorksModal() {
    const modal = document.getElementById('dopWorksModal');
    const card = document.getElementById('dopModalCard');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        if (card) {
            card.classList.remove('scale-95');
            card.classList.add('scale-100');
        }
    }, 10);
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
}

function closeDopWorksModal() {
    const modal = document.getElementById('dopWorksModal');
    const card = document.getElementById('dopModalCard');
    if (!modal) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    if (card) {
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
    }
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

function handleDopModalBackdrop(e) {
    if (e.target.id === 'dopWorksModal') {
        closeDopWorksModal();
    }
}

// Keyboard Navigation & Escape
function initKeyboardNav() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeDopWorksModal();
        } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            // Find current section and scroll to next
            const sections = Array.from(document.querySelectorAll('.section-presentation'));
            const scrollPos = window.scrollY + 100;
            const currentSec = sections.find(s => s.offsetTop <= scrollPos && (s.offsetTop + s.offsetHeight) > scrollPos);
            if (currentSec) {
                const nextSec = currentSec.nextElementSibling;
                if (nextSec && nextSec.classList.contains('section-presentation')) {
                    e.preventDefault();
                    nextSec.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            const sections = Array.from(document.querySelectorAll('.section-presentation'));
            const scrollPos = window.scrollY + 100;
            const currentSec = sections.find(s => s.offsetTop <= scrollPos && (s.offsetTop + s.offsetHeight) > scrollPos);
            if (currentSec) {
                const prevSec = currentSec.previousElementSibling;
                if (prevSec && prevSec.classList.contains('section-presentation')) {
                    e.preventDefault();
                    prevSec.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });
}
