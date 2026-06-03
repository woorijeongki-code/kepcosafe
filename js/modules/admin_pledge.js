window.Modules['admin_pledge'] = {
    title: '일일 서약 통계 현황',
    
    render() {
        return `
            <div class="space-y-6 fade-in pb-10 max-w-5xl mx-auto">
                <!-- 헤더 영역 -->
                <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div class="relative z-10 flex items-center justify-between">
                        <div>
                            <h2 class="text-xl font-black mb-1">일일 서약 통계 현황</h2>
                            <p class="text-blue-100 text-sm font-medium">오늘 안전 서약을 완료한 인원을 확인하세요.</p>
                        </div>
                        <div class="text-5xl opacity-20">
                            <i class="fa-solid fa-chart-pie"></i>
                        </div>
                    </div>
                </div>

                <!-- 통계 요약 카드 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div class="w-14 h-14 rounded-full bg-blue-50 text-primary flex items-center justify-center text-2xl shrink-0">
                            <i class="fa-solid fa-users-viewfinder"></i>
                        </div>
                        <div>
                            <p class="text-[12px] font-bold text-slate-500">오늘의 서약 인원 (<span id="stat-date" class="text-primary"></span>)</p>
                            <p class="text-2xl font-black text-slate-800 mt-0.5"><span id="stat-total-count">0</span> <span class="text-sm font-medium text-slate-500">명 완료</span></p>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div class="w-14 h-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-2xl shrink-0">
                            <i class="fa-solid fa-building-circle-check"></i>
                        </div>
                        <div>
                            <p class="text-[12px] font-bold text-slate-500">참여 협력회사</p>
                            <p class="text-2xl font-black text-slate-800 mt-0.5"><span id="stat-company-count">0</span> <span class="text-sm font-medium text-slate-500">개사 참여</span></p>
                        </div>
                    </div>
                </div>

                <!-- 서약 명단 리스트 -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 class="font-bold text-slate-800 text-sm"><i class="fa-solid fa-list-check text-primary mr-1"></i> 서약자 실명 명단</h3>
                        <button id="btn-refresh-stats" class="text-xs text-slate-500 hover:text-primary transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm font-medium">
                            <i class="fa-solid fa-rotate-right"></i> 새로고침
                        </button>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                                    <th class="p-3 pl-4">No.</th>
                                    <th class="p-3">소속 회사</th>
                                    <th class="p-3">서약자 이름</th>
                                    <th class="p-3">서약 일자</th>
                                </tr>
                            </thead>
                            <tbody id="pledge-table-body" class="text-sm text-slate-700">
                                <!-- JS로 렌더링 -->
                                <tr>
                                    <td colspan="4" class="p-8 text-center text-slate-400">
                                        <i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i><br>
                                        데이터를 불러오는 중입니다...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        // 관리자 권한 체크
        if (!AppState.profile || AppState.profile.role !== 'admin') {
            alert('관리자만 접근 가능한 메뉴입니다.');
            window.AppRouter.navigate('dashboard');
            return;
        }

        const todayStr = new Date().toLocaleDateString('ko-KR');
        document.getElementById('stat-date').textContent = todayStr;

        const loadStats = async () => {
            const tbody = document.getElementById('pledge-table-body');
            const totalCountEl = document.getElementById('stat-total-count');
            const companyCountEl = document.getElementById('stat-company-count');
            
            try {
                let logs = [];
                
                if (AppState.supabase) {
                    const { data, error } = await AppState.supabase
                        .from('golden_rule_logs')
                        .select('*')
                        .eq('pledge_date', todayStr)
                        .order('created_at', { ascending: false });
                        
                    if (error) {
                        // 테이블이 없는 경우 모의 데이터 표시
                        console.warn('DB 에러 (아마도 테이블 없음):', error.message);
                        logs = this.getMockData(todayStr);
                    } else {
                        logs = data || [];
                    }
                } else {
                    logs = this.getMockData(todayStr);
                }
                
                // 데이터 렌더링
                if (logs.length === 0) {
                    tbody.innerHTML = \`
                        <tr>
                            <td colspan="4" class="p-8 text-center text-slate-400">
                                <i class="fa-regular fa-folder-open text-2xl mb-2"></i><br>
                                오늘 서약한 내역이 없습니다.
                            </td>
                        </tr>
                    \`;
                    totalCountEl.textContent = '0';
                    companyCountEl.textContent = '0';
                    return;
                }
                
                // 회사 중복 카운트용 Set
                const companies = new Set();
                
                tbody.innerHTML = logs.map((log, index) => {
                    companies.add(log.company_name);
                    
                    // Supabase created_at 이 있으면 파싱, 없으면 당일 표시
                    let timeStr = '';
                    if (log.created_at) {
                        const dateObj = new Date(log.created_at);
                        timeStr = \` \${String(dateObj.getHours()).padStart(2, '0')}:\${String(dateObj.getMinutes()).padStart(2, '0')}\`;
                    }

                    return \`
                        <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td class="p-3 pl-4 text-xs text-slate-400 font-medium">\${logs.length - index}</td>
                            <td class="p-3 font-bold text-slate-800">\${log.company_name}</td>
                            <td class="p-3 text-primary font-bold"><i class="fa-solid fa-user-check text-xs mr-1 text-slate-300"></i> \${log.worker_name || '이름없음'}</td>
                            <td class="p-3 text-xs text-slate-500">\${log.pledge_date}\${timeStr}</td>
                        </tr>
                    \`;
                }).join('');
                
                totalCountEl.textContent = logs.length;
                companyCountEl.textContent = companies.size;
                
            } catch (err) {
                console.error("통계 로딩 중 에러:", err);
                tbody.innerHTML = \`
                    <tr>
                        <td colspan="4" class="p-8 text-center text-red-400">
                            <i class="fa-solid fa-circle-exclamation text-2xl mb-2"></i><br>
                            데이터를 불러오는데 실패했습니다.
                        </td>
                    </tr>
                \`;
            }
        };

        // 새로고침 버튼
        const btnRefresh = document.getElementById('btn-refresh-stats');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', () => {
                const icon = btnRefresh.querySelector('i');
                icon.classList.add('fa-spin');
                loadStats().then(() => {
                    setTimeout(() => icon.classList.remove('fa-spin'), 500);
                });
            });
        }

        // 최초 로드
        await loadStats();
    },
    
    getMockData(todayStr) {
        // 테이블 생성 전 테스트용 더미 데이터
        return [
            { company_name: '대덕전기(주)', worker_name: '홍길동 외 2명', pledge_date: todayStr },
            { company_name: '유성ENG(주)', worker_name: '김안전', pledge_date: todayStr },
            { company_name: '한국가공산업', worker_name: '박반장', pledge_date: todayStr }
        ];
    }
};
