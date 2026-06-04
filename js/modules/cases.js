window.Modules['cases'] = {
    title: '사고/우수사례 아카이브',
    
    render() {
        return `
            <div class="space-y-6 fade-in h-full flex flex-col relative">
                <div class="flex border-b border-slate-200 mb-2">
                    <button class="flex-1 py-3 text-sm font-bold text-red-500 border-b-2 border-red-500" id="tab-accident">사고사례 (타산지석)</button>
                    <button class="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors" id="tab-best">우수사례 (벤치마킹)</button>
                </div>
                
                ${AppState.profile && AppState.profile.role === 'admin' ? `
                <div class="px-2 mb-2 flex justify-end">
                    <button id="btn-show-case-form" class="bg-primary hover:bg-blue-800 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1">
                        <i class="fa-solid fa-pen"></i> 등록하기
                    </button>
                </div>
                
                <div id="case-form-container" class="hidden bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-4 fade-in relative">
                    <button id="btn-close-case-form" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                    <h4 class="font-bold text-slate-800 mb-4" id="case-form-title">새 사례 등록</h4>
                    <form id="case-form" class="space-y-3">
                        <input type="hidden" id="c-id" value="">
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">제목</label>
                            <input type="text" id="c-title" required class="block w-full p-2.5 border border-slate-300 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="사례 제목">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">상세 내용</label>
                            <textarea id="c-content" rows="3" required class="block w-full p-2.5 border border-slate-300 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="상세 내용을 입력하세요"></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">붙임 (첨부파일/이미지)</label>
                            <input type="file" id="c-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1">
                        </div>
                        <button type="submit" class="w-full bg-slate-800 hover:bg-black text-white font-bold py-3 rounded-xl shadow-md transition-colors mt-2 text-sm" id="c-submit-btn">
                            <i class="fa-solid fa-check mr-1"></i> 등록 완료
                        </button>
                    </form>
                </div>
                ` : ''}

                <div id="case-list" class="flex-1 overflow-y-auto space-y-4 pb-4 px-2">
                    <div class="animate-pulse space-y-3 p-2"><div class="h-32 bg-slate-200 rounded-2xl w-full"></div><div class="h-32 bg-slate-200 rounded-2xl w-full"></div></div>
                </div>

                <!-- 상세 보기 모달 -->
                <div id="case-detail-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4 opacity-0 transition-opacity">
                    <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transform scale-95 transition-transform flex flex-col max-h-[90vh]" id="case-detail-modal-content">
                        <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2" id="c-detail-badge-container">
                                <span id="c-detail-category-badge" class="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded">우수</span>
                            </h3>
                            <button id="btn-close-case-detail" class="text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200">
                                <i class="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        <div class="p-6 overflow-y-auto flex-1">
                            <div id="c-detail-image-container" class="mb-4 rounded-xl overflow-hidden bg-slate-100 hidden">
                                <img id="c-detail-image" src="" alt="사례 이미지" class="w-full h-auto object-contain max-h-64">
                            </div>
                            <h2 class="text-xl font-bold text-slate-800 mb-2" id="c-detail-title">제목</h2>
                            <p class="text-xs text-slate-400 mb-6" id="c-detail-date">2026-06-04</p>
                            <div class="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed mb-6" id="c-detail-body">내용</div>
                            
                            <div id="c-detail-attachment" class="hidden border-t border-slate-100 pt-4">
                                <h4 class="text-xs font-bold text-slate-500 mb-2">첨부자료</h4>
                                <a href="#" target="_blank" id="c-detail-link-btn" class="inline-flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors border border-slate-200">
                                    <i class="fa-solid fa-paperclip"></i> <span>원본 파일 보기</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        this.currentTab = 'accident';
        this.loadCases();

        const tabAccident = document.getElementById('tab-accident');
        const tabBest = document.getElementById('tab-best');

        if (tabAccident && tabBest) {
            tabAccident.addEventListener('click', () => {
                this.currentTab = 'accident';
                tabAccident.className = "flex-1 py-3 text-sm font-bold text-red-500 border-b-2 border-red-500 transition-all";
                tabBest.className = "flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all";
                this.loadCases();
            });

            tabBest.addEventListener('click', () => {
                this.currentTab = 'best_practice';
                tabBest.className = "flex-1 py-3 text-sm font-bold text-emerald-500 border-b-2 border-emerald-500 transition-all";
                tabAccident.className = "flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all";
                const formTitle = document.getElementById('case-form-title');
                if(formTitle) formTitle.textContent = '새 우수사례 등록';
                this.loadCases();
            });
        }
        
        // Admin Form Events
        const btnShowForm = document.getElementById('btn-show-case-form');
        const btnCloseForm = document.getElementById('btn-close-case-form');
        const formContainer = document.getElementById('case-form-container');
        const caseForm = document.getElementById('case-form');
        
        if (btnShowForm && formContainer) {
            btnShowForm.addEventListener('click', () => {
                document.getElementById('c-id').value = '';
                document.getElementById('c-submit-btn').innerHTML = '<i class="fa-solid fa-check mr-1"></i> 등록 완료';
                document.getElementById('case-form-title').textContent = this.currentTab === 'accident' ? '새 사고사례 등록' : '새 우수사례 등록';
                caseForm.reset();
                formContainer.classList.remove('hidden');
                btnShowForm.classList.add('hidden');
            });
            
            btnCloseForm.addEventListener('click', () => {
                formContainer.classList.add('hidden');
                btnShowForm.classList.remove('hidden');
            });
            
            // 상세 모달 닫기
            const detailModal = document.getElementById('case-detail-modal');
            const detailModalContent = document.getElementById('case-detail-modal-content');
            const btnCloseDetail = document.getElementById('btn-close-case-detail');
            
            const closeDetailModal = () => {
                detailModal.classList.add('opacity-0');
                detailModalContent.classList.add('scale-95');
                setTimeout(() => {
                    detailModal.classList.add('hidden');
                }, 300);
            };
            
            if (btnCloseDetail) btnCloseDetail.addEventListener('click', closeDetailModal);
            if (detailModal) {
                detailModal.addEventListener('click', (e) => {
                    if (e.target === detailModal) closeDetailModal();
                });
            }

            caseForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('c-id').value;
                const title = document.getElementById('c-title').value;
                const content = document.getElementById('c-content').value;
                const fileInput = document.getElementById('c-file');
                const hasFile = fileInput && fileInput.files.length > 0;
                
                if (!AppState.supabase) {
                    alert('[Mock] ' + (id ? '수정' : '등록') + '되었습니다.' + (hasFile ? '\\n(첨부파일: ' + fileInput.files[0].name + ')' : ''));
                    caseForm.reset();
                    formContainer.classList.add('hidden');
                    btnShowForm.classList.remove('hidden');
                    this.loadCases();
                    return;
                }
                
                showLoading(true);
                // 실제 파일 업로드 로직
                let fileUrl = null;
                if (hasFile) {
                    const file = fileInput.files[0];
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                    
                    const { data: uploadData, error: uploadError } = await AppState.supabase.storage
                        .from('attachments')
                        .upload(fileName, file);
                        
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
                    const res = await AppState.supabase.from('cases').update({
                        category: this.currentTab,
                        title: title,
                        content: content,
                        ...(hasFile && { file_url: fileUrl })
                    }).eq('id', id);
                    error = res.error;
                } else {
                    const res = await AppState.supabase.from('cases').insert([{
                        category: this.currentTab,
                        title: title,
                        content: content,
                        file_url: fileUrl,
                        created_by: AppState.user.id
                    }]);
                    error = res.error;
                }
                
                showLoading(false);
                if (error) {
                    alert('처리 실패: ' + error.message);
                } else {
                    alert(id ? '수정되었습니다.' : '등록되었습니다.');
                    caseForm.reset();
                    formContainer.classList.add('hidden');
                    btnShowForm.classList.remove('hidden');
                    this.loadCases();
                }
            });
        }
    },

    async loadCases() {
        const listEl = document.getElementById('cases-list');
        listEl.innerHTML = '<div class="animate-pulse space-y-3 p-2"><div class="h-20 bg-slate-200 rounded-2xl w-full"></div><div class="h-20 bg-slate-200 rounded-2xl w-full"></div><div class="h-20 bg-slate-200 rounded-2xl w-full"></div></div>';
        
        if (!AppState.supabase) {
            setTimeout(() => {
                if (this.currentTab === 'accident') {
                    listEl.innerHTML = `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onclick="alert('사례 상세 보기')">
                                <div class="h-32 bg-slate-200 flex items-center justify-center relative">
                                    <i class="fa-regular fa-image text-slate-400 text-3xl"></i>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <span class="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">추락사고</span>
                                </div>
                                <div class="p-4">
                                    <h4 class="font-bold text-sm text-slate-800 mb-1">[Mock] A지사 전주 교체 중 추락 발생</h4>
                                    <p class="text-xs text-slate-500 line-clamp-2">안전대 미체결 상태에서 작업 위치 이동 중 발판 미끄러짐으로 인한 추락 사고 발생...</p>
                                    <button class="mt-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation(); alert('첨부파일 다운로드 (Mock)')">
                                        <i class="fa-solid fa-paperclip"></i> 사고현장_사진.jpg
                                    </button>
                                    <span class="text-[10px] text-slate-400 mt-2 block">2026-05-15</span>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    listEl.innerHTML = `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                                <div class="h-32 bg-slate-200 flex items-center justify-center relative">
                                    <i class="fa-regular fa-image text-slate-400 text-3xl"></i>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <span class="absolute bottom-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded">장비개선</span>
                                </div>
                                <div class="p-4">
                                    <h4 class="font-bold text-sm text-slate-800 mb-1">[Mock] 자체 고안 스마트 안전고리 도입</h4>
                                    <p class="text-xs text-slate-500 line-clamp-2">체결 여부를 LED와 소리로 알려주는 스마트 안전고리를 도입하여 근로자 만족도 및 안전성 향상...</p>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }, 300);
            return;
        }

        const { data, error } = await AppState.supabase
            .from('cases')
            .select('*')
            .eq('category', this.currentTab)
            .order('created_at', { ascending: false });

        if (error || data.length === 0) {
            listEl.innerHTML = `
                <div class="text-center py-10 flex flex-col items-center">
                    <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 text-3xl mb-3">
                        <i class="fa-regular fa-folder-open"></i>
                    </div>
                    <p class="text-slate-500 text-sm">등록된 사례가 없습니다.</p>
                </div>
            `;
            return;
        }

        const isAdmin = AppState.profile && AppState.profile.role === 'admin';

        listEl.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">` + data.map(item => {
            const badgeColor = this.currentTab === 'accident' ? 'bg-red-600' : 'bg-emerald-600';
            const badgeLabel = this.currentTab === 'accident' ? '사고' : '우수';
            const imageStyle = item.image_url 
                ? `background-image: url('${item.image_url}'); background-size: cover; background-position: center;` 
                : '';
                
            const isAuthor = AppState.user && item.created_by === AppState.user.id;
            const canEdit = isAuthor || isAdmin;

            const editControls = canEdit ? `
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2 z-10">
                    <button class="btn-edit-case w-6 h-6 rounded bg-black/50 text-white hover:text-primary hover:bg-white flex items-center justify-center transition-colors" data-id="${item.id}" data-title="${item.title.replace(/"/g, '&quot;')}" data-content="${(item.content || '').replace(/"/g, '&quot;')}" data-image="${(item.image_url || '').replace(/"/g, '&quot;')}">
                        <i class="fa-solid fa-pen text-[10px]"></i>
                    </button>
                    <button class="btn-del-case w-6 h-6 rounded bg-black/50 text-white hover:text-brandRed hover:bg-white flex items-center justify-center transition-colors" data-id="${item.id}">
                        <i class="fa-solid fa-trash text-[10px]"></i>
                    </button>
                </div>
            ` : '';

            return `
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow relative group btn-view-case cursor-pointer" data-type="${this.currentTab}" data-title="${item.title.replace(/"/g, '&quot;')}" data-content="${(item.content || '').replace(/"/g, '&quot;')}" data-file="${(item.file_url || item.image_url || '').replace(/"/g, '&quot;')}" data-date="${item.created_at}" data-image="${(item.image_url || '').replace(/"/g, '&quot;')}">
                    <div class="h-32 bg-slate-200 flex items-center justify-center relative" style="${imageStyle}">
                        ${!item.image_url ? '<i class="fa-regular fa-image text-slate-400 text-3xl"></i>' : ''}
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <span class="absolute bottom-2 right-2 ${badgeColor} text-white text-[10px] font-bold px-2 py-1 rounded">${badgeLabel}</span>
                    </div>
                    ${editControls}
                    <div class="p-4">
                        <h4 class="font-bold text-sm text-slate-800 mb-1">${item.title}</h4>
                        <p class="text-xs text-slate-500 line-clamp-2">${item.content}</p>
                        ${(item.file_url || item.image_url) ? `
                        <div class="mt-2 text-[10px] bg-slate-100 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit border border-slate-200">
                            <i class="fa-solid fa-paperclip"></i> 첨부자료 있음
                        </div>
                        ` : ''}
                        <span class="text-[10px] text-slate-400 mt-2 block">${new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        }).join('') + `</div>`;

        // 상세 보기 이벤트
        listEl.querySelectorAll('.btn-view-case').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                const title = btn.getAttribute('data-title');
                const content = btn.getAttribute('data-content');
                const date = btn.getAttribute('data-date');
                const fileUrl = btn.getAttribute('data-file');
                const imageUrl = btn.getAttribute('data-image');
                
                const badgeContainer = document.getElementById('c-detail-badge-container');
                if (type === 'accident') {
                    badgeContainer.innerHTML = '<span class="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">사고</span> <span class="text-sm">사고사례</span>';
                } else {
                    badgeContainer.innerHTML = '<span class="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded">우수</span> <span class="text-sm">우수사례</span>';
                }
                
                document.getElementById('c-detail-title').textContent = title;
                document.getElementById('c-detail-date').textContent = new Date(date).toLocaleString();
                document.getElementById('c-detail-body').textContent = content;
                
                const imgContainer = document.getElementById('c-detail-image-container');
                const imgEl = document.getElementById('c-detail-image');
                if (imageUrl) {
                    imgEl.src = imageUrl;
                    imgContainer.classList.remove('hidden');
                } else {
                    imgContainer.classList.add('hidden');
                    imgEl.src = '';
                }
                
                const attachContainer = document.getElementById('c-detail-attachment');
                const linkBtn = document.getElementById('c-detail-link-btn');
                
                if (fileUrl) {
                    attachContainer.classList.remove('hidden');
                    linkBtn.href = fileUrl;
                } else {
                    attachContainer.classList.add('hidden');
                }
                
                const modal = document.getElementById('case-detail-modal');
                const modalContent = document.getElementById('case-detail-modal-content');
                
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    modalContent.classList.remove('scale-95');
                }, 10);
            });
        });

        // 이벤트 위임
        if (isAdmin || AppState.user) {
            listEl.querySelectorAll('.btn-edit-case').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const formContainer = document.getElementById('case-form-container');
                    const btnShowForm = document.getElementById('btn-show-case-form');
                    
                    document.getElementById('c-id').value = btn.dataset.id;
                    document.getElementById('c-title').value = btn.dataset.title;
                    document.getElementById('c-content').value = btn.dataset.content;
                    document.getElementById('c-image').value = btn.dataset.image;
                    
                    document.getElementById('case-form-title').textContent = '사례 수정';
                    document.getElementById('c-submit-btn').innerHTML = '<i class="fa-solid fa-check mr-1"></i> 수정 완료';
                    
                    formContainer.classList.remove('hidden');
                    if(btnShowForm) btnShowForm.classList.add('hidden');
                    formContainer.scrollIntoView({ behavior: 'smooth' });
                });
            });

            listEl.querySelectorAll('.btn-del-case').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm('정말 이 사례를 삭제하시겠습니까?')) {
                        if (!AppState.supabase) {
                            alert('[Mock] 삭제되었습니다.');
                            return;
                        }
                        showLoading(true);
                        const { error } = await AppState.supabase.from('cases').delete().eq('id', btn.dataset.id);
                        showLoading(false);
                        if (error) alert('삭제 실패: ' + error.message);
                        else this.loadCases();
                    }
                });
            });
        }
    }
};
