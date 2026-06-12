window.Modules['methods'] = {
    title: '작업공법',
    
    render() {
        const isAdmin = AppState.profile && AppState.profile.role === 'admin';
        return `
            <div class="space-y-6 fade-in h-full flex flex-col relative pb-10">
                <!-- 헤더 영역 -->
                <div class="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden mt-2 mx-2">
                    <div class="relative z-10 flex items-center justify-between">
                        <div>
                            <h2 class="text-xl font-black mb-1">표준 작업공법 안내</h2>
                            <p class="text-teal-50 text-xs font-medium">안전하고 정확한 작업 공법을 확인하세요.</p>
                        </div>
                        <div class="text-4xl opacity-20">
                            <i class="fa-solid fa-screwdriver-wrench"></i>
                        </div>
                    </div>
                </div>
                
                ${isAdmin ? `
                <div class="px-2 mb-2 flex justify-end">
                    <button id="btn-show-method-form" class="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1">
                        <i class="fa-solid fa-pen"></i> 작업공법 등록
                    </button>
                </div>
                
                <!-- 등록 폼 (기본 숨김) -->
                <div id="method-form-container" class="hidden bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mx-2 mb-4 fade-in relative">
                    <button id="btn-close-method-form" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                    <h4 class="font-bold text-slate-800 mb-4" id="method-form-title">새 작업공법 등록</h4>
                    <form id="method-form" class="space-y-3">
                        <input type="hidden" id="m-id" value="">
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">공법 제목</label>
                            <input type="text" id="m-title" required class="block w-full p-2.5 border border-slate-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-sm" placeholder="예: 무정전 배전설비 교체 공법">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">외부 링크 (유튜브/드라이브 등)</label>
                            <input type="url" id="m-link" class="block w-full p-2.5 border border-slate-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-sm" placeholder="https://...">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">상세 내용</label>
                            <textarea id="m-content" rows="4" required class="block w-full p-2.5 border border-slate-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-sm" placeholder="상세 내용을 입력하세요"></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">붙임 (첨부파일)</label>
                            <input type="file" id="m-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1">
                        </div>
                        <button type="submit" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors mt-2 text-sm" id="m-submit-btn">
                            <i class="fa-solid fa-check mr-1"></i> 등록 완료
                        </button>
                    </form>
                </div>
                ` : ''}

                <!-- 공법 리스트 영역 -->
                <div id="method-list" class="flex-1 overflow-y-auto space-y-3 px-2">
                    <div class="animate-pulse space-y-3 p-2"><div class="h-24 bg-slate-200 rounded-2xl w-full"></div><div class="h-24 bg-slate-200 rounded-2xl w-full"></div></div>
                </div>
            </div>
        `;
    },

    init() {
        this.loadData();
        
        // Admin Form Events
        const btnShowForm = document.getElementById('btn-show-method-form');
        const btnCloseForm = document.getElementById('btn-close-method-form');
        const formContainer = document.getElementById('method-form-container');
        const methodForm = document.getElementById('method-form');
        
        if (btnShowForm && formContainer) {
            btnShowForm.addEventListener('click', () => {
                document.getElementById('m-id').value = '';
                document.getElementById('m-submit-btn').innerHTML = '<i class="fa-solid fa-check mr-1"></i> 등록 완료';
                document.getElementById('method-form-title').textContent = '새 작업공법 등록';
                methodForm.reset();
                formContainer.classList.remove('hidden');
                btnShowForm.classList.add('hidden');
            });
            
            btnCloseForm.addEventListener('click', () => {
                formContainer.classList.add('hidden');
                btnShowForm.classList.remove('hidden');
            });
            
            methodForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('m-id').value;
                const title = document.getElementById('m-title').value;
                const link = document.getElementById('m-link').value;
                const content = document.getElementById('m-content').value;
                const fileInput = document.getElementById('m-file');
                const hasFile = fileInput && fileInput.files.length > 0;
                
                if (!AppState.supabase) {
                    alert('[Mock] ' + (id ? '수정' : '등록') + '되었습니다.' + (hasFile ? '\\n(첨부파일: ' + fileInput.files[0].name + ')' : ''));
                    methodForm.reset();
                    formContainer.classList.add('hidden');
                    btnShowForm.classList.remove('hidden');
                    this.loadData();
                    return;
                }
                
                // 실제 파일 업로드 로직
                let fileUrl = null;
                if (hasFile) {
                    const file = fileInput.files[0];
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                    
                    const { data: uploadData, error: uploadError } = await AppState.supabase.storage
                        .from('attachments')
                        .upload(fileName, new Blob([await file.arrayBuffer()], {type: file.type || 'application/pdf'}), { contentType: file.type || 'application/pdf' });
                        
                    if (uploadError) {
                        alert('파일 업로드 실패: ' + uploadError.message);
                        showLoading(false);
                        return;
                    }
                    
                    const { data: publicUrlData } = AppState.supabase.storage
                        .from('attachments')
                        .getPublicUrl(fileName);
                        
                    fileUrl = publicUrlData.publicUrl;
                }

                let error;
                if (id) {
                    const res = await AppState.supabase.from('methods').update({
                        title: title,
                        content: content,
                        drive_link: link || null,
                        ...(hasFile && { file_url: fileUrl })
                    }).eq('id', id);
                    error = res.error;
                } else {
                    const res = await AppState.supabase.from('methods').insert([{
                        title: title,
                        content: content,
                        drive_link: link || null,
                        file_url: fileUrl,
                        created_by: AppState.user.id
                    }]);
                    error = res.error;
                }
                
                showLoading(false);
                if (error) {
                    alert('저장 실패: (Supabase 테이블이 없을 수 있습니다) ' + error.message);
                } else {
                    alert('성공적으로 저장되었습니다.');
                    methodForm.reset();
                    formContainer.classList.add('hidden');
                    btnShowForm.classList.remove('hidden');
                    this.loadData();
                }
            });
        }
    },

    async loadData() {
        const listEl = document.getElementById('method-list');
        
        if (!AppState.supabase) {
            setTimeout(() => {
                listEl.innerHTML = `
                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 cursor-pointer hover:bg-slate-50 transition-colors">
                        <div class="w-12 h-12 shrink-0 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-xl">
                            <i class="fa-solid fa-book-open-reader"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-slate-800 mb-1">[Mock] 배전선로 활선작업 표준공법</h4>
                            <p class="text-xs text-slate-500 line-clamp-2">활선작업 시 필수적으로 지켜야 할 이격거리 및 절연용구 착용 기준에 대한 상세 설명서입니다...</p>
                            <a href="#" target="_blank" rel="noopener noreferrer" class="mt-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation();">
                                <i class="fa-solid fa-paperclip"></i> 활선작업_표준공법.pdf
                            </a>
                            <span class="text-[10px] text-slate-400 mt-2 block">2026-06-03</span>
                        </div>
                    </div>
                `;
            }, 300);
            return;
        }

        const { data, error } = await AppState.supabase
            .from('methods')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || data.length === 0) {
            listEl.innerHTML = `
                <div class="text-center py-10 flex flex-col items-center">
                    <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 text-3xl mb-3">
                        <i class="fa-solid fa-folder-open"></i>
                    </div>
                    <p class="text-slate-500 text-sm font-medium">등록된 작업공법이 없습니다.</p>
                </div>
            `;
            return;
        }

        const isAdmin = AppState.profile && AppState.profile.role === 'admin';

        listEl.innerHTML = data.map(item => {
            const editControls = isAdmin ? `
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                    <button class="btn-edit-method w-7 h-7 rounded bg-slate-100 text-slate-500 hover:text-teal-600 hover:bg-teal-50 flex items-center justify-center transition-colors" data-id="${item.id}" data-title="${(item.title || '').replace(/"/g, '&quot;')}" data-content="${(item.content || '').replace(/"/g, '&quot;')}">
                        <i class="fa-solid fa-pen text-[10px]"></i>
                    </button>
                    <button class="btn-del-method w-7 h-7 rounded bg-slate-100 text-slate-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors" data-id="${item.id}">
                        <i class="fa-solid fa-trash text-[10px]"></i>
                    </button>
                </div>
            ` : '';

            return `
                <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 relative group hover:border-teal-200 transition-colors">
                    ${editControls}
                    <div class="w-12 h-12 shrink-0 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-xl">
                        <i class="fa-solid fa-book-open-reader"></i>
                    </div>
                    <div class="flex-1 min-w-0 pr-12">
                        <h4 class="font-bold text-slate-800 mb-1">${item.title}</h4>
                        <p class="text-xs text-slate-500 whitespace-pre-wrap">${item.content || ''}</p>
                        ${item.drive_link ? `
                        <a href="${item.drive_link}" target="_blank" rel="noopener noreferrer" class="mt-2 text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors font-medium border border-indigo-100 w-fit" onclick="event.stopPropagation();">
                            <i class="fa-solid fa-link"></i> 외부 링크 열기
                        </a>
                        ` : ''}
                        ${item.file_url ? `
                        <a href="${item.file_url}" target="_blank" rel="noopener noreferrer" class="mt-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation();">
                            <i class="fa-solid fa-paperclip"></i> 첨부자료 다운로드
                        </a>
                        ` : ''}
                        <span class="text-[10px] text-slate-400 mt-2 block">${new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        }).join('');

        // 이벤트 위임
        if (isAdmin) {
            listEl.querySelectorAll('.btn-edit-method').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const formContainer = document.getElementById('method-form-container');
                    const btnShowForm = document.getElementById('btn-show-method-form');
                    
                    document.getElementById('m-id').value = btn.dataset.id;
                    document.getElementById('m-title').value = btn.dataset.title;
                    document.getElementById('m-content').value = btn.dataset.content;
                    
                    const linkInput = document.getElementById('m-link');
                    if(linkInput) linkInput.value = btn.dataset.link || '';
                    
                    document.getElementById('method-form-title').textContent = '작업공법 수정';
                    document.getElementById('m-submit-btn').innerHTML = '<i class="fa-solid fa-check mr-1"></i> 수정 완료';
                    
                    formContainer.classList.remove('hidden');
                    if(btnShowForm) btnShowForm.classList.add('hidden');
                });
            });

            listEl.querySelectorAll('.btn-del-method').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm('이 작업공법을 정말 삭제하시겠습니까?')) {
                        if (!AppState.supabase) {
                            alert('[Mock] 삭제되었습니다.');
                            return;
                        }
                        showLoading(true);
                        const { error } = await AppState.supabase.from('methods').delete().eq('id', btn.dataset.id);
                        showLoading(false);
                        if (error) alert('삭제 실패: ' + error.message);
                        else this.loadData();
                    }
                });
            });
        }
    }
};
