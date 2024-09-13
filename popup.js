document.addEventListener('DOMContentLoaded', function () {
    const fetchButton = document.getElementById('fetchButton');
    const copyButton = document.getElementById('copyButton');
    const exportButton = document.getElementById('exportButton');

    fetchButton.addEventListener('click', () => {
        // Envoi d'un message au script content pour récupérer les statistiques
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'fetchStats' }, function (response) {
                if (response && response.success) {
                    // Récupère les stats Instagram du stockage local
                    chrome.storage.local.get(['username', 'fullName', 'followers', 'posts', 'following', 'biography', 'profilePic'], function (data) {
                        document.getElementById('username').textContent = data.username || 'Username';
                        document.getElementById('fullName').textContent = data.fullName || 'Full Name';
                        document.getElementById('followers').textContent = data.followers || 'Followers';
                        document.getElementById('following').textContent = data.following || 'Following';
                        document.getElementById('posts').textContent = data.posts || 'Posts';
                        document.getElementById('biography').textContent = data.biography || 'Biography';

                        // Affichage de l'image de profil
                        if (data.profilePic) {
                            const profilePicElement = document.getElementById('profilePic');
                            profilePicElement.src = data.profilePic;
                            profilePicElement.style.display = 'block';  // Rendre l'image visible
                        }

                        // Activer les boutons de copie et d'export
                        copyButton.disabled = false;
                        exportButton.disabled = false;
                    });

                } else {
                    alert('Échec de la récupération des statistiques Instagram.');
                }
            });
        });
    });

    // Fonction de copie dans le presse-papier
    copyButton.addEventListener('click', () => {
        const statsText = `
        Username: ${document.getElementById('username').textContent}
        Full Name: ${document.getElementById('fullName').textContent}
        Followers: ${document.getElementById('followers').textContent}
        Following: ${document.getElementById('following').textContent}
        Posts: ${document.getElementById('posts').textContent}
        Biography: ${document.getElementById('biography').textContent}
        `;
        navigator.clipboard.writeText(statsText);
        alert('Copié dans le presse-papier !');
    });

    // Fonction d'export en image
    exportButton.addEventListener('click', () => {
        html2canvas(document.querySelector('.stats-card')).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'instagram-stats.png';
            link.click();
        });
    });
});
