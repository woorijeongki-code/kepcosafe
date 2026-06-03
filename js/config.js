// Supabase Configuration (사용자 환경에 맞게 키를 입력해야 합니다)
const CONFIG = {
    SUPABASE_URL: 'https://woxtgthnaakzqcaxtkol.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndveHRndGhuYWFrenFjYXh0a29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjA1ODgsImV4cCI6MjA5NTg5NjU4OH0.bmzh0UILhHMb6HEtF_D2_Q_85eH0dR0tain99ft-V-Y'
};

// Global App State
const AppState = {
    user: null,         // 현재 로그인한 사용자 객체 (Auth)
    profile: null,      // DB users 테이블에서 가져온 프로필 정보
    currentView: 'dashboard',
    supabase: null
};

// Initialize Supabase Client
try {
    if (CONFIG.SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        AppState.supabase = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    } else {
        console.warn("Supabase URL 및 Anon Key가 설정되지 않았습니다.");
    }
} catch (error) {
    console.error("Supabase 초기화 실패:", error);
}

// Check for file:// protocol which breaks modern web apps
if (window.location.protocol === 'file:') {
    alert("보안 정책으로 인해 파일 모드(file://)에서는 로그인 및 데이터 통신이 불가능합니다.\n반드시 로컬 웹 서버(http://localhost:8000)를 통해 접속해 주세요.");
    setTimeout(() => {
        const loader = document.getElementById('loading-overlay');
        if (loader) loader.classList.add('hidden');
    }, 500);
}

// Utils
const showLoading = (show) => {
    const loader = document.getElementById('loading-overlay');
    if (show) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
};
