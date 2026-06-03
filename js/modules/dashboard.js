window.Modules['dashboard'] = {
    title: '대시보드',
    
    render() {
        return `
            <div class="space-y-6 fade-in max-w-7xl mx-auto">
                <!-- 인사말 -->
                <div class="flex items-center gap-3 pt-2">
                    <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-xl">
                        <i class="fa-regular fa-building"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-slate-800"><span id="dash-user-company">${typeof AppState !== 'undefined' && AppState.profile ? AppState.profile.company_name : '한국전력공사 대덕유성지사'}</span>, 안전한 하루 되세요!</h2>
                        <p class="text-xs text-slate-500 font-medium">오늘도 안전이 최우선입니다.</p>
                    </div>
                </div>

                <!-- 상단 요약 통계 카드 4개 -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div class="w-12 h-12 rounded-full bg-red-50 text-brandRed flex items-center justify-center text-2xl">
                            <i class="fa-solid fa-bell"></i>
                        </div>
                        <div>
                            <p class="text-[11px] font-bold text-slate-500">긴급 알림 현황</p>
                            <p class="text-xl font-black text-slate-800 mt-0.5"><span id="stat-sos-count">0</span> <span class="text-sm font-medium text-slate-500">건</span></p>
                            <p class="text-[9px] text-slate-400 mt-0.5">최근 7일 기준</p>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-2xl">
                            <i class="fa-solid fa-bullhorn"></i>
                        </div>
                        <div>
                            <p class="text-[11px] font-bold text-slate-500">전체 공지사항</p>
                            <p class="text-xl font-black text-slate-800 mt-0.5"><span id="stat-notice-count">0</span> <span class="text-sm font-medium text-slate-500">건</span></p>
                            <p class="text-[9px] text-slate-400 mt-0.5">시스템 등록 기준</p>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div class="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-2xl">
                            <i class="fa-solid fa-graduation-cap"></i>
                        </div>
                        <div>
                            <p class="text-[11px] font-bold text-slate-500">교육 자료 현황</p>
                            <p class="text-xl font-black text-slate-800 mt-0.5"><span id="stat-edu-count">0</span> <span class="text-sm font-medium text-slate-500">과정</span></p>
                            <p class="text-[9px] text-slate-400 mt-0.5">시스템 등록 기준</p>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div class="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center text-2xl">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <div>
                            <p class="text-[11px] font-bold text-slate-500">플랫폼 가입 현황</p>
                            <p class="text-xl font-black text-slate-800 mt-0.5"><span id="stat-user-count">0</span> <span class="text-sm font-medium text-slate-500">명</span></p>
                            <p class="text-[9px] text-slate-400 mt-0.5">총 가입자 수</p>
                        </div>
                    </div>
                </div>

                <!-- 메인 기능 버튼 8개 (Grid) -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <!-- 1. SOS (Red) -->
                    <a href="#sos" class="relative overflow-hidden rounded-2xl bg-[#eb3223] text-white p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all group min-h-[140px] flex items-center">
                        <div class="absolute -right-4 -bottom-4 text-7xl opacity-20 transform -rotate-12 group-hover:rotate-0 transition-transform"><i class="fa-solid fa-bell"></i></div>
                        <div class="flex items-center gap-4 w-full">
                            <div class="w-14 h-14 bg-white text-brandRed rounded-full flex items-center justify-center text-2xl shrink-0 shadow-inner animate-pulse-red">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-black leading-tight mb-1">1. 긴급 알림 및<br>작업중지 요청</h3>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-white text-brandRed flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                    </a>

                    <!-- 2. Notices (Purple) -->
                    <a href="#notices" class="relative overflow-hidden rounded-2xl bg-[#faf5ff] border border-[#f3e8ff] p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group min-h-[140px] flex items-center">
                        <div class="flex items-center gap-4 w-full">
                            <div class="w-14 h-14 bg-[#f3e8ff] text-[#9333ea] rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner">
                                <i class="fa-solid fa-bullhorn"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-black text-slate-800 leading-tight mb-1">2. 안전공지 &<br>교육자료실</h3>
                                <p class="text-[10px] text-slate-500 font-medium">안전공지 확인 및 교육자료 다운로드</p>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-[#a855f7] text-white flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                    </a>

                    <!-- 3. Golden Rule (Yellow) -->
                    <a href="#golden_rule" class="relative overflow-hidden rounded-2xl bg-[#fffcf5] border border-[#ffedd5] p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group min-h-[140px] flex items-center">
                        <div class="flex items-center gap-4 w-full">
                            <div class="w-14 h-14 bg-[#fef3c7] text-[#d97706] rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner">
                                <i class="fa-regular fa-file-lines"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-black text-slate-800 leading-tight mb-1">3. 골든룰 11 &<br>안전작업 수칙</h3>
                                <p class="text-[10px] text-slate-500 font-medium">기본 안전수칙 및 작업 절차 확인</p>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-[#f59e0b] text-white flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                    </a>

                    <!-- 4. Feedback (Green) -->
                    <a href="#feedback" class="relative overflow-hidden rounded-2xl bg-[#f0fdf4] border border-[#dcfce3] p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group min-h-[140px] flex items-center">
                        <div class="flex items-center gap-4 w-full">
                            <div class="w-14 h-14 bg-[#dcfce3] text-[#16a34a] rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner">
                                <i class="fa-solid fa-clipboard-check"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-black text-slate-800 leading-tight mb-1">4. 무정전회의록<br>& 자료 피드백</h3>
                                <p class="text-[10px] text-slate-500 font-medium">회의록 및 자료에 대한 의견 제출</p>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-[#22c55e] text-white flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                    </a>

                    <!-- 5. Methods (Teal) -->
                    <a href="#methods" class="relative overflow-hidden rounded-2xl bg-[#f0fdfa] border border-[#ccfbf1] p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group min-h-[140px] flex items-center">
                        <div class="flex items-center gap-4 w-full">
                            <div class="w-14 h-14 bg-[#ccfbf1] text-[#0d9488] rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner">
                                <i class="fa-solid fa-screwdriver-wrench"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-black text-slate-800 leading-tight mb-1">5. 작업공법</h3>
                                <p class="text-[10px] text-slate-500 font-medium">표준 작업공법 안내 및 숙지</p>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-[#14b8a6] text-white flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                    </a>

                    <!-- 6. Inspections (Cyan) -->
                    <a href="#inspections" class="relative overflow-hidden rounded-2xl bg-[#ecfeff] border border-[#cffafe] p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group min-h-[140px] flex items-center">
                        <div class="flex items-center gap-4 w-full">
                            <div class="w-14 h-14 bg-[#cffafe] text-[#0891b2] rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner">
                                <i class="fa-solid fa-list-check"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-black text-slate-800 leading-tight mb-1">6. 안전점검</h3>
                                <p class="text-[10px] text-slate-500 font-medium">작업 전 안전점검 체크리스트</p>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-[#06b6d4] text-white flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                    </a>

                    <!-- 7. Cases (Orange) -->
                    <a href="#cases" class="relative overflow-hidden rounded-2xl bg-[#fff7ed] border border-[#ffedd5] p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group min-h-[140px] flex items-center">
                        <div class="flex items-center gap-4 w-full">
                            <div class="w-14 h-14 bg-[#ffedd5] text-[#ea580c] rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner">
                                <i class="fa-regular fa-lightbulb"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-black text-slate-800 leading-tight mb-1">7. 사고사례 &<br>안전우수사례</h3>
                                <p class="text-[10px] text-slate-500 font-medium">사고사례를 통해 배우고 공유해요</p>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-[#f97316] text-white flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                    </a>

                    <!-- 8. Suggestions (Blue) -->
                    <a href="#suggestions" class="relative overflow-hidden rounded-2xl bg-[#f0f7ff] border border-[#dbeafe] p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group min-h-[140px] flex items-center">
                        <div class="flex items-center gap-4 w-full">
                            <div class="w-14 h-14 bg-[#dbeafe] text-[#2563eb] rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner">
                                <i class="fa-solid fa-comment-dots"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-black text-slate-800 leading-tight mb-1">8. 건의사항 &<br>질문하기</h3>
                                <p class="text-[10px] text-slate-500 font-medium">궁금한 점을 문의하고 답변 받아보세요</p>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-arrow-right"></i>
                            </div>
                        </div>
                    </a>

                </div>

                <!-- 하단 3단 정보 영역 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    
                    <!-- 최근 공지사항 -->
                    <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-slate-800">최근 공지사항</h3>
                            <a href="#notices" class="text-xs text-slate-400 hover:text-primary">더보기 <i class="fa-solid fa-chevron-right text-[10px]"></i></a>
                        </div>
                        <div id="dash-recent-notices" class="flex flex-col gap-2 min-h-[80px]">
                            <div class="flex flex-col items-center justify-center py-6 text-slate-400">
                                <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                                <p class="text-xs font-medium">불러오는 중...</p>
                            </div>
                        </div>
                    </div>

                    <!-- 최근 알림(SOS) -->
                    <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-slate-800">최근 긴급 알림</h3>
                            <a href="#sos" class="text-xs text-slate-400 hover:text-primary">더보기 <i class="fa-solid fa-chevron-right text-[10px]"></i></a>
                        </div>
                        <div id="dash-recent-sos" class="flex flex-col gap-2 min-h-[80px]">
                            <div class="flex flex-col items-center justify-center py-6 text-slate-400">
                                <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                                <p class="text-xs font-medium">불러오는 중...</p>
                            </div>
                        </div>
                    </div>

                    <!-- 최근 안전사례 -->
                    <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-slate-800">최근 사고/우수사례</h3>
                            <a href="#cases" class="text-xs text-slate-400 hover:text-primary">더보기 <i class="fa-solid fa-chevron-right text-[10px]"></i></a>
                        </div>
                        <div id="dash-recent-cases" class="flex flex-col gap-2 min-h-[80px]">
                            <div class="flex flex-col items-center justify-center py-6 text-slate-400">
                                <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                                <p class="text-xs font-medium">불러오는 중...</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
    },

    init() {
        // 회사 이름 표시 업데이트
        const compEl = document.getElementById('dash-user-company');
        if (compEl && typeof AppState !== 'undefined' && AppState.profile) {
            compEl.textContent = AppState.profile.company_name || '한국전력공사 대덕유성지사';
        }
        
        // Supabase에서 실시간 통계 데이터 불러오기
        this.loadDashboardData();
    },

    async loadDashboardData() {
        if (typeof AppState === 'undefined' || !AppState.supabase) return;
        const supabase = AppState.supabase;

        try {
            // 1. 긴급 알림 현황 (최근 7일 기준 카운트)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            const { count: sosCount, error: err1 } = await supabase
                .from('sos_alerts')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', sevenDaysAgo.toISOString());
                
            if (!err1 && document.getElementById('stat-sos-count')) {
                document.getElementById('stat-sos-count').textContent = sosCount || 0;
            }

            // 2. 공지사항 및 교육자료 현황
            const { count: noticeCount, error: err2 } = await supabase
                .from('notices')
                .select('*', { count: 'exact', head: true })
                .eq('category', 'notice');
                
            if (!err2 && document.getElementById('stat-notice-count')) {
                document.getElementById('stat-notice-count').textContent = noticeCount || 0;
            }
            
            const { count: eduCount, error: err3 } = await supabase
                .from('notices')
                .select('*', { count: 'exact', head: true })
                .eq('category', 'education');
                
            if (!err3 && document.getElementById('stat-edu-count')) {
                document.getElementById('stat-edu-count').textContent = eduCount || 0;
            }

            // 3. 플랫폼 가입자 수 현황
            const { count: userCount, error: err4 } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });
                
            if (!err4 && document.getElementById('stat-user-count')) {
                document.getElementById('stat-user-count').textContent = userCount || 0;
            }

            // 4. 최근 공지사항 리스트 (최대 3개)
            const { data: recentNotices } = await supabase
                .from('notices')
                .select('id, title, created_at')
                .eq('category', 'notice')
                .order('created_at', { ascending: false })
                .limit(3);
                
            const noticesEl = document.getElementById('dash-recent-notices');
            if (noticesEl) {
                if (recentNotices && recentNotices.length > 0) {
                    noticesEl.innerHTML = recentNotices.map(item => `
                        <a href="#notices" class="text-xs bg-slate-50 hover:bg-slate-100 p-2 rounded-lg flex justify-between items-center transition-colors">
                            <span class="truncate font-medium text-slate-700">${item.title}</span>
                            <span class="text-[9px] text-slate-400 shrink-0 ml-2">${new Date(item.created_at).toLocaleDateString()}</span>
                        </a>
                    `).join('');
                } else {
                    noticesEl.innerHTML = `
                        <div class="flex flex-col items-center justify-center py-4 text-slate-400">
                            <i class="fa-regular fa-folder-open text-xl mb-1"></i>
                            <p class="text-[10px] font-medium">등록된 공지사항이 없습니다.</p>
                        </div>
                    `;
                }
            }

            // 5. 최근 긴급 알림 리스트 (최대 3개)
            const { data: recentSos } = await supabase
                .from('sos_alerts')
                .select('id, message, created_at')
                .order('created_at', { ascending: false })
                .limit(3);
                
            const sosEl = document.getElementById('dash-recent-sos');
            if (sosEl) {
                if (recentSos && recentSos.length > 0) {
                    sosEl.innerHTML = recentSos.map(item => `
                        <a href="#sos" class="text-xs bg-red-50 hover:bg-red-100 p-2 rounded-lg flex justify-between items-center transition-colors text-brandRed">
                            <span class="truncate font-medium"><i class="fa-solid fa-triangle-exclamation mr-1"></i> ${item.message}</span>
                            <span class="text-[9px] text-red-300 shrink-0 ml-2">${new Date(item.created_at).toLocaleDateString()}</span>
                        </a>
                    `).join('');
                } else {
                    sosEl.innerHTML = `
                        <div class="flex flex-col items-center justify-center py-4 text-slate-400">
                            <i class="fa-regular fa-bell-slash text-xl mb-1"></i>
                            <p class="text-[10px] font-medium">새로운 긴급 알림이 없습니다.</p>
                        </div>
                    `;
                }
            }

            // 6. 최근 안전사례 리스트 (최대 3개)
            const { data: recentCases } = await supabase
                .from('cases')
                .select('id, title, created_at')
                .order('created_at', { ascending: false })
                .limit(3);
                
            const casesEl = document.getElementById('dash-recent-cases');
            if (casesEl) {
                if (recentCases && recentCases.length > 0) {
                    casesEl.innerHTML = recentCases.map(item => `
                        <a href="#cases" class="text-xs bg-orange-50 hover:bg-orange-100 p-2 rounded-lg flex justify-between items-center transition-colors text-orange-700">
                            <span class="truncate font-medium"><i class="fa-regular fa-image mr-1"></i> ${item.title}</span>
                            <span class="text-[9px] text-orange-300 shrink-0 ml-2">${new Date(item.created_at).toLocaleDateString()}</span>
                        </a>
                    `).join('');
                } else {
                    casesEl.innerHTML = `
                        <div class="flex flex-col items-center justify-center py-4 text-slate-400">
                            <i class="fa-regular fa-image text-xl mb-1"></i>
                            <p class="text-[10px] font-medium">등록된 사례가 없습니다.</p>
                        </div>
                    `;
                }
            }

        } catch (error) {
            console.error('대시보드 데이터 로드 실패:', error);
        }
    }
};
