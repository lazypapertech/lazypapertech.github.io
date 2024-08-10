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

/*temporal*/
document.querySelectorAll('.side-menu p').forEach(link => {
    link.addEventListener('click', () => {
        const sideMenu = document.getElementById('sideMenu');
        sideMenu.classList.remove('active');
    });
});
/*temporal*/

document.getElementById('content-enhanced').addEventListener('click', () => {
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu.classList.contains('active')) {
        sideMenu.classList.remove('active');
    }
});
