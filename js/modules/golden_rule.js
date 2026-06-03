window.Modules['golden_rule'] = {
    title: '골든룰 11 & 안전작업 수칙',
    
    render() {
        return `
            <div class="space-y-6 fade-in pb-10">
                <!-- 상단 포스터 이미지 영역 -->
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
                    <img src="img/golden_rules_poster.jpg" alt="Golden Rules 11 포스터" class="w-full h-auto object-contain bg-slate-900">
                </div>

                <!-- 헤더 영역 -->
                <div class="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl p-6 text-white shadow-md relative overflow-hidden mt-6">
                    <div class="relative z-10 flex items-center justify-between">
                        <div>
                            <h2 class="text-xl font-black mb-1">Golden-Rules 11 세부 내용</h2>
                            <p class="text-amber-50 text-xs font-medium">당신의 생명을 지키는 법칙을 숙지하세요.</p>
                        </div>
                        <div class="text-4xl opacity-20">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                    </div>
                </div>

                <!-- 수칙 리스트 -->
                <div class="space-y-3" id="golden-rules-container">
                    <!-- 자바스크립트로 렌더링됨 -->
                </div>
                
                <!-- 분야별 특화 수칙 (11번) -->
                <div class="mt-8">
                    <h3 class="text-lg font-bold text-slate-800 mb-4 px-1 border-l-4 border-primary pl-3">11. 분야별 세부 수칙</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="special-rules-container">
                        <!-- 자바스크립트로 렌더링됨 -->
                    </div>
                </div>
                
                <!-- 일일 안전 서약 영역 -->
                <div class="mt-8 bg-white border-2 border-primary/20 rounded-2xl p-6 text-center shadow-sm max-w-lg mx-auto">
                    <div class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                        <i class="fa-solid fa-signature"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-2">오늘의 안전작업 수칙 준수 서약</h3>
                    <p class="text-xs text-slate-500 mb-6">위의 골든룰 11 및 안전작업 수칙을 모두 숙지하였으며, 현장에서 철저히 준수할 것을 서약합니다.</p>
                    
                    <div id="pledge-form-container" class="mb-4">
                        <input type="text" id="pledge-worker-name" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-medium mb-3 text-center" placeholder="서약자 성명 (예: 김안전 또는 홍길동 외 3명)">
                        <p id="pledge-error" class="text-[11px] text-red-500 font-bold hidden mb-3">서약자 성명을 입력해 주세요.</p>
                    </div>

                    <button id="btn-pledge" class="bg-primary hover:bg-blue-800 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto w-full">
                        <i class="fa-solid fa-check-circle"></i> 서약 및 확인 완료하기
                    </button>
                    <p id="pledge-status" class="text-xs font-bold text-green-600 mt-3 hidden bg-green-50 p-3 rounded-xl border border-green-100">
                        <i class="fa-solid fa-check"></i> 오늘(<span id="pledge-date"></span>) 서약이 완료되었습니다.<br><span id="pledge-name-display" class="text-slate-700 font-medium mt-1 inline-block"></span>
                    </p>
                </div>
            </div>
        `;
    },

    init() {
        const rules = [
            { id: 1, title: '개인 안전장구 착용', law: '산업안전보건규칙 제32조', stars: 3, icon: 'fa-hard-hat' },
            { id: 2, title: '고임목 4개 이상 설치', law: '산업안전보건규칙 제99조', stars: 1, icon: 'fa-truck' },
            { id: 3, title: '작업계획서 작성, 공법 임의변경 금지', law: '산업안전보건규칙 제38조', stars: 2, icon: 'fa-file-signature' },
            { id: 4, title: '작업차량 전도방지 조치', law: '산업안전보건규칙 제171조', stars: 2, icon: 'fa-truck-fast' },
            { id: 5, title: '작업반경 출입금지, 후진시 전담유도', law: '산업안전보건규칙 제172조', stars: 2, icon: 'fa-ban' },
            { id: 6, title: '인양물 고정장치, 하부 출입금지', law: '산업안전보건규칙 제146조', stars: 2, icon: 'fa-truck-ramp-box' },
            { id: 7, title: '안전대 착용 안전고리 체결', law: '산업안전보건규칙 제42조', stars: 3, icon: 'fa-link' },
            { id: 8, title: '검전, 접지 충전부 방호', law: '산업안전보건규칙 제302조', stars: 3, icon: 'fa-bolt' },
            { id: 9, title: '밀폐공간 산소농도 측정·기록', law: '산업안전보건규칙 제619조', stars: 1, icon: 'fa-mask-ventilator' },
            { id: 10, title: '맨홀 내 케이블 풀링 시 맨홀 출입 금지', law: '산업안전보건규칙 제20조', stars: 1, icon: 'fa-circle-xmark' }
        ];

        const specialRules = [
            { category: '배전', desc: 'COS투개방 및 지상, 가공기기(공사용개폐기 포함) 조작 시 적정공구 사용', law: '규칙 제96조', icon: 'fa-plug' },
            { category: '송전', desc: '철탑 승탑 시 추락방지 와이어 및 안전그네식 안전대 필수 사용', law: '규칙 제42, 44조', icon: 'fa-tower-cell' },
            { category: '변전', desc: '변전 기자재 운반 시 저상용 운반장비 사용 및 벨트슬링 하중 검토 철저', law: '법 제38조', icon: 'fa-charging-station' },
            { category: '토목', desc: '단부, 개구부 등 추락위험 장소에는 추락방지(안전난간, 덮개 등) 방호 조치', law: '규칙 제43조', icon: 'fa-person-digging' },
            { category: '건축', desc: '비계설치 장소에서 작업 시 작업발판 및 추락방호망 설치 철저', law: '규칙 제43, 56조', icon: 'fa-trowel-bricks' }
        ];

        // 렌더링 1: 공통 수칙 (1~10번)
        const container = document.getElementById('golden-rules-container');
        if (container) {
            container.innerHTML = rules.map(rule => {
                const starsHtml = Array(rule.stars).fill('<i class="fa-solid fa-star"></i>').join('');
                const emptyStarsHtml = Array(3 - rule.stars).fill('<i class="fa-regular fa-star"></i>').join('');
                
                return `
                    <div class="glass-card rounded-2xl p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                        <div class="w-12 h-12 shrink-0 bg-slate-100 rounded-xl flex items-center justify-center text-primary text-xl font-black shadow-inner">
                            ${rule.id}
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-bold">${rule.law}</span>
                                <span class="text-amber-500 text-[10px] flex gap-0.5">${starsHtml}${emptyStarsHtml}</span>
                            </div>
                            <h4 class="font-bold text-slate-800 text-[15px] leading-snug">${rule.title}</h4>
                        </div>
                        <div class="w-8 text-center text-slate-300 text-xl hidden sm:block">
                            <i class="fa-solid ${rule.icon}"></i>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 렌더링 2: 특화 수칙 (11번)
        const specialContainer = document.getElementById('special-rules-container');
        if (specialContainer) {
            specialContainer.innerHTML = specialRules.map(rule => {
                return `
                    <div class="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3 hover:bg-primary/10 transition-colors">
                        <div class="w-10 h-10 shrink-0 bg-primary text-white rounded-xl flex flex-col items-center justify-center text-xs shadow-md">
                            <i class="fa-solid ${rule.icon} text-lg mb-0.5"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <h4 class="font-bold text-primary text-sm">${rule.category}</h4>
                                <span class="text-[10px] text-slate-400 font-medium">${rule.law}</span>
                            </div>
                            <p class="text-[12px] text-slate-700 leading-tight">${rule.desc}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 서약 기능 (로컬 스토리지 + Supabase)
        this.setupPledge();
    },

    setupPledge() {
        const btnPledge = document.getElementById('btn-pledge');
        const statusEl = document.getElementById('pledge-status');
        const dateSpan = document.getElementById('pledge-date');
        const nameDisplay = document.getElementById('pledge-name-display');
        const inputName = document.getElementById('pledge-worker-name');
        const errorEl = document.getElementById('pledge-error');
        const formContainer = document.getElementById('pledge-form-container');
        
        if (!btnPledge) return;

        const todayStr = new Date().toLocaleDateString('ko-KR');
        const userId = AppState.user ? AppState.user.id : 'guest';
        const storageKey = `kepco_pledge_${userId}`;
        const nameStorageKey = `kepco_pledge_name_${userId}`;
        
        // 오늘 이미 서약했는지 확인
        const lastPledge = localStorage.getItem(storageKey);
        const lastPledgeName = localStorage.getItem(nameStorageKey) || '서약자';
        
        const setPledgedState = (pledgeName) => {
            btnPledge.classList.remove('bg-primary', 'hover:bg-blue-800');
            btnPledge.classList.add('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
            btnPledge.disabled = true;
            btnPledge.innerHTML = '<i class="fa-solid fa-lock"></i> 오늘 서약 완료';
            
            dateSpan.textContent = todayStr;
            nameDisplay.textContent = `서약자: ${pledgeName}`;
            statusEl.classList.remove('hidden');
            if (formContainer) formContainer.classList.add('hidden');
        };

        if (lastPledge === todayStr) {
            setPledgedState(lastPledgeName);
        }

        btnPledge.addEventListener('click', async () => {
            if (btnPledge.disabled) return;
            
            const workerName = inputName ? inputName.value.trim() : '';
            if (!workerName) {
                if (errorEl) errorEl.classList.remove('hidden');
                if (inputName) inputName.focus();
                return;
            }
            if (errorEl) errorEl.classList.add('hidden');
            
            showLoading(true);
            
            try {
                // 1. 로컬 스토리지 저장
                localStorage.setItem(storageKey, todayStr);
                localStorage.setItem(nameStorageKey, workerName);
                
                // 2. Supabase DB 저장 (테이블이 존재할 경우 대비)
                if (AppState.supabase && AppState.profile) {
                    const { error } = await AppState.supabase.from('golden_rule_logs').insert([{
                        user_id: AppState.user.id,
                        company_name: AppState.profile.company_name,
                        full_name: AppState.profile.full_name,
                        worker_name: workerName,
                        pledge_date: todayStr
                    }]);
                    
                    // 테이블이 아직 생성되지 않았더라도 에러 무시 (UI 정상 처리)
                    if (error) console.warn("DB 저장 실패 (테이블 없음):", error.message);
                }
                
                // 3. UI 업데이트
                setPledgedState(workerName);
                
            } catch (err) {
                console.error("서약 처리 오류:", err);
            } finally {
                showLoading(false);
            }
        });
    }
};
