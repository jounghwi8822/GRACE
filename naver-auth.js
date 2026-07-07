var NAVER_CLIENT_ID = 'VYKApcDPoGczxXE8G1Dy';
var NAVER_CALLBACK = window.location.origin + '/login.html';

function signInWithNaver() {
  var state = Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('naver_state', state);

  var authUrl = 'https://nid.naver.com/oauth2.0/authorize'
    + '?response_type=token'
    + '&client_id=' + NAVER_CLIENT_ID
    + '&redirect_uri=' + encodeURIComponent(NAVER_CALLBACK)
    + '&state=' + state;

  window.location.href = authUrl;
}

async function checkNaverCallback() {
  var hash = window.location.hash;
  if (!hash || !hash.includes('access_token')) return;

  var params = new URLSearchParams(hash.substring(1));
  var accessToken = params.get('access_token');
  if (!accessToken) return;

  history.replaceState(null, '', window.location.pathname);

  try {
    var res = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    });
    var data = await res.json();

    if (data.response) {
      var name = data.response.name || '네이버 사용자';
      var email = data.response.email || '';
      var photo = data.response.profile_image || null;

      localStorage.setItem('grace_logged_in', JSON.stringify({
        name: name,
        email: email,
        photoURL: photo,
        provider: 'naver'
      }));

      if (email === 'admin@grace.com') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    }
  } catch (err) {
    var errorEl = document.getElementById('error-msg');
    if (errorEl) errorEl.textContent = '네이버 로그인 처리 중 오류가 발생했습니다.';
  }
}

checkNaverCallback();
