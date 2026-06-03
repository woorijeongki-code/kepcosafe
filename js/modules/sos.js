window.Modules['sos'] = {
    title: '긴급 알림 서비스',
    
    render() {
        const isAdmin = AppState.profile && AppState.profile.role === 'admin';
        
        let html = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10 fade-in">
                
                <!-- 왼쪽 영역: 플랫폼 내부 긴급 알림 서비스 -->
                <div class="space-y-6">
                    <div class="bg-red-50 border border-red-100 rounded-2xl p-5">
                        <div class="flex items-center gap-3 mb-2">
                            <i class="fa-solid fa-triangle-exclamation text-red-500 text-xl"></i>
                            <h3 class="font-bold text-red-800">플랫폼 내부 긴급 알림</h3>
                        </div>
                        <p class="text-sm text-red-600">관리자가 긴급 알림을 발송하면, 접속 중인 모든 협력사 앱에 즉시 빨간색 경고 팝업이 표시됩니다.</p>
                    </div>
        `;

        if (isAdmin) {
            html += `
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h4 class="font-bold text-slate-800 mb-4">새 긴급 알림 발송</h4>
                    <form id="sos-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">메시지 내용</label>
                            <textarea id="sos-message" rows="3" required class="block w-full p-3 border border-slate-300 rounded-xl focus:ring-red-500 focus:border-red-500 text-sm" placeholder="예: [긴급] 강풍으로 인한 타워크레인 작업 전면 중지"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">붙임 (첨부파일)</label>
                            <input type="file" id="sos-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1">
                        </div>
                        <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2">
                            <i class="fa-solid fa-paper-plane"></i> 전체 발송
                        </button>
                    </form>
                </div>
            `;
        }

        html += `
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h4 class="font-bold text-slate-800 mb-4">최근 수신된 알림 기록</h4>
                    <div id="sos-history" class="space-y-3">
                        <div class="animate-pulse space-y-3 p-2" id="sos-loader"><div class="h-16 bg-slate-200 rounded-xl w-full"></div><div class="h-16 bg-slate-200 rounded-xl w-full"></div></div>
                    </div>
                </div>
            </div>

            <!-- 오른쪽 영역: 한전 작업중지 요청 외부 링크 -->
            <div class="space-y-6">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
                    <div class="bg-gradient-to-br from-slate-700 to-slate-800 p-6 text-white text-center flex-1 flex flex-col justify-center items-center relative overflow-hidden">
                        <!-- 배경 데코레이션 요소 -->
                        <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                        <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-black/20 rounded-full blur-2xl"></div>
                        
                        <div class="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-4xl mb-4 relative z-10 shadow-inner">
                            <i class="fa-solid fa-hand-front-face text-rose-400"></i>
                        </div>
                        <h3 class="font-black text-2xl mb-2 relative z-10">작업중지 요청제도</h3>
                        <p class="text-sm text-slate-300 mb-8 max-w-sm mx-auto leading-relaxed relative z-10 font-medium">
                            근로자가 산업재해가 발생할 급박한 위험이 있는 경우에는 즉시 작업을 중지하고 대피할 수 있으며, 
                            작업중지 및 대피 후 즉시 안전보건관리책임자 등에게 보고해야 합니다.
                        </p>
                        
                        <a href="https://www.kepco.co.kr/home/customer/safety/report/stop-work/guide.do" target="_blank" class="w-full max-w-xs bg-rose-600 text-white hover:bg-rose-700 font-black py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex justify-center items-center gap-2 text-lg relative z-10 border border-rose-500">
                            새 창에서 요청하기 <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                        <p class="text-xs text-slate-400 mt-5 relative z-10 flex items-center justify-center gap-1.5"><i class="fa-solid fa-circle-info"></i> 한전 공식 홈페이지 안전 포털로 안전하게 이동합니다.</p>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        return html;
    },

    init() {
        this.loadHistory();
        this.setupRealtime();

        const form = document.getElementById('sos-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const msg = document.getElementById('sos-message').value;
                const fileInput = document.getElementById('sos-file');
                const hasFile = fileInput && fileInput.files.length > 0;

                if (!msg.trim()) return;

                if (!AppState.supabase) {
                    alert('[Mock] 알림이 발송되었습니다.' + (hasFile ? '\\n(첨부파일: ' + fileInput.files[0].name + ')' : ''));
                    this.showSOSAlert(msg);
                    form.reset();
                    return;
                }

                showLoading(true);
                let fileUrl = null;
                if (hasFile) {
                    fileUrl = 'mock_attachment_' + Date.now() + '.pdf';
                }

                const { error } = await AppState.supabase
                    .from('sos_alerts')
                    .insert([{
                        message: msg,
                        sender_id: AppState.user.id,
                        level: 'danger',
                        ...(hasFile && { file_url: fileUrl })
                    }]);
                
                showLoading(false);
                if (error) {
                    alert('발송 실패: ' + error.message);
                } else {
                    form.reset();
                    // Realtime will catch it and update UI
                }
            });
        }
    },

    async loadHistory() {
        const historyContainer = document.getElementById('sos-history');
        if (!AppState.supabase) {
            historyContainer.innerHTML = '<p class="text-center text-sm text-slate-500 py-4">데이터베이스 연결 없음 (Mock)</p>';
            return;
        }

        const { data, error } = await AppState.supabase
            .from('sos_alerts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            historyContainer.innerHTML = `<p class="text-center text-sm text-red-500 py-4">목록 로드 실패</p>`;
            return;
        }

        if (data.length === 0) {
            historyContainer.innerHTML = `<p class="text-center text-sm text-slate-500 py-4">최근 알림이 없습니다.</p>`;
            return;
        }

        const isAdmin = AppState.profile && AppState.profile.role === 'admin';

        historyContainer.innerHTML = data.map(alert => `
            <div class="p-3 bg-red-50 rounded-xl border border-red-100 border-l-4 border-l-red-500 flex justify-between items-start">
                <div>
                    <p class="text-sm font-bold text-slate-800 mb-1">${alert.message}</p>
                    ${alert.file_url ? `
                    <button class="mb-2 text-[10px] bg-white hover:bg-slate-100 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-red-200" onclick="event.stopPropagation(); alert('첨부파일 다운로드 기능은 파일 스토리지가 연결되어야 작동합니다.')">
                        <i class="fa-solid fa-paperclip"></i> 첨부파일 확인
                    </button>
                    ` : ''}
                    <p class="text-[10px] text-slate-500">${new Date(alert.created_at).toLocaleString()}</p>
                </div>
                ${isAdmin ? `
                <button class="btn-delete-sos text-red-300 hover:text-red-600 transition-colors shrink-0 px-2 py-1" data-id="${alert.id}" title="메시지 삭제">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                ` : ''}
            </div>
        `).join('');

        // 삭제 이벤트 리스너 바인딩 (관리자용)
        if (isAdmin) {
            historyContainer.querySelectorAll('.btn-delete-sos').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.dataset.id;
                    if (confirm('이 긴급 알림 메시지를 삭제하시겠습니까? (삭제 시 기록에서 사라집니다)')) {
                        await this.deleteAlert(id);
                    }
                });
            });
        }
    },
    
    async deleteAlert(id) {
        if (!AppState.supabase) {
            alert('[Mock] 메시지가 삭제되었습니다.');
            this.loadHistory();
            return;
        }

        showLoading(true);
        const { error } = await AppState.supabase
            .from('sos_alerts')
            .delete()
            .eq('id', id);
            
        showLoading(false);
        if (error) {
            alert('삭제 실패: ' + error.message);
        } else {
            this.loadHistory();
        }
    },

    setupRealtime() {
        if (!AppState.supabase || window._sosRealtimeInitialized) return;
        
        window._sosRealtimeInitialized = true;
        
        // Listen to inserts on sos_alerts table
        AppState.supabase
            .channel('public:sos_alerts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_alerts' }, payload => {
                this.showSOSAlert(payload.new.message);
                // 현재 뷰가 sos면 목록 갱신
                if (window.AppRouter && window.AppRouter.currentModule === 'sos') {
                    this.loadHistory();
                }
            })
            .subscribe();
            
        // SOS 팝업 닫기 이벤트 등록
        const btnClose = document.getElementById('btn-close-sos');
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                document.getElementById('sos-alert-container').classList.add('hidden');
            });
        }
        
        // 헤더 SOS 발송 버튼 이벤트 등록 (관리자용 단축 버튼)
        const btnTrigger = document.getElementById('btn-sos-trigger');
        if (btnTrigger) {
            // 중복 바인딩 방지
            const newBtnTrigger = btnTrigger.cloneNode(true);
            btnTrigger.parentNode.replaceChild(newBtnTrigger, btnTrigger);
            
            newBtnTrigger.addEventListener('click', () => {
                window.AppRouter.navigate('sos');
            });
        }
    },

    showSOSAlert(message) {
        const container = document.getElementById('sos-alert-container');
        const msgEl = document.getElementById('sos-alert-message');
        
        msgEl.textContent = message;
        container.classList.remove('hidden');
        
        // 진동 효과 (지원 기기)
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 500]);
        }
    }
};
