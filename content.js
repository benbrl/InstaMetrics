function getProfileStats() {
    const username = document.querySelector('.x1ms8i2q')?.innerText || "";
    const fullName = document.querySelector('.xvs91rp')?.innerText || "";
    const followers = document.querySelector('li.xl565be:nth-child(2) > div:nth-child(1) > button:nth-child(1) > span:nth-child(1) > span:nth-child(1)')?.textContent || "";
    const following = document.querySelector('li.xl565be:nth-child(3) > div:nth-child(1) > button:nth-child(1) > span:nth-child(1) > span:nth-child(1)')?.textContent || "";
    const posts = document.querySelector('header section ul li:nth-child(1) span span')?.textContent || "";
    const biography = document.querySelector('._aa_c')?.textContent || "";
    // const profilePic = document.querySelector('img:first-of-type')?.src || "";

    const profilePicImg = document.querySelector('header span img');
    let profilePic = '';

    if (profilePicImg) {
        const canvas = document.createElement('canvas');
        const maxSize = 150; // Taille maximale en pixels
        const scale = Math.min(maxSize / profilePicImg.width, maxSize / profilePicImg.height);
        canvas.width = profilePicImg.width * scale;
        canvas.height = profilePicImg.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(profilePicImg, 0, 0, canvas.width, canvas.height);
        profilePic = canvas.toDataURL('image/jpeg', 0.8); // 0.8 pour la qualité
    }


    return { username, fullName, followers, following, posts, biography, profilePic };
}

async function analyzeInstagramPage() {
    const profileStats = getProfileStats();

    if (!profileStats.username || !profileStats.followers) {
        alert('Impossible de récupérer les statistiques du profil. Assurez-vous que vous êtes sur une page de profil Instagram valide.');
        return false;
    }

    chrome.storage.local.set(profileStats);
    return true;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchStats') {
        analyzeInstagramPage().then(success => {
            sendResponse({ success });
        }).catch(error => {
            console.error(error);
            sendResponse({ success: false });
        });
        return true;
    }
});