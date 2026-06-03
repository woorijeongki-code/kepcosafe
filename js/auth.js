document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');
    const btnLogout = document.getElementById('btn-logout');
    
    // Failsafe Timeout for Supabase network block (e.g. corporate firewall)
    let authFired = false;
    setTimeout(() => {
        if (!authFired) {
            console.error("Supabase network timeout! Falling back to login view or mock mode.");
            AppState.supabase = null; // Disable supabase to allow mock login
            showLoading(false);
            if (!AppState.user) showLoginView();
        }
    }, 5000);

    // Auth State Listener
    if (AppState.supabase) {
        AppState.supabase.auth.onAuthStateChange(async (event, session) => {
            authFired = true;
            try {
                if (session) {
                    AppState.user = session.user;
                    await fetchUserProfile(session.user.id);
                    showAppView();
                } else {
                    AppState.user = null;
                    AppState.profile = null;
                    showLoginView();
                }
            } catch (err) {
                console.error("Auth state change error:", err);
            } finally {
                showLoading(false);
            }
        });
    } else {
        // Mock fallback for demo if Supabase is not configured
        showLoading(false);
        console.warn('Running in mock mode (No Supabase)');
    }

    // Login Handler
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginError.classList.add('hidden');
            
            if (!AppState.supabase) {
                // Mock Login - 이메일 기반 권한 및 회사명 분기
                const isAdmin = loginEmail.value.includes('admin') || loginEmail.value.includes('kepco');
                
                AppState.user = { id: 'mock-uuid', email: loginEmail.value };
                AppState.profile = { 
                    full_name: isAdmin ? '안전관리자' : '현장소장', 
                    company_name: isAdmin ? '한국전력공사 대덕유성지사' : '대덕전기(주)', 
                    role: isAdmin ? 'admin' : 'user' 
                };
                showAppView();
                return;
            }

            showLoading(true);
            const { data, error } = await AppState.supabase.auth.signInWithPassword({
                email: loginEmail.value,
                password: loginPassword.value
            });

            try {
                if (error) {
                    loginError.textContent = '로그인 실패: 이메일이나 비밀번호를 확인해주세요.';
                    loginError.classList.remove('hidden');
                } else {
                    if (data.session) {
                        AppState.user = data.session.user;
                        await fetchUserProfile(data.session.user.id);
                        showAppView();
                    }
                }
            } catch (err) {
                console.error("Login process error:", err);
                alert("로그인 처리 중 오류가 발생했습니다.");
            } finally {
                showLoading(false);
            }
        });
    }

    // Logout Handler (PC)
    if(btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('로그아웃 하시겠습니까?')) {
                showLoading(true);
                
                if (AppState.supabase) {
                    // 네트워크 응답을 기다리지 않고(비동기 await 생략) 백그라운드에서 로그아웃 요청만 던집니다.
                    AppState.supabase.auth.signOut().catch(e => console.warn(e));
                }
                
                // 즉시 강제 로컬 로그아웃 처리
                setTimeout(() => {
                    AppState.user = null;
                    AppState.profile = null;
                    showLoginView();
                    showLoading(false);
                }, 100);
            }
        });
    }

    // Logout Handler (Mobile Profile Button)
    const btnMobileProfile = document.getElementById('btn-mobile-profile');
    if (btnMobileProfile) {
        btnMobileProfile.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('로그아웃 하시겠습니까?')) {
                showLoading(true);
                
                if (AppState.supabase) {
                    // 비동기 대기(await) 없이 즉시 다음 줄로 넘어감
                    AppState.supabase.auth.signOut().catch(e => console.warn(e));
                }
                
                setTimeout(() => {
                    AppState.user = null;
                    AppState.profile = null;
                    showLoginView();
                    showLoading(false);
                }, 100);
            }
        });
    }

    // Fetch User Profile from 'users' table
    async function fetchUserProfile(userId) {
        if (!AppState.supabase) return;
        try {
            const { data, error } = await AppState.supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
                
            if (error) {
                console.error('프로필 로드 에러:', error);
            }
            
            if (data) {
                // DB에 관리자 이름이 잘못 저장되어 있을 경우를 대비한 강제 보정
                if (data.role === 'admin' || (AppState.user && AppState.user.email && (AppState.user.email.includes('admin') || AppState.user.email.includes('kepco')))) {
                    data.company_name = '한국전력공사 대덕유성지사';
                    data.role = 'admin'; // 강제 어드민 권한 부여 (안전장치)
                }
                
                // 만약 DB에 '소속회사'나 '소속 회사' 등 쓰레기값이 들어있다면 무조건 대덕유성지사로 치환 (강력 필터링)
                if (!data.company_name || data.company_name.trim() === '소속회사' || data.company_name.trim() === '소속 회사') {
                    data.company_name = '한국전력공사 대덕유성지사';
                }
                
                AppState.profile = data;
            } else {
                // Fallback
                const isAdmin = AppState.user && AppState.user.email && (AppState.user.email.includes('admin') || AppState.user.email.includes('kepco'));
                AppState.profile = { 
                    full_name: isAdmin ? '안전관리자' : '이름 없음', 
                    company_name: isAdmin ? '한국전력공사 대덕유성지사' : '소속 없음', 
                    role: isAdmin ? 'admin' : 'user' 
                };
            }
        } catch (err) {
            console.error('fetchUserProfile Exception:', err);
            AppState.profile = { full_name: '네트워크 오류', company_name: '알 수 없음', role: 'user' };
        }
    }

    function showLoginView() {
        document.getElementById('view-app').classList.add('hidden');
        document.getElementById('view-login').classList.remove('hidden');
        
        // 로그아웃 시 입력폼 초기화
        const form = document.getElementById('login-form');
        if (form) form.reset();
        
        const errorEl = document.getElementById('login-error');
        if (errorEl) errorEl.classList.add('hidden');
    }

    function showAppView() {
        document.getElementById('view-login').classList.add('hidden');
        document.getElementById('view-app').classList.remove('hidden');
        
        // Update UI with user info
        if (AppState.profile) {
            const userCompanyEl = document.getElementById('user-company');
            if (userCompanyEl) userCompanyEl.textContent = AppState.profile.company_name;

            // 대시보드의 텍스트 업데이트 방식 변경 (레이스 컨디션 방지용 리렌더링)
            if (window.AppRouter && window.AppRouter.currentModule === 'dashboard') {
                window.AppRouter.forceReRender();
            }
            
            // admin인 경우 SOS 버튼 및 관리자 전용 메뉴 표시
            const btnSos = document.getElementById('btn-sos-trigger');
            const adminNavSection = document.getElementById('nav-admin-section');
            
            if (AppState.profile.role === 'admin') {
                if (btnSos) btnSos.classList.remove('hidden');
                if (adminNavSection) adminNavSection.classList.remove('hidden');
            } else {
                if (btnSos) btnSos.classList.add('hidden');
                if (adminNavSection) adminNavSection.classList.add('hidden');
            }
        } else if (AppState.user) {
            const userCompanyEl = document.getElementById('user-company');
            if (userCompanyEl) userCompanyEl.textContent = AppState.user.email;
        }
        
        // Load default module
        if(window.AppRouter && !window.AppRouter.currentModule) {
            window.AppRouter.navigate('dashboard');
        } else if (window.AppRouter) {
            window.AppRouter.forceReRender();
        }
    }
});
