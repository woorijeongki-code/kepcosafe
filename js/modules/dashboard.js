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
                        <h2 class="text-xl font-bold text-slate-800"><span id="dash-user-company">${window.AppState && window.AppState.profile ? window.AppState.profile.company_name : '한국전력공사 대덕유성지사'}</span>, 안전한 하루 되세요!</h2>
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
                            <p class="text-[11px] font-bold text-slate-500">긴급/알림 현황</p>
                            <p class="text-xl font-black text-slate-800 mt-0.5">0 <span class="text-sm font-medium text-slate-500">건</span></p>
                            <p class="text-[9px] text-slate-400 mt-0.5">진행중 0 / 확인필요 0</p>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-2xl">
                            <i class="fa-solid fa-bullhorn"></i>
                        </div>
                        <div>
                            <p class="text-[11px] font-bold text-slate-500">읽지 않은 공지</p>
                            <p class="text-xl font-black text-slate-800 mt-0.5">0 <span class="text-sm font-medium text-slate-500">건</span></p>
                            <p class="text-[9px] text-slate-400 mt-0.5">새로운 공지가 없습니다</p>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div class="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-2xl">
                            <i class="fa-solid fa-graduation-cap"></i>
                        </div>
                        <div>
                            <p class="text-[11px] font-bold text-slate-500">교육 이수 현황</p>
                            <p class="text-xl font-black text-slate-800 mt-0.5">0/0 <span class="text-sm font-medium text-slate-500">과정</span></p>
                            <p class="text-[9px] text-slate-400 mt-0.5">배정된 교육 없음</p>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div class="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center text-2xl">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <div>
                            <p class="text-[11px] font-bold text-slate-500">협력회사 참여 현황</p>
                            <p class="text-xl font-black text-slate-800 mt-0.5">0 <span class="text-sm font-medium text-slate-500">개사</span></p>
                            <p class="text-[9px] text-slate-400 mt-0.5">현재 등록 대기중</p>
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
                        <div class="flex flex-col items-center justify-center py-6 text-slate-400">
                            <i class="fa-regular fa-folder-open text-2xl mb-2"></i>
                            <p class="text-xs font-medium">등록된 공지사항이 없습니다.</p>
                        </div>
                    </div>

                    <!-- 최근 알림(SOS) -->
                    <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-slate-800">최근 긴급 알림</h3>
                            <a href="#sos" class="text-xs text-slate-400 hover:text-primary">더보기 <i class="fa-solid fa-chevron-right text-[10px]"></i></a>
                        </div>
                        <div class="flex flex-col items-center justify-center py-6 text-slate-400">
                            <i class="fa-regular fa-bell-slash text-2xl mb-2"></i>
                            <p class="text-xs font-medium">새로운 긴급 알림이 없습니다.</p>
                        </div>
                    </div>

                    <!-- 안전우수사례 추천 -->
                    <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-slate-800">안전우수사례 추천</h3>
                            <a href="#cases" class="text-xs text-slate-400 hover:text-primary">더보기 <i class="fa-solid fa-chevron-right text-[10px]"></i></a>
                        </div>
                        <div class="flex flex-col items-center justify-center py-6 text-slate-400">
                            <i class="fa-regular fa-image text-2xl mb-2"></i>
                            <p class="text-xs font-medium">등록된 사례가 없습니다.</p>
                        </div>
                    </div>

                </div>
            </div>
        `;
    },

    init() {
        // 회사 이름 표시 업데이트
        const compEl = document.getElementById('dash-user-company');
        if (compEl && window.AppState && window.AppState.profile) {
            compEl.textContent = window.AppState.profile.company_name || '한국전력공사 대덕유성지사';
        }
    }
};
