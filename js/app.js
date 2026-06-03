/**
 * App Framework
 * 
 * [확장 가이드]
 * 새로운 메뉴/기능을 추가하려면:
 * 1. `js/modules/` 폴더에 `새모듈.js` 파일을 만듭니다.
 * 2. 해당 파일에서 `window.Modules['새모듈이름'] = { render, init }` 형태로 모듈을 정의합니다.
 * 3. `index.html`에 `<script src="js/modules/새모듈.js"></script>`를 추가합니다.
 * 4. 내비게이션 바(또는 더보기 메뉴)에 `<a href="#새모듈이름">...</a>` 링크를 추가합니다.
 */

window.Modules = {}; // 각 기능 모듈이 자신을 등록할 객체

window.AppRouter = {
    currentModule: null,

    init() {
        // 해시(Hash) 기반 라우팅
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace('#', '') || 'dashboard';
            this.navigate(hash);
        });
    },

    navigate(moduleName) {
        const contentArea = document.getElementById('app-content');
        const headerTitle = document.getElementById('header-title');

        if (!window.Modules[moduleName]) {
            console.warn(`Module '${moduleName}' not found. Falling back to dashboard.`);
            moduleName = 'dashboard';
        }

        const module = window.Modules[moduleName];
        
        // Update Title & Header visibility
        const headerContainer = document.getElementById('page-header-container');
        if (module.title && headerTitle) {
            headerTitle.textContent = module.title;
            if (moduleName !== 'dashboard' && headerContainer) {
                headerContainer.classList.remove('hidden');
            } else if (headerContainer) {
                headerContainer.classList.add('hidden'); // 대시보드는 자체 헤더를 쓰므로 숨김
            }
        }

        // Render HTML
        if (module.render) {
            contentArea.innerHTML = module.render();
        }

        // Initialize JavaScript Logic for the module
        if (module.init) {
            // 약간의 딜레이 후 init 실행하여 DOM 렌더링 보장
            setTimeout(() => {
                module.init();
            }, 0);
        }

        this.currentModule = moduleName;
        this.updateNavHighlight(moduleName);
    },

    updateNavHighlight(moduleName) {
        // PC 사이드바 활성화 처리
        document.querySelectorAll('#sidebar .nav-link').forEach(el => {
            el.classList.remove('bg-blue-50', 'text-primary');
            el.classList.add('text-slate-600');
            el.querySelector('i').classList.remove('text-primary');
            
            if(el.getAttribute('href') === `#${moduleName}`) {
                el.classList.add('bg-blue-50', 'text-primary', 'font-bold');
                el.classList.remove('text-slate-600', 'font-medium');
                el.querySelector('i').classList.add('text-primary');
            }
        });

        // 모바일 하단 네비게이션 활성화 처리
        document.querySelectorAll('.mobile-nav').forEach(el => {
            el.classList.remove('text-primary', 'font-bold');
            el.classList.add('text-slate-400');
            
            if(el.getAttribute('href') === `#${moduleName}`) {
                el.classList.add('text-primary', 'font-bold');
                el.classList.remove('text-slate-400', 'hover:text-slate-600');
            }
        });
    },
    
    forceReRender() {
        if (this.currentModule) {
            const moduleName = this.currentModule;
            const module = window.Modules[moduleName];
            if (module) {
                const contentArea = document.getElementById('app-content');
                if (contentArea) {
                    contentArea.innerHTML = module.render();
                    if (module.init) module.init();
                }
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.AppRouter.init();
    
    if(AppState.supabase === null || AppState.user) {
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        window.AppRouter.navigate(hash);
    }
    
    // 모바일 로그아웃 버튼 (내 정보 탭)
    const btnMobileProfile = document.getElementById('btn-mobile-profile');
    if (btnMobileProfile) {
        btnMobileProfile.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('로그아웃 하시겠습니까?')) {
                if (AppState.supabase) AppState.supabase.auth.signOut();
                else window.location.reload();
            }
        });
    }
});
