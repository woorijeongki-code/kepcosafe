window.Modules['inspections'] = {
    title: '안전점검',
    
    render() {
        const isAdmin = AppState.profile && AppState.profile.role === 'admin';
        return `
            <div class="space-y-6 fade-in h-full flex flex-col relative pb-10">
                <!-- 헤더 영역 -->
                <div class="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden mt-2 mx-2">
                    <div class="relative z-10 flex items-center justify-between">
                        <div>
                            <h2 class="text-xl font-black mb-1">일일 안전점검 결과</h2>
                            <p class="text-cyan-50 text-xs font-medium">현장 안전점검 수행 결과를 확인하세요.</p>
                        </div>
                        <div class="text-4xl opacity-20">
                            <i class="fa-solid fa-list-check"></i>
                        </div>
                    </div>
                </div>
                
                ${isAdmin ? `
                <div class="px-2 mb-2 flex justify-end">
                    <button id="btn-show-insp-form" class="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1">
                        <i class="fa-solid fa-pen"></i> 점검결과 등록
                    </button>
                </div>
                
                <!-- 등록 폼 (기본 숨김) -->
                <div id="insp-form-container" class="hidden bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mx-2 mb-4 fade-in relative">
                    <button id="btn-close-insp-form" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                    <h4 class="font-bold text-slate-800 mb-4" id="insp-form-title">안전점검 결과 등록</h4>
                    <form id="insp-form" class="space-y-3">
                        <input type="hidden" id="i-id" value="">
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">점검결과 제목</label>
                            <input type="text" id="i-title" required class="block w-full p-2.5 border border-slate-300 rounded-xl focus:ring-cyan-500 focus:border-cyan-500 text-sm" placeholder="예: [배전] 활선차량 일일 안전점검 결과">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">점검 내용</label>
                            <textarea id="i-content" rows="4" required class="block w-full p-2.5 border border-slate-300 rounded-xl focus:ring-cyan-500 focus:border-cyan-500 text-sm" placeholder="현장 안전점검 결과 상세 내용을 입력하세요"></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">붙임 (첨부파일/사진)</label>
                            <input type="file" id="i-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1">
                        </div>
                        <button type="submit" class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors mt-2 text-sm" id="i-submit-btn">
                            <i class="fa-solid fa-check mr-1"></i> 등록 완료
                        </button>
                    </form>
                </div>
                ` : ''}

                <!-- 점검 리스트 영역 -->
                <div id="insp-list" class="flex-1 overflow-y-auto space-y-3 px-2">
                    <div class="animate-pulse space-y-3 p-2"><div class="h-24 bg-slate-200 rounded-2xl w-full"></div><div class="h-24 bg-slate-200 rounded-2xl w-full"></div></div>
                </div>
            </div>
        `;
    },

    init() {
        this.loadData();
        
        // Admin Form Events
        const btnShowForm = document.getElementById('btn-show-insp-form');
        const btnCloseForm = document.getElementById('btn-close-insp-form');
        const formContainer = document.getElementById('insp-form-container');
        const inspForm = document.getElementById('insp-form');
        
        if (btnShowForm && formContainer) {
            btnShowForm.addEventListener('click', () => {
                document.getElementById('i-id').value = '';
                document.getElementById('i-submit-btn').innerHTML = '<i class="fa-solid fa-check mr-1"></i> 등록 완료';
                document.getElementById('insp-form-title').textContent = '안전점검 결과 등록';
                inspForm.reset();
                formContainer.classList.remove('hidden');
                btnShowForm.classList.add('hidden');
            });
            
            btnCloseForm.addEventListener('click', () => {
                formContainer.classList.add('hidden');
                btnShowForm.classList.remove('hidden');
            });
            
            inspForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('i-id').value;
                const title = document.getElementById('i-title').value;
                const content = document.getElementById('i-content').value;
                const fileInput = document.getElementById('i-file');
                const hasFile = fileInput && fileInput.files.length > 0;
                
                if (!AppState.supabase) {
                    alert('[Mock] ' + (id ? '수정' : '등록') + '되었습니다.' + (hasFile ? '\\n(첨부파일: ' + fileInput.files[0].name + ')' : ''));
                    inspForm.reset();
                    formContainer.classList.add('hidden');
                    btnShowForm.classList.remove('hidden');
                    this.loadData();
                    return;
                }
                
                showLoading(true);
                let fileUrl = null;
                if (hasFile) {
                    fileUrl = 'mock_attachment_' + Date.now() + '.pdf';
                }

                let error;
                if (id) {
                    const res = await AppState.supabase.from('inspections').update({
                        title: title,
                        content: content,
                        ...(hasFile && { file_url: fileUrl })
                    }).eq('id', id);
                    error = res.error;
                } else {
                    const res = await AppState.supabase.from('inspections').insert([{
                        title: title,
                        content: content,
                        file_url: fileUrl
                    }]);
                    error = res.error;
                }
                
                showLoading(false);
                if (error) {
                    alert('저장 실패: (Supabase 테이블이 없을 수 있습니다) ' + error.message);
                } else {
                    alert('성공적으로 저장되었습니다.');
                    inspForm.reset();
                    formContainer.classList.add('hidden');
                    btnShowForm.classList.remove('hidden');
                    this.loadData();
                }
            });
        }
    },

    async loadData() {
        const listEl = document.getElementById('insp-list');
        
        if (!AppState.supabase) {
            setTimeout(() => {
                listEl.innerHTML = `
                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 cursor-pointer hover:bg-slate-50 transition-colors">
                        <div class="w-12 h-12 shrink-0 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center text-xl">
                            <i class="fa-solid fa-clipboard-check"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-slate-800 mb-1">[Mock] 장마철 현장 특별 안전점검 결과</h4>
                            <p class="text-xs text-slate-500 line-clamp-2">지반 침하 위험 구역 및 양수기 정상 작동 여부 점검 완료 (특이사항 없음)</p>
                            <button class="mt-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation(); alert('첨부파일 다운로드 (Mock)')">
                                <i class="fa-solid fa-paperclip"></i> 현장사진.jpg
                            </button>
                            <span class="text-[10px] text-slate-400 mt-2 block">2026-06-03</span>
                        </div>
                    </div>
                `;
            }, 300);
            return;
        }

        const { data, error } = await AppState.supabase
            .from('inspections')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || data.length === 0) {
            listEl.innerHTML = `
                <div class="text-center py-10 flex flex-col items-center">
                    <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 text-3xl mb-3">
                        <i class="fa-solid fa-list-check"></i>
                    </div>
                    <p class="text-slate-500 text-sm font-medium">등록된 점검결과가 없습니다.</p>
                </div>
            `;
            return;
        }

        const isAdmin = AppState.profile && AppState.profile.role === 'admin';

        listEl.innerHTML = data.map(item => {
            const editControls = isAdmin ? `
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                    <button class="btn-edit-insp w-7 h-7 rounded bg-slate-100 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 flex items-center justify-center transition-colors" data-id="${item.id}" data-title="${item.title.replace(/"/g, '&quot;')}" data-content="${(item.content || '').replace(/"/g, '&quot;')}">
                        <i class="fa-solid fa-pen text-[10px]"></i>
                    </button>
                    <button class="btn-del-insp w-7 h-7 rounded bg-slate-100 text-slate-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors" data-id="${item.id}">
                        <i class="fa-solid fa-trash text-[10px]"></i>
                    </button>
                </div>
            ` : '';

            return `
                <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 relative group hover:border-cyan-200 transition-colors">
                    ${editControls}
                    <div class="w-12 h-12 shrink-0 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center text-xl">
                        <i class="fa-solid fa-clipboard-check"></i>
                    </div>
                    <div class="flex-1 min-w-0 pr-12">
                        <h4 class="font-bold text-slate-800 mb-1">${item.title}</h4>
                        <p class="text-xs text-slate-500 whitespace-pre-wrap">${item.content || ''}</p>
                        ${item.file_url ? `
                        <button class="mt-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation(); alert('첨부파일 다운로드 기능은 파일 스토리지가 연결되어야 작동합니다.')">
                            <i class="fa-solid fa-paperclip"></i> 첨부자료 확인
                        </button>
                        ` : ''}
                        <span class="text-[10px] text-slate-400 mt-2 block">${new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        }).join('');

        // 이벤트 위임
        if (isAdmin) {
            listEl.querySelectorAll('.btn-edit-insp').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const formContainer = document.getElementById('insp-form-container');
                    const btnShowForm = document.getElementById('btn-show-insp-form');
                    
                    document.getElementById('i-id').value = btn.dataset.id;
                    document.getElementById('i-title').value = btn.dataset.title;
                    document.getElementById('i-content').value = btn.dataset.content;
                    
                    document.getElementById('insp-form-title').textContent = '안전점검 결과 수정';
                    document.getElementById('i-submit-btn').innerHTML = '<i class="fa-solid fa-check mr-1"></i> 수정 완료';
                    
                    formContainer.classList.remove('hidden');
                    if(btnShowForm) btnShowForm.classList.add('hidden');
                });
            });

            listEl.querySelectorAll('.btn-del-insp').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm('이 점검결과를 정말 삭제하시겠습니까?')) {
                        if (!AppState.supabase) {
                            alert('[Mock] 삭제되었습니다.');
                            return;
                        }
                        showLoading(true);
                        const { error } = await AppState.supabase.from('inspections').delete().eq('id', btn.dataset.id);
                        showLoading(false);
                        if (error) alert('삭제 실패: ' + error.message);
                        else this.loadData();
                    }
                });
            });
        }
    }
};
