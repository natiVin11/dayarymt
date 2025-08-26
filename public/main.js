// * קובץ JavaScript לאפקטים ויזואליים באתר "קבוצת דיירים מתחדשים בדרום".
// * הקוד מטפל בהופעת חלקים באתר בעת גלילה (Fade-in) ובאפקט הניצוצות ברקע.

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------- */
    /* אפקט הופעת אלמנטים בעת גלילה (Fade-in)
    /* הפונקציה בודקת אילו אלמנטים עם המחלקה 'fade-in' נראים במסך
    /* ומוסיפה להם את המחלקה 'in-view' כדי להפעיל את האנימציה
    /* ---------------------------------------------------- */
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // מוסיף את הקלאס 'in-view' כדי שה-CSS יפעיל את האנימציה
                entry.target.classList.add('in-view');
                // מפסיק לצפות באלמנט כדי שהאנימציה תופעל רק פעם אחת
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // מפעיל את האנימציה כאשר 10% מהאלמנט נראה
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    /* ---------------------------------------------------- */
    /* אפקט ניצוצות ברקע של ה-Hero
    /* הפונקציה יוצרת אלמנטים של 'ניצוצות' ומזיזה אותם באקראי
    /* כדי ליצור אפקט יוקרתי של נצנוץ
    /* ---------------------------------------------------- */
    const sparklesContainer = document.getElementById('sparkles-container');

    function createSparkle() {
        if (!sparklesContainer) return;

        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparklesContainer.appendChild(sparkle);

        const size = Math.random() * 3 + 1;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.left = `${Math.random() * 100}%`;

        // שינוי קל כדי להשתמש במשתני CSS במידת הצורך
        sparkle.style.setProperty('--rand-x', Math.random() * 200 - 100);
        sparkle.style.setProperty('--rand-y', Math.random() * 200 - 100);

        const animationDuration = Math.random() * 3 + 2;
        sparkle.style.animation = `sparkle-anim ${animationDuration}s ease-in-out infinite`;

        setTimeout(() => {
            sparkle.remove();
        }, animationDuration * 5000000);
    }

    if (sparklesContainer) {
        setInterval(createSparkle, 300);
    }
});

document.getElementById('contact-form').addEventListener('submit', function(e){
    e.preventDefault();

    const statusMessage = document.getElementById('status-message');
    statusMessage.classList.remove('hidden');
    statusMessage.textContent = 'שולח פניה...';

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    // החלף את כתובת ה-URL לשרת שלך
    fetch('https://your-server.com/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                statusMessage.textContent = 'הפניה נשלחה בהצלחה! תודה.';
                document.getElementById('contact-form').reset();
            } else {
                statusMessage.textContent = 'אירעה שגיאה בשליחת הפניה. נסה שוב.';
            }
        })
        .catch(error => {
            console.error(error);
            statusMessage.textContent = 'אירעה שגיאה. נסה שוב מאוחר יותר.';
        });
});
