const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);


let stars = [];


class ShootingStar {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * (canvas.height * 0.3);
        this.length = Math.random() * 60 + 30;
        this.speed = Math.random() * 4 + 1.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.blinkSpeed = Math.random() * 0.05 + 0.01;
        this.isTwinkling = Math.random() > 0.4;
        this.size = Math.random() * 1.5 + 0.5;
    }

    draw() {
        const gradient = ctx.createLinearGradient(
            this.x, this.y, 
            this.x - this.length, this.y - this.length * 0.5
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
       
        ctx.beginPath();
        ctx.strokeStyle = gradient; 
        ctx.lineWidth = this.size;
        ctx.moveTo(this.x, this.y); 
        ctx.lineTo(this.x - this.length, this.y - this.length * 0.5);
        ctx.stroke();

        ctx.save(); 
        ctx.shadowBlur = 10 * this.opacity; 
        ctx.shadowColor = "white";
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        if (this.opacity > 0.6) {
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
            ctx.beginPath(); 
            ctx.moveTo(this.x, this.y - 7); 
            ctx.lineTo(this.x, this.y + 7);
            ctx.moveTo(this.x - 7, this.y);
            ctx.lineTo(this.x + 7, this.y); 
            ctx.stroke();
        }
        ctx.restore();
    }

    update() {
        this.x += this.speed; 
        this.y += this.speed * 0.5;

        if (this.isTwinkling) { 
            this.opacity += this.blinkSpeed; 
            if (this.opacity > 1 || this.opacity < 0.2) {
                this.blinkSpeed = -this.blinkSpeed;
            }
        }

        if (this.y > canvas.height * 0.45 || this.x > canvas.width) {
            this.init(); 
            this.y = -20; 
        }
        this.draw();
    }
}


for (let i = 0; i < 12; i++) {
    stars.push(new ShootingStar());
}


function animate() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    stars.forEach(s => s.update()); 
    requestAnimationFrame(animate); 
}

animate();
const missionData = {
    start: {
        text: "ДЕНЬ 1. Посадка успішна.\nВи всередині модуля в кратері Єзеро. \nСистеми живлення пошкоджені. Радар показує дивну активність під землею.\n\nЩо зробимо першим?",
        choices: [
            { text: "Розгорнути сонячні панелі", next: "solar" },
            { text: "Дослідити джерело сигналу", next: "signal" }
        ],
        stats: { ox: 100, en: 30, rad: 5 }
    },
    solar: {
        text: "Панелі розгорнуто. Енергія відновлюється.\nРаптом здіймається пилова буря. \nМеханізми заклинило. Потрібно вийти назовні для ремонту.",
        choices: [
            { text: "Вийти в бурю (ризик)", next: "storm_repair" },
            { text: "Чекати закінчення бурі", next: "wait_storm" }
        ],
        stats: { ox: 90, en: 60, rad: 10 }
    },
    signal: {
        text: "Ви йдете на сигнал і знаходите вхід у печеру. \nСтіни покриті кристалами, що світяться. \nРадіація тут вища, але кисню більше.",
        choices: [
            { text: "Йти вглиб печери", next: "artifact" },
            { text: "Повернутися за інструментами", next: "solar" }
        ],
        stats: { ox: 95, en: 20, rad: 40 }
    },
    storm_repair: {
        text: "Ви назовні. Видимість нульова. \nВи відремонтували панелі, але пошкодили скафандр. \nКисень стрімко виходить!",
        choices: [
            { text: "Бігти до шлюзу", next: "base_safe" },
            { text: "Заклеїти дірку на місці", next: "failed_repair" }
        ],
        stats: { ox: 30, en: 80, rad: 15 }
    },
    wait_storm: {
        text: "Ви чекали занадто довго. \nПісок повністю засипав модулі. \nВи заблоковані. Енергія витрачається на обігрів.",
        choices: [
            { text: "Спробувати відкопатися", next: "manual_dig" },
            { text: "Подати сигнал SOS", next: "sos_call" }
        ],
        stats: { ox: 60, en: 10, rad: 5 }
    },
    artifact: {
        text: "Це інопланетний термінал! \nВін підключився до вашого шолома. \nВи бачите координати джерела води на Марсі.",
        choices: [
            { text: "Завантажити дані", next: "victory" },
            { text: "Знищити пристрій", next: "fail_security" }
        ],
        stats: { ox: 50, en: 15, rad: 80 }
    },
    base_safe: {
        text: "Ви в безпеці. Енергія стабільна. \nАле ви помітили, що принесли з собою марсіанський пил, \nякий починає рухатися самостійно...",
        choices: [
            { text: "Запустити дезінфекцію", next: "victory" },
            { text: "Дослідити пил", next: "assimilation" }
        ],
        stats: { ox: 80, en: 50, rad: 10 }
    },
    manual_dig: {
        text: "Серце калатає. Кисень закінчується від навантаження. \nВи бачите світло... Це не сонце, це чиїсь очі.",
        choices: [{ text: "ЗНЕПРИТОМНІТИ", next: "fail_death" }],
        stats: { ox: 5, en: 5, rad: 10 }
    },
    victory: {
        text: "ВІТАЄМО, КАПІТАНЕ!\nВи зробили відкриття століття. \nЗемля готує рятувальну експедицію. Ви вижили.",
        choices: [{ text: "НОВА МІСІЯ", next: "start" }],
        stats: { ox: 100, en: 100, rad: 0 }
    },
    fail_death: {
        text: "КРИТИЧНИЙ СТАН. \nРесурси вичерпано. Ваше тіло назавжди залишиться \nчастиною червоних пісків.",
        choices: [{ text: "ПЕРЕЗАПУСТИТИ ЦИКЛ", next: "start" }],
        stats: { ox: 0, en: 0, rad: 100 }
    }
};



function startQuest() {
    document.getElementById('start-zone').classList.add('hidden');
    document.getElementById('mission-box').classList.remove('hidden');

    const title = document.querySelector('.main-title');
    title.style.fontSize = '40px';
    title.style.letterSpacing = '20px';
    title.style.transition = 'all 0.8s ease';

    renderMission('start');
}

function renderMission(key) {
    const mission = missionData[key];
    if (!mission) return;

    const desc = document.getElementById('mission-description');
    const choicesDiv = document.getElementById('choices');

    desc.innerText = mission.text;
    choicesDiv.innerHTML = "";

    updateStats(mission.stats);

    mission.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = "action-btn";
        btn.innerText = choice.text;

        btn.onclick = () => {
            if (choice.next === "start") {
                resetToStart();
            } 
            else if (mission.stats && (mission.stats.ox <= 0 || mission.stats.en <= 0)) {
                renderMission('fail_death');
            } 
            else {
                renderMission(choice.next);
            }
        };
        choicesDiv.appendChild(btn);
    });
}


function resetToStart() {
   
    const title = document.querySelector('.main-title');
    title.style.fontSize = 'clamp(40px, 10vw, 100px)';
    title.style.letterSpacing = '40px';
    title.style.marginTop = '10vh';

    document.getElementById('mission-box').classList.add('hidden');
    document.getElementById('start-zone').classList.remove('hidden');

    updateStats({ ox: 100, en: 30, rad: 5 });
}

function updateStats(stats) {
    if (!stats) return;
    const oxBar = document.getElementById('ox-bar');
    const enBar = document.getElementById('en-bar');
    const radBar = document.getElementById('rad-bar');

    if (oxBar) oxBar.style.width = stats.ox + "%";
    if (enBar) enBar.style.width = stats.en + "%";
    if (radBar) {
        radBar.style.width = stats.rad + "%";
        radBar.style.backgroundColor = stats.rad > 60 ? "#ff0000" : "#00ff00";
    }
}