document.addEventListener("DOMContentLoaded", () => {
    const homePage = document.getElementById('home-page');
    const storePage = document.getElementById('store-page');
    const walletPage = document.getElementById('wallet-page');
    const statsPage = document.getElementById('stats-page');
    const funPage = document.getElementById('fun-page');
    const navHome = document.getElementById('nav-home');
    const navStore = document.getElementById('nav-store');
    const navWallet = document.getElementById('nav-wallet');
    const navStats = document.getElementById('nav-stats');
    const navFun = document.getElementById('nav-fun');
    const upgradeButtons = document.querySelectorAll('.upgrade-button');
    const coinAmountSpan = document.querySelector('.coin-amount');
    const character = document.getElementById('character'); // Получаем элемент персонажа

    let coins = 0; // Инициализация баланса монет с 0
    let autoClickers = {
        gym: { level: 0, basePrice: 50, increment: 1, currentRate: 0 },
        aiTap: { level: 0, basePrice: 50, increment: 5, currentRate: 0 },
        airdrop: { level: 0, basePrice: 500000, increment: 15, currentRate: 0 },
        defi: { level: 0, basePrice: 1000000, increment: 30, currentRate: 0 },
    };

    const pages = {
        'home-page': homePage,
        'store-page': storePage,
        'wallet-page': walletPage,
        'stats-page': statsPage,
        'fun-page': funPage
    };

    const hideAllPages = () => {
        Object.values(pages).forEach(page => {
            page.style.display = 'none';
        });
    };

    const showPage = (pageId) => {
        hideAllPages();
        pages[pageId].style.display = 'flex';
        updateNavigation(pageId);
    };

    const updateNavigation = (activePageId) => {
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        document.getElementById(`nav-${activePageId.split('-')[0]}`).classList.add('active');
    };

    navHome.addEventListener('click', () => showPage('home-page'));
    navStore.addEventListener('click', () => showPage('store-page'));
    navWallet.addEventListener('click', () => showPage('wallet-page'));
    navStats.addEventListener('click', () => showPage('stats-page'));
    navFun.addEventListener('click', () => showPage('fun-page'));

    upgradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const upgradeItem = button.parentElement;
            const upgradeType = upgradeItem.querySelector('.upgrade-details h3').textContent.toLowerCase();
            const price = getUpgradePrice(upgradeType);

            if (coins >= price) {
                coins -= price;
                coinAmountSpan.textContent = coins;
                autoClickers[upgradeType].level++;
                autoClickers[upgradeType].currentRate += autoClickers[upgradeType].increment;
                if (autoClickers[upgradeType].level === 1) {
                    startAutoClicker(upgradeType);
                }
                updateUpgradePrices();
            }
        });
    });

    // Добавляем обработчик события клика на персонажа
    character.addEventListener('click', (event) => {
        coins += 1; // Увеличиваем баланс монет на 1
        coinAmountSpan.textContent = coins; // Обновляем отображение баланса
        showCoinAnimation(event.clientX, event.clientY); // Показ анимации монеты
        updateUpgradePrices();
    });

    // Функция для отображения анимации монеты
    const showCoinAnimation = (x, y) => {
        const coinAnimation = document.createElement('div');
        coinAnimation.classList.add('coin-animation');
        coinAnimation.innerHTML = '<img src="assets/images/coins.svg" alt="Coin"><span>+1</span>';
        document.body.appendChild(coinAnimation);

        // Позиционирование анимации монеты рядом с местом клика
        coinAnimation.style.left = `${x}px`;
        coinAnimation.style.top = `${y}px`;

        // Удаление анимации монеты после завершения анимации
        coinAnimation.addEventListener('animationend', () => {
            coinAnimation.remove();
        });
    };

    const getUpgradePrice = (upgradeType) => {
        const basePrice = autoClickers[upgradeType].basePrice;
        const level = autoClickers[upgradeType].level;
        return Math.floor(basePrice * Math.pow(1.5, level));
    };

    const startAutoClicker = (upgradeType) => {
        setInterval(() => {
            coins += autoClickers[upgradeType].currentRate;
            coinAmountSpan.textContent = coins;
            updateUpgradePrices();
        }, 1000);
    };

    const updateUpgradePrices = () => {
        upgradeButtons.forEach(button => {
            const upgradeItem = button.parentElement;
            const upgradeType = upgradeItem.querySelector('.upgrade-details h3').textContent.toLowerCase();
            const price = getUpgradePrice(upgradeType);
            const priceText = upgradeItem.querySelector('.upgrade-details p');
            const level = autoClickers[upgradeType].level;
            const rate = autoClickers[upgradeType].currentRate;
            priceText.innerHTML = `${price} | level ${level}/10<br>${rate} Young coin - sec`;
            
            if (coins >= price) {
                button.style.backgroundColor = '#00ff00'; // Зеленый цвет при достаточном количестве монет
            } else {
                button.style.backgroundColor = '#ff3b30'; // Красный цвет при недостаточном количестве монет
            }
        });
    };

    // Предотвращаем зум и скролл на мобильных устройствах
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());

    // Предотвращаем двойной тап для зума и масштабирования
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});
