function getProfileStats() {
    // Récupération des informations de base
    const username = document.querySelector('.x1ms8i2q')?.innerText || "";
    const fullName = document.querySelector('.xvs91rp')?.innerText || "";
    const followers = document.querySelector('li.xl565be:nth-child(2) > div:nth-child(1) > button:nth-child(1) > span:nth-child(1) > span:nth-child(1)')?.textContent || "";
    const following = document.querySelector('li.xl565be:nth-child(3) > div:nth-child(1) > button:nth-child(1) > span:nth-child(1) > span:nth-child(1)')?.textContent || "";
    const posts = document.querySelector('header section ul li:nth-child(1) span span')?.textContent || "";
    const biography = document.querySelector('._aa_c')?.textContent || "";

    const profilePic = document.querySelector('img.xpdipgo')?.src || "";

    return { username, fullName, followers, following, posts, biography, profilePic };
}

async function analyzeInstagramPage() {
    const profileStats = getProfileStats();

    if (!profileStats.username || !profileStats.followers) {
        alert('Impossible de récupérer les statistiques du profil. Assurez-vous que vous êtes sur une page de profil Instagram valide.');
        return false;
    }

    // Enregistrement des données dans le stockage local pour accès dans le popup
    chrome.storage.local.set({
        username: profileStats.username,
        fullName: profileStats.fullName,
        followers: profileStats.followers,
        following: profileStats.following,
        posts: profileStats.posts,
        biography: profileStats.biography,
        profilePic: profileStats.profilePic  // Enregistrement de l'image de profil
    });


    return true;
}

// Écoute les messages pour démarrer l'analyse
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchStats') {
        analyzeInstagramPage().then(success => {
            sendResponse({ success });
        }).catch(error => {
            console.error(error);
            sendResponse({ success: false });
        });

        // Cette ligne permet de maintenir la connexion pendant que l'analyse asynchrone s'exécute
        return true;
    }
});
