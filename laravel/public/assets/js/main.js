document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');

        if (!question || !answer) {
            return;
        }

        const closeItem = () => {
            item.classList.remove('open');
            question.setAttribute('aria-expanded', 'false');
            answer.setAttribute('aria-hidden', 'true');
            answer.style.maxHeight = '0px';
        };

        const openItem = () => {
            item.classList.add('open');
            question.setAttribute('aria-expanded', 'true');
            answer.setAttribute('aria-hidden', 'false');
            answer.style.maxHeight = `${answer.scrollHeight}px`;
        };

        const toggleItem = () => {
            const isOpen = item.classList.contains('open');

            if (isOpen) {
                closeItem();
                return;
            }

            faqItems.forEach((otherItem) => {
                if (otherItem === item) {
                    return;
                }

                const otherQuestion = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherIcon = otherItem.querySelector('.faq-icon');

                if (!otherQuestion || !otherAnswer) {
                    return;
                }

                otherItem.classList.remove('open');
                otherQuestion.setAttribute('aria-expanded', 'false');
                otherAnswer.setAttribute('aria-hidden', 'true');
                otherAnswer.style.maxHeight = '0px';
            });

            openItem();
        };

        item.addEventListener('click', () => {
            toggleItem();
        });

        question.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleItem();
            }
        });

        closeItem();
    });

    const navToggle = document.querySelector('.nav-toggle');
    const headerActions = document.querySelector('.header-actions');
    const header = document.querySelector('.header');
    const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
    const desktopMediaQuery = window.matchMedia('(min-width: 769px)');

    let lastScrollY = window.scrollY;
    let scrollTimeout = null;

    const updateHeaderCompactState = () => {
        if (!header) {
            return;
        }

        const shouldCompact = mobileMediaQuery.matches && window.scrollY > 0;

        header.classList.toggle('header--compact', shouldCompact);
    };

    const updateHeaderScrollState = () => {
        if (!header || !desktopMediaQuery.matches) {
            // На мобильных устройствах убираем классы, если они были добавлены
            header?.classList.remove('header--hidden', 'header--visible');
            return;
        }

        const currentScrollY = window.scrollY;
        const scrollDifference = currentScrollY - lastScrollY;

        // Если прокрутка вниз и мы не в самом верху
        if (scrollDifference > 0 && currentScrollY > 100) {
            header.classList.remove('header--visible');
            header.classList.add('header--hidden');
        }
        // Если прокрутка вверх
        else if (scrollDifference < 0) {
            header.classList.remove('header--hidden');
            header.classList.add('header--visible');
        }
        // Если мы в самом верху страницы
        else if (currentScrollY <= 100) {
            header.classList.remove('header--hidden');
            header.classList.add('header--visible');
        }

        lastScrollY = currentScrollY;
    };

    updateHeaderCompactState();
    updateHeaderScrollState();
    
    window.addEventListener('scroll', () => {
        updateHeaderCompactState();
        updateHeaderScrollState();
    });
    window.addEventListener('resize', () => {
        updateHeaderCompactState();
        updateHeaderScrollState();
        lastScrollY = window.scrollY;
    });

    if (navToggle && headerActions) {
        const navToggleImg = navToggle.querySelector('img');
        const menuIconSrc = 'images/icons/icon_menu.svg';
        const closeIconSrc = 'images/icons/icon_close_menu.svg';

        const closeMenu = () => {
            headerActions.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
            if (navToggleImg) {
                navToggleImg.src = menuIconSrc;
            }
        };

        const openMenu = () => {
            headerActions.classList.add('is-open');
            navToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('nav-open');
            if (navToggleImg) {
                navToggleImg.src = closeIconSrc;
            }
        };

        navToggle.addEventListener('click', () => {
            const isOpen = headerActions.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('nav-open', isOpen);
            if (navToggleImg) {
                navToggleImg.src = isOpen ? closeIconSrc : menuIconSrc;
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && headerActions.classList.contains('is-open')) {
                closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        headerActions.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                closeMenu();
            }
        });
    }

    const desktopNav = document.querySelector('.nav-menu-desktop');
    const navMore = desktopNav?.querySelector('[data-nav-more]');
    const navMoreButton = navMore?.querySelector('.nav-menu-more-button');
    const navMoreDropdown = navMore?.querySelector('.nav-menu-more-dropdown');

    if (desktopNav && navMore && navMoreButton && navMoreDropdown) {
        const headerContent = desktopNav.closest('.header-content');
        const headerButtons = headerContent?.querySelector('.header-buttons');
        const logo = headerContent?.querySelector('.logo');

        const closeOverflowDropdown = () => {
            navMoreDropdown.hidden = true;
            navMore.classList.remove('is-open');
            navMoreButton.setAttribute('aria-expanded', 'false');
        };

        const restoreOverflowItems = () => {
            while (navMoreDropdown.firstChild) {
                desktopNav.insertBefore(navMoreDropdown.firstChild, navMore);
            }
        };

        const updateNavOverflow = () => {
            restoreOverflowItems();
            closeOverflowDropdown();

            if (window.innerWidth <= 768) {
                navMore.hidden = true;
                return;
            }

            navMore.hidden = false;
            
            const hasOverflow = () => {
                if (!headerContent || !headerButtons) {
                    return desktopNav.scrollWidth > desktopNav.clientWidth;
                }
                
                const contentWidth = headerContent.clientWidth;
                const logoWidth = logo ? logo.offsetWidth : 0;
                const buttonsWidth = headerButtons.offsetWidth;
                const gap = 40; // gap между меню и кнопками (2.5rem = 40px)
                const availableWidth = contentWidth - logoWidth - buttonsWidth - gap;
                const menuWidth = desktopNav.scrollWidth;
                
                // Проверяем, не превышает ли ширина меню доступное пространство
                return menuWidth > availableWidth;
            };

            while (hasOverflow()) {
                const lastVisibleItem = navMore.previousElementSibling;

                if (!lastVisibleItem || lastVisibleItem === navMore) {
                    break;
                }

                navMoreDropdown.prepend(lastVisibleItem);
            }

            if (!navMoreDropdown.childElementCount) {
                navMore.hidden = true;
            }
        };

        navMoreButton.addEventListener('click', () => {
            const expanded = navMoreButton.getAttribute('aria-expanded') === 'true';
            navMoreButton.setAttribute('aria-expanded', String(!expanded));
            navMore.classList.toggle('is-open', !expanded);
            navMoreDropdown.hidden = expanded;
        });

        document.addEventListener('click', (event) => {
            if (!navMore.contains(event.target)) {
                closeOverflowDropdown();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeOverflowDropdown();
            }
        });

        navMoreDropdown.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                closeOverflowDropdown();
            }
        });

        if (typeof ResizeObserver !== 'undefined') {
            const navResizeObserver = new ResizeObserver(() => {
                updateNavOverflow();
            });
            navResizeObserver.observe(desktopNav);
            if (headerContent) {
                navResizeObserver.observe(headerContent);
            }
            if (headerButtons) {
                navResizeObserver.observe(headerButtons);
            }
            if (logo) {
                navResizeObserver.observe(logo);
            }
        }

        window.addEventListener('resize', updateNavOverflow);
        window.addEventListener('load', updateNavOverflow);
        updateNavOverflow();
    }

    // Центрирование diagonal connector относительно solution cards
    const updateDiagonalConnectorPosition = () => {
        const connector = document.querySelector('.solution-connector.diagonal');
        const solutionsGrid = document.querySelector('.solutions-grid');
        
        if (!connector || !solutionsGrid) {
            return;
        }

        // На мобильных и планшетах (<= 768px) используем CSS с transform
        // На десктопе (> 768px) используем динамическое позиционирование
        const isDesktop = window.innerWidth > 768;
        
        if (!isDesktop) {
            // Удаляем inline стили, чтобы CSS мог управлять позиционированием
            connector.style.top = '';
            return;
        }

        // Находим все solution cards
        const solutionCards = Array.from(solutionsGrid.querySelectorAll('.solution-card'));
        
        if (solutionCards.length < 2) {
            return;
        }

        // Находим карточки, которые находятся рядом с коннектором
        // Коннектор находится между 2-й и 3-й карточками (индексы 1 и 2)
        const cardBefore = solutionCards[1]; // Вторая карточка (SEO-продвижение)
        const cardAfter = solutionCards[2]; // Третья карточка (Интеграция)

        if (!cardBefore || !cardAfter) {
            return;
        }

        // Получаем позиции карточек относительно grid
        const gridRect = solutionsGrid.getBoundingClientRect();
        const cardBeforeRect = cardBefore.getBoundingClientRect();
        const cardAfterRect = cardAfter.getBoundingClientRect();

        // Вычисляем центр каждой карточки относительно grid
        const cardBeforeCenter = (cardBeforeRect.top - gridRect.top) + (cardBeforeRect.height / 2);
        const cardAfterCenter = (cardAfterRect.top - gridRect.top) + (cardAfterRect.height / 2);
        
        // Средняя точка между центрами карточек
        const centerY = (cardBeforeCenter + cardAfterCenter) / 2;
        
        // Высота коннектора (68px согласно CSS)
        const connectorHeight = 68;
        
        // Устанавливаем позицию коннектора по центру (относительно grid)
        connector.style.top = `${centerY - connectorHeight / 2}px`;
    };

    // Вызываем функцию при загрузке и изменении размеров
    const diagonalConnector = document.querySelector('.solution-connector.diagonal');
    const solutionsGrid = document.querySelector('.solutions-grid');
    
    if (diagonalConnector && solutionsGrid) {
        // Используем ResizeObserver для отслеживания изменений размеров карточек
        if (typeof ResizeObserver !== 'undefined') {
            const connectorResizeObserver = new ResizeObserver(() => {
                updateDiagonalConnectorPosition();
            });
            
            // Наблюдаем за grid и всеми карточками
            connectorResizeObserver.observe(solutionsGrid);
            solutionsGrid.querySelectorAll('.solution-card').forEach(card => {
                connectorResizeObserver.observe(card);
            });
        }
        
        // Также обновляем при изменении размера окна
        window.addEventListener('resize', updateDiagonalConnectorPosition);
        
        // Вызываем сразу
        updateDiagonalConnectorPosition();
        
        // Вызываем после полной загрузки страницы
        window.addEventListener('load', updateDiagonalConnectorPosition);
    }

    // Управление подсветкой карточек в блоке how-to-get
    const stepCards = document.querySelectorAll('.how-to-get .step-card');
    if (stepCards.length > 0) {
        const firstCard = stepCards[0];

        // Устанавливаем первую карточку как активную по умолчанию
        firstCard.classList.add('active');

        // Поведение для десктопа (hover)
        stepCards.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                stepCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });

            card.addEventListener('mouseleave', () => {
                stepCards.forEach(c => c.classList.remove('active'));
                firstCard.classList.add('active');
            });
        });

        // Дополнительное поведение для тач-устройств:
        // при прокрутке активируется та карточка, которая больше всего видна в вьюпорте
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice) {
            const howToGetSection = document.querySelector('.how-to-get');

            const updateActiveStepOnScroll = () => {
                if (!howToGetSection) {
                    return;
                }

                const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                const viewportCenter = viewportHeight / 2;

                let bestCard = firstCard;
                let bestDistance = Infinity;

                stepCards.forEach((card) => {
                    const rect = card.getBoundingClientRect();

                    // Пропускаем карточки, которые полностью вне вьюпорта
                    if (rect.bottom <= 0 || rect.top >= viewportHeight) {
                        return;
                    }

                    const cardCenter = rect.top + rect.height / 2;
                    const distanceToCenter = Math.abs(cardCenter - viewportCenter);

                    if (distanceToCenter < bestDistance) {
                        bestDistance = distanceToCenter;
                        bestCard = card;
                    }
                });

                // Обновляем active: подсвечиваем карточку, центр которой ближе всего к центру экрана
                stepCards.forEach(c => c.classList.remove('active'));
                (bestCard || firstCard).classList.add('active');
            };

            // Первичный расчёт
            updateActiveStepOnScroll();

            // Обновляем при прокрутке и ресайзе
            window.addEventListener('scroll', updateActiveStepOnScroll, { passive: true });
            window.addEventListener('resize', updateActiveStepOnScroll);
        }
    }

    const initTariffAnimations = () => {
        const tariffsSection = document.querySelector('.tariffs');
        if (!tariffsSection) return;

        const tariffCards = tariffsSection.querySelectorAll('.tariff-card');
        let featuresAnimationStarted = false;
        let initialSectionTop = null;

        const animateTariffsCards = () => {
            if (tariffsSection.classList.contains('tariffs--visible')) return;
            tariffsSection.classList.add('tariffs--visible');
            initialSectionTop = tariffsSection.getBoundingClientRect().top;
        };

        const animateTariffFeatures = () => {
            if (featuresAnimationStarted) return;
            featuresAnimationStarted = true;

            tariffCards.forEach((card, cardIndex) => {
                card.querySelectorAll('.tariff-features li').forEach((item, itemIndex) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, cardIndex * 300 + itemIndex * 180);
                });
            });
        };

        const checkScrollForFeatures = () => {
            if (featuresAnimationStarted || !tariffsSection.classList.contains('tariffs--visible')) return;

            const currentTop = tariffsSection.getBoundingClientRect().top;
            const twoLinesHeight = 100;

            if (initialSectionTop === null) {
                initialSectionTop = currentTop;
            }

            if (initialSectionTop - currentTop >= twoLinesHeight || currentTop < 150) {
                animateTariffFeatures();
            }
        };

        const tariffsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateTariffsCards();
                    setTimeout(checkScrollForFeatures, 100);
                    tariffsObserver.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '50% 0px 0px 0px', threshold: 0.1 });

        const rect = tariffsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Если секция уже видна при загрузке и находится выше середины экрана, анимируем сразу
        if (rect.top < windowHeight / 2 && rect.bottom > 0) {   
            animateTariffsCards();
            setTimeout(() => {
                if (initialSectionTop === null) {
                    initialSectionTop = tariffsSection.getBoundingClientRect().top;
                }
                checkScrollForFeatures();
            }, 100);
        } else {
            tariffsObserver.observe(tariffsSection);
        }

        window.addEventListener('scroll', checkScrollForFeatures, { passive: true });
        
        setTimeout(() => {
            if (tariffsSection.classList.contains('tariffs--visible')) {
                if (initialSectionTop === null) {
                    initialSectionTop = tariffsSection.getBoundingClientRect().top;
                }
                checkScrollForFeatures();
            }
        }, 300);
    };

    initTariffAnimations();

    // Инициализация анимаций для всех секций (кроме hero)
    // Примечание: .additional-solutions использует GSAP анимацию (см. initSolutionCardsAnimation)
    const initSectionAnimations = () => {
        const sections = [
            { selector: '.how-to-get', visibleClass: 'how-to-get--visible' },
            { selector: '.benefits', visibleClass: 'benefits--visible' },
            // { selector: '.additional-solutions', visibleClass: 'additional-solutions--visible' }, // Убрано - используется GSAP
            { selector: '.privileges', visibleClass: 'privileges--visible' },
            { selector: '.subscribers', visibleClass: 'subscribers--visible' },
            { selector: '.faq', visibleClass: 'faq--visible' },
            { selector: '.subscribe-form-section', visibleClass: 'subscribe-form-section--visible' },
            { selector: '.we-manage-section', visibleClass: 'we-manage-section--visible' }
        ];

        sections.forEach(({ selector, visibleClass }) => {
            const section = document.querySelector(selector);
            if (!section) return;

            // Если секция уже имеет класс visible, пропускаем
            if (section.classList.contains(visibleClass)) {
                return;
            }

            const animateSection = () => {
                if (section.classList.contains(visibleClass)) return;
                section.classList.add(visibleClass);
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSection();
                        observer.unobserve(entry.target);
                    }
                });
            }, { root: null, rootMargin: '50% 0px 0px 0px', threshold: 0.1 });

            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // Если секция уже видна при загрузке и находится выше середины экрана, анимируем сразу
            if (rect.top < windowHeight / 2 && rect.bottom > 0) {
                animateSection();
            } else {
                observer.observe(section);
            }
        });
    };

    initSectionAnimations();

    // Маска телефона +7
    const phoneInput = document.querySelector('#subscribe-form-section input[data-phone-mask]');
    const phoneForm = document.querySelector('#subscribe-form-section .subscribe-form');
    if (phoneInput && phoneForm) {
        const PLACEHOLDER = '+7 (___) ___-__-__';

        const toDigits = (v) => {
            const d = v.replace(/\D/g, '');
            return d.startsWith('8') ? '7' + d.slice(1) : (d.startsWith('7') ? d : '7' + d);
        };

        const formatPhone = (value) => {
            const digits = value.replace(/\D/g, '');
            const d = toDigits(value).slice(1, 11);
            if (!d.length) {
                if (digits === '8') return '+7 (';
                if (digits === '7') return (value === '+7' || value === '+7 ') ? '' : '+7 (';
                return '';
            }
            const s = (a, b) => '+7 (' + d.slice(0, 3) + ') ' + d.slice(3, 6) + a + d.slice(6, 8) + b + d.slice(8, 10);
            return d.length <= 3 ? '+7 (' + d : d.length <= 6 ? s('', '') : d.length <= 8 ? s('-', '') : s('-', '-');
        };

        const isValid = (v) => /^7[0-9]{10}$/.test(toDigits(v));
        const setError = (on) => phoneInput.classList.toggle('error', on);

        phoneInput.addEventListener('focus', () => { if (!phoneInput.value) phoneInput.placeholder = PLACEHOLDER; });
        phoneInput.addEventListener('blur', () => {
            const val = phoneInput.value;
            if (!val?.trim()) { phoneInput.placeholder = ''; setError(false); return; }
            setError(!isValid(val));
            if (isValid(val)) phoneInput.value = formatPhone(val);
        });
        phoneInput.addEventListener('input', (e) => {
            phoneInput.value = formatPhone(e.target.value);
            if (phoneInput.value) setError(false);
        });
        phoneInput.addEventListener('paste', (e) => {
            e.preventDefault();
            phoneInput.value = formatPhone((e.clipboardData || window.clipboardData).getData('text'));
        });
        phoneForm.addEventListener('submit', (e) => {
            if (!phoneInput.value || !isValid(phoneInput.value)) {
                e.preventDefault();
                setError(true);
                phoneInput.focus();
                return;
            }
            phoneInput.value = formatPhone(phoneInput.value);
        });

        if (phoneInput.value) phoneInput.value = formatPhone(phoneInput.value);
    }

    // Обработка изменения размера окна для мобильных устройств
    window.addEventListener('resize', () => {
        const sections = [
            { selector: '.how-to-get', visibleClass: 'how-to-get--visible' },
            { selector: '.benefits', visibleClass: 'benefits--visible' },
            // { selector: '.additional-solutions', visibleClass: 'additional-solutions--visible' }, // Убрано - используется GSAP
            { selector: '.privileges', visibleClass: 'privileges--visible' },
            { selector: '.subscribers', visibleClass: 'subscribers--visible' },
            { selector: '.faq', visibleClass: 'faq--visible' },
            { selector: '.subscribe-form-section', visibleClass: 'subscribe-form-section--visible' },
            { selector: '.we-manage-section', visibleClass: 'we-manage-section--visible' }
        ];

        sections.forEach(({ selector, visibleClass }) => {
            const section = document.querySelector(selector);
            if (!section) return;
        });
    });

    // Плавная прокрутка к якорям с анимацией 600ms
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        
        if (!link) {
            return;
        }

        const href = link.getAttribute('href');
        
        // Пропускаем пустые якоря (#)
        if (href === '#' || !href) {
            return;
        }

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId) || document.querySelector(`[name="${targetId}"]`);

        if (targetElement) {
            event.preventDefault();
            
            const headerOffset = 100; // Отступ сверху
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            const startPosition = window.pageYOffset;
            const distance = offsetPosition - startPosition;
            const duration = 600; // 600ms
            let start = null;

            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const progressPercent = Math.min(progress / duration, 1);
                
                // Используем easing функцию для более плавной анимации
                const easeInOutCubic = progressPercent < 0.5
                    ? 4 * progressPercent * progressPercent * progressPercent
                    : 1 - Math.pow(-2 * progressPercent + 2, 3) / 2;
                
                window.scrollTo(0, startPosition + distance * easeInOutCubic);
                
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            };

            window.requestAnimationFrame(step);
        }
    });

    // Tariff tab switcher
    const initTariffTabs = () => {
        const tabsWrapper = document.getElementById('tariffTabs');
        if (!tabsWrapper) return;

        const tabs = tabsWrapper.querySelectorAll('.tariff-tab');
        const slider = document.getElementById('tariffTabSlider');
        const grid = document.querySelector('.tariffs-grid');
        if (!tabs.length || !slider || !grid) return;

        const positionSlider = (activeTab) => {
            slider.style.width = activeTab.offsetWidth + 'px';
            slider.style.height = activeTab.offsetHeight + 'px';
            slider.style.left = activeTab.offsetLeft + 'px';
            slider.style.top = activeTab.offsetTop + 'px';
        };

        const showTariff = (type) => {
            grid.querySelectorAll('.tariff-card').forEach(card => {
                card.style.display = card.classList.contains('tariff-' + type) ? '' : 'none';
            });
        };

        const activateTab = (tab) => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            positionSlider(tab);
            showTariff(tab.dataset.tariffType);
        };

        tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab)));

        const firstTab = tabsWrapper.querySelector('.tariff-tab.active');
        if (firstTab) {
            requestAnimationFrame(() => positionSlider(firstTab));
            showTariff(firstTab.dataset.tariffType);
        }

        window.addEventListener('resize', () => {
            const active = tabsWrapper.querySelector('.tariff-tab.active');
            if (active) positionSlider(active);
        });
    };

    initTariffTabs();

    // Document (PDF) viewer popup
    const initDocPopup = () => {
        const modal = document.getElementById('docViewerModal');
        if (!modal) return;

        const overlay = document.getElementById('docViewerOverlay');
        const closeBtn = document.getElementById('docViewerClose');
        const frame = document.getElementById('docViewerFrame');
        const titleEl = document.getElementById('docViewerTitle');

        const openModal = (url, title) => {
            frame.src = url;
            if (titleEl) titleEl.textContent = title || '';
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.style.display = 'none';
            frame.src = '';
            document.body.style.overflow = '';
        };

        if (overlay) overlay.addEventListener('click', closeModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display !== 'none') closeModal();
        });

        document.addEventListener('click', (e) => {
            const link = e.target.closest('.doc-popup-link');
            if (!link) return;
            e.preventDefault();
            openModal(link.getAttribute('href'), link.dataset.docTitle || '');
        });
    };

    initDocPopup();

    // Contact dropdown toggle
    document.querySelectorAll('.contact-dropdown-wrapper').forEach((wrapper) => {
        const btn = wrapper.querySelector('.btn-contact-text');
        const dropdown = wrapper.querySelector('.contact-dropdown');
        if (!btn || !dropdown) return;

        const open = () => {
            dropdown.hidden = false;
            btn.setAttribute('aria-expanded', 'true');
        };
        const close = () => {
            dropdown.hidden = true;
            btn.setAttribute('aria-expanded', 'false');
        };

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.hidden ? open() : close();
        });

        dropdown.addEventListener('click', (e) => {
            if (e.target.closest('a')) close();
        });

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    });

    // Subscribe form: success popup — only after successful submit
    const subscribeSuccessFlag = document.getElementById('subscribeSuccessFlag');
    const subscribeSuccessModal = document.getElementById('subscribeSuccessModal');

    if (subscribeSuccessFlag && subscribeSuccessModal) {
        const overlay = subscribeSuccessModal.querySelector('#subscribeSuccessModalOverlay');
        const closeButton = subscribeSuccessModal.querySelector('[data-subscribe-success-close]');

        const openSubscribeSuccessModal = () => {
            subscribeSuccessModal.style.display = 'flex';
            document.body.classList.add('modal-open');
        };

        const closeSubscribeSuccessModal = () => {
            subscribeSuccessModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        };

        if (overlay) {
            overlay.addEventListener('click', closeSubscribeSuccessModal);
        }

        if (closeButton) {
            closeButton.addEventListener('click', closeSubscribeSuccessModal);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeSubscribeSuccessModal();
            }
        });

        // Show modal when there is a success flag in the markup (after redirect)
        openSubscribeSuccessModal();
    }
});




