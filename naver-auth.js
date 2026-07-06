var naverLogin = new naver_id_login(
  "VYKApcDPoGczxXE8G1Dy",
  window.location.origin + "/login.html"
);

naverLogin.get_naver_userprofile("handleNaverProfile");

function handleNaverProfile() {
  var name = naverLogin.getProfileData('name');
  var email = naverLogin.getProfileData('email');
  var photo = naverLogin.getProfileData('profile_image');

  if (!email) return;

  localStorage.setItem('grace_logged_in', JSON.stringify({
    name: name || email.split('@')[0],
    email: email,
    photoURL: photo || null,
    provider: 'naver'
  }));

  if (email === 'admin@grace.com') {
    window.location.href = 'admin.html';
  } else {
    window.location.href = 'index.html';
  }
}

function signInWithNaver() {
  naverLogin.naver_id_login_start();
}
