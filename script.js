// Модуль для улучшений
class Upgrade {
    constructor(id, name, description, cost, image, interval, rate) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.image = image;
        this.interval = interval;
        this.count = 0;
        this.rate = rate;
    }

    updateCost() {
        this.cost = Math.floor(this.cost * 2); // Увеличиваем стоимость улучшения
    }

    render() {
        const upgradeItem = document.createElement('div');
        upgradeItem.classList.add('upgrade-item');
        upgradeItem.innerHTML = `
            <img src="${this.image}" alt="${this.name}">
            <div>
                <h3>${this.name}</h3>
                <p>${this.description}</p>
                <p class="upgrade-cost">Цена: ${this.cost} котят</p>
            </div>
        `;

        // Обработчик клика для подтверждения покупки
        upgradeItem.addEventListener("click", () => {
            if (confirm(`Купить ${this.name} за ${this.cost} котят?`)) {
                buyUpgrade(this.id);
            }
        });

        return upgradeItem;
    }
}

// Класс для пользователя
class User {
    constructor() {
        this.seed = this.generateSeed();
        this.clickCount = 0;
        this.achievements = [
            { id: 1, description: "Заработать 10 котят", goal: 10, achieved: false },
            { id: 2, description: "Заработать 100 котят", goal: 100, achieved: false },
            { id: 3, description: "Заработать 1000 котят", goal: 1000, achieved: false },
            { id: 4, description: "Заработать 10000 котят", goal: 10000, achieved: false },
            { id: 5, description: "Заработать 100000 котят", goal: 100000, achieved: false },
            { id: 6, description: "Заработать 1000000 котят", goal: 1000000, achieved: false },
            { id: 7, description: "Заработать 10000000 котят", goal: 10000000, achieved: false },
            { id: 8, description: "Заработать 100000000 котят", goal: 100000000, achieved: false },
            { id: 9, description: "Заработать 1000000000 котят", goal: 1000000000, achieved: false }
        ];
        this.upgrades = [
            new Upgrade(1, "Курсор", "Гладит рандомного уличного кота раз в 5 секунд", 15, "images/cursor.png", 5000, 1),
            new Upgrade(2, "Бабушка", "Бабушка подбирает уличных котят каждые 15 секунд", 100, "images/grandma.png", 15000, 10),
            new Upgrade(3, "Завод", "Производит 100 котят каждые 30 секунд", 500, "images/factory.png", 30000, 100)
        ];
    }

    generateSeed() {
        return Math.random().toString(36).substr(2, 9);
    }

    updateAchievements() {
        this.achievements.forEach(achievement => {
            if (this.clickCount >= achievement.goal && !achievement.achieved) {
                achievement.achieved = true;
            }
        });
    }

    saveToCookies() {
        const gameState = {
            clickCount: this.clickCount,
            achievements: this.achievements,
            upgrades: this.upgrades,
            seed: this.seed
        };
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        document.cookie = `gameProgress=${JSON.stringify(gameState)}; expires=${expires.toUTCString()}; path=/`;
    }

    loadFromCookies() {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('gameProgress='));
        if (cookie) {
            const savedState = JSON.parse(cookie.split('=')[1]);
            if (savedState) {
                this.clickCount = savedState.clickCount || 0;
                this.achievements = savedState.achievements || this.achievements;
                this.upgrades = savedState.upgrades || this.upgrades;
                this.seed = savedState.seed || this.seed;
            }
        }
    }
}

let user = new User();

function renderAchievements() {
    const achievementsList = document.getElementById("achievements-list");
    achievementsList.innerHTML = "";
    user.achievements.forEach(achievement => {
        const achievementItem = document.createElement("div");
        achievementItem.classList.add("achievement-item");
        achievementItem.style.backgroundColor = achievement.achieved ? "white" : "grey";
        achievementItem.textContent = achievement.description;
        achievementsList.appendChild(achievementItem);
    });
}

function updateClickCount() {
    document.getElementById("clicks").textContent = `Котят: ${user.clickCount}`;
    const seedElement = document.getElementById("seed-value");
    if (seedElement) {
        seedElement.textContent = `Seed: ${user.seed}`;
    }
}

function renderUpgrades() {
    const upgradesContainer = document.getElementById('upgrades-container');
    upgradesContainer.innerHTML = '';
    user.upgrades.forEach(upgrade => {
        upgradesContainer.appendChild(upgrade.render());
    });
}

function incrementCounter() {
    user.clickCount++;
    updateClickCount();
    user.updateAchievements();
    user.seed = user.generateSeed();
    user.saveToCookies();
    renderAchievements();
}

function buyUpgrade(id) {
    const upgrade = user.upgrades.find(u => u.id === id);
    if (user.clickCount >= upgrade.cost) {
        user.clickCount -= upgrade.cost;
        upgrade.count++;
        upgrade.updateCost();
        updateClickCount();
        renderUpgrades();
        user.seed = user.generateSeed();
        user.saveToCookies();
    } else {
        alert("Недостаточно котят для покупки!");
    }
}

const burgerButton = document.getElementById("burger-button");
const sideMenu = document.getElementById("side-menu");

burgerButton.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
});

function showTab(tabName) {
    const tabs = ['game', 'shop', 'developer', 'upgrades-info', 'achievements', 'players'];
    tabs.forEach(tab => {
        const tabElement = document.getElementById(tab);
        tabElement.style.display = tab === tabName ? 'block' : 'none';
    });
    sideMenu.classList.remove("open");
}

window.addEventListener('load', () => {
    user.loadFromCookies();
    updateClickCount();
    renderUpgrades();
    renderAchievements();
});

function updateUpgradesInfo() {
    document.getElementById("cursor-count").textContent = user.upgrades[0].count;
    document.getElementById("cursor-rate").textContent = user.upgrades[0].count * user.upgrades[0].rate;
    document.getElementById("grandma-count").textContent = user.upgrades[1].count;
    document.getElementById("grandma-rate").textContent = user.upgrades[1].count * user.upgrades[1].rate;
    document.getElementById("factory-count").textContent = user.upgrades[2].count;
    document.getElementById("factory-rate").textContent = user.upgrades[2].count * user.upgrades[2].rate;
}
