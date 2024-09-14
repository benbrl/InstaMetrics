document.addEventListener('DOMContentLoaded', function () {
    const fetchButton = document.getElementById('fetchButton');
    const copyButton = document.getElementById('copyButton');
    const exportButton = document.getElementById('exportButton');

    fetchButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'fetchStats' }, function (response) {
                if (response && response.success) {
                    chrome.storage.local.get(['username', 'fullName', 'followers', 'following', 'posts', 'biography', 'profilePic'], function (data) {
                        document.getElementById('username').textContent = data.username || 'Username';
                        document.getElementById('fullName').textContent = data.fullName || 'Full Name';
                        document.getElementById('followers').textContent = data.followers || 'Followers';
                        document.getElementById('following').textContent = data.following || 'Following';
                        document.getElementById('posts').textContent = data.posts || 'Posts';
                        document.getElementById('biography').textContent = data.biography || 'Biography';

                        if (data.profilePic) {
                            const profilePicElement = document.getElementById('profilePic');
                            profilePicElement.src = data.profilePic;
                            profilePicElement.style.display = 'block';
                        }

                        copyButton.disabled = false;
                        exportButton.disabled = false;
                    });
                } else {
                    alert('Échec de la récupération des statistiques Instagram.');
                }
            });
        });
    });

    copyButton.addEventListener('click', () => {
        const statsText = `
        Username: ${document.getElementById('username').textContent}
        Full Name: ${document.getElementById('fullName').textContent}
        Followers: ${document.getElementById('followers').textContent}
        Following: ${document.getElementById('following').textContent}
        Posts: ${document.getElementById('posts').textContent}
        Biography: ${document.getElementById('biography').textContent}
        `;
        navigator.clipboard.writeText(statsText).then(() => {
            alert('Copié dans le presse-papier !');
        }).catch(err => {
            console.error('Erreur lors de la copie : ', err);
        });
    });

    exportButton.addEventListener('click', () => {
        // Sélectionnez l'élément que vous voulez capturer
        const element = document.querySelector('.stats-card');

        // Utiliser html2canvas pour capturer l'élément en tant que canvas
        html2canvas(element).then(canvas => {
            // Créer un lien pour télécharger l'image
            const link = document.createElement('a');

            // Spécifier le nom du fichier à télécharger
            link.download = 'instagram-stats.png';

            // Convertir le canvas en data URL (image) et l'utiliser comme href du lien
            link.href = canvas.toDataURL('image/png');

            // Simuler un clic sur le lien pour déclencher le téléchargement
            link.click();
        }).catch(err => {
            // Gérer les erreurs ici
            console.error('Erreur lors de l\'export : ', err);
            alert('Erreur lors de l\'exportation en image. Veuillez réessayer.');
        });
    });

});