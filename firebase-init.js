const firebaseConfig = {
  apiKey: "AIzaSyC6oxAFHgDVOElYizovAI1AhALsTey9SeI",
  authDomain: "grace-shop-9dbe7.firebaseapp.com",
  projectId: "grace-shop-9dbe7",
  storageBucket: "grace-shop-9dbe7.firebasestorage.app",
  messagingSenderId: "78039010838",
  appId: "1:78039010838:web:4330bfb9f9f085b7256f37"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      localStorage.setItem('grace_logged_in', JSON.stringify({
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL,
        provider: 'google'
      }));
      if (user.email === 'admin@grace.com') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    })
    .catch((error) => {
      const errorEl = document.getElementById('error-msg');
      if (!errorEl) return;
      if (error.code === 'auth/popup-closed-by-user') {
        errorEl.textContent = '로그인 창이 닫혔습니다. 다시 시도해주세요.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorEl.textContent = '이 도메인은 허용되지 않았습니다. Firebase 콘솔에서 도메인을 추가해주세요.';
      } else {
        errorEl.textContent = 'Google 로그인에 실패했습니다. 다시 시도해주세요.';
      }
    });
}
