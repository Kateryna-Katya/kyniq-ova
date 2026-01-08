// Регистрируем плагины GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin);

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (Lucide)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. ЭФФЕКТ ХЕДЕРА ПРИ СКРОЛЛЕ
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('header--scrolled', window.scrollY > 50);
        }
    });

    // 3. АНИМАЦИЯ HERO (С защитой от разрыва слов)
    const initHeroAnimation = () => {
        // types: 'words, chars' — оборачивает слова в блоки, предотвращая их разрыв при переносе
        const heroTitle = new SplitType('#hero-title', { types: 'words, chars' });
        
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.to('.hero__title .char', {
            y: 0,
            opacity: 1,
            stagger: 0.02,
            duration: 1,
            delay: 0.5
        })
        .to('.hero__subtitle', { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
        .to('.hero__actions', { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
        .to('.hero__stats', { opacity: 1, duration: 0.8 }, "-=0.4")
        .from('.bento-hero', { scale: 0.8, opacity: 0, duration: 1.2, ease: "expo.out" }, "-=1.2");

        // Параллакс мыши для Hero
        const heroVisual = document.querySelector('.hero__visual');
        if (heroVisual) {
            window.addEventListener('mousemove', (e) => {
                const x = (e.clientX - window.innerWidth / 2) / 50;
                const y = (e.clientY - window.innerHeight / 2) / 50;
                gsap.to('.bento-hero', { rotationY: x, rotationX: -y, duration: 1 });
            });
        }
    };

    // 4. СКРОЛЛ-АНИМАЦИИ ДЛЯ КАРТОЧЕК (Bento & Benefits)
    const initScrollAnimations = () => {
        gsap.utils.toArray('.animate-on-scroll').forEach((card, i) => {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    };

    // 5. ДЕМО: КОД ПРОТИВ AI
    const initInnovationDemo = () => {
        const demoTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#ai-demo",
                start: "top 70%",
            }
        });

        const traditionalCode = `function analyzeMarket(data) {\n  return data.filter(item => {\n    return item.region === 'Italy' && item.growth > 0;\n  });\n}`;
        const aiPromptText = "Проанализируй рынок Италии 2026";

        demoTl
            .to("#traditional-code", { duration: 2.5, text: traditionalCode, ease: "none" })
            .to("#ai-text-input", { duration: 1.5, text: aiPromptText, ease: "none" }, "-=1")
            .to("#ai-progress", { 
                innerText: 100, 
                duration: 1, 
                snap: { innerText: 1 },
                onUpdate: function() { this.targets()[0].innerHTML = Math.ceil(this.targets()[0].innerText) + "%"; }
            });
    };

    // 6. КОНТАКТЫ И ВРЕМЯ
    const initContact = () => {
        const updateTime = () => {
            const timeEl = document.getElementById('milan-time');
            if (timeEl) {
                timeEl.textContent = new Date().toLocaleTimeString('it-IT', {
                    timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', second: '2-digit'
                });
            }
        };
        setInterval(updateTime, 1000);

        // Валидация телефона (только цифры)
        const phone = document.getElementById('user-phone');
        if (phone) phone.addEventListener('input', e => e.target.value = e.target.value.replace(/[^\d+]/g, ''));

        // Обработка формы
        const form = document.getElementById('main-contact-form');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                const btn = form.querySelector('button');
                btn.textContent = 'Отправка...';
                setTimeout(() => {
                    form.reset();
                    btn.innerHTML = '<span>Запросить доступ</span> <i data-lucide="send"></i>';
                    lucide.createIcons();
                    alert('Успешно отправлено!');
                }, 1500);
            });
        }
    };

    // 7. COOKIE POPUP
    const initCookies = () => {
        const popup = document.getElementById('cookie-popup');
        const acceptBtn = document.getElementById('cookie-accept');
        const rejectBtn = document.getElementById('cookie-reject');

        if (!localStorage.getItem('cookie-consent')) {
            setTimeout(() => {
                popup.style.display = 'block';
                gsap.fromTo(popup, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
            }, 2000);
        }

        const closePopup = () => {
            gsap.to(popup, { y: 50, opacity: 0, duration: 0.3, onComplete: () => popup.style.display = 'none' });
        };

        if (acceptBtn) acceptBtn.onclick = () => { localStorage.setItem('cookie-consent', 'accepted'); closePopup(); };
        if (rejectBtn) rejectBtn.onclick = () => { localStorage.setItem('cookie-consent', 'rejected'); closePopup(); };
    };

    // Запуск всех модулей
    initHeroAnimation();
    initScrollAnimations();
    initInnovationDemo();
    initContact();
    initCookies();
    const initMobileMenu = () => {
    const burger = document.getElementById('burger-menu');
    const menu = document.getElementById('mobile-menu');
    const body = document.body;
    const links = document.querySelectorAll('.mobile-nav__link');

    // Создаем таймлайн для анимации меню
    const menuTl = gsap.timeline({ paused: true });

    menuTl.to(menu, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.4,
        ease: 'power2.out'
    })
    .to('.mobile-nav__item', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
    }, "-=0.2")
    .to('.mobile-menu__footer', {
        opacity: 1,
        duration: 0.4
    }, "-=0.3");

    const toggleMenu = () => {
        const isOpen = burger.classList.contains('active');
        
        if (!isOpen) {
            burger.classList.add('active');
            menu.classList.add('active');
            body.style.overflow = 'hidden'; // Блокируем скролл
            menuTl.play();
        } else {
            burger.classList.remove('active');
            menu.classList.remove('active');
            body.style.overflow = '';
            menuTl.reverse();
        }
    };

    burger.addEventListener('click', toggleMenu);

    // Закрытие при клике на ссылку (используем forEach как вы просили)
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (burger.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
};

// Вызовите функцию внутри DOMContentLoaded
initMobileMenu();
});