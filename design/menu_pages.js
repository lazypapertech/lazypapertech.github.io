function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.toggle('active');
}

document.querySelectorAll('.side-menu a').forEach(link => {
    link.addEventListener('click', () => {
        const sideMenu = document.getElementById('sideMenu');
        sideMenu.classList.remove('active');
    });
});

document.getElementById('content-enhanced').addEventListener('click', () => {
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu.classList.contains('active')) {
        sideMenu.classList.remove('active');
    }
});