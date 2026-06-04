window.Modules['notices'] = {
    title: '공지 및 교육자료',
    
    render() {
        const isAdmin = AppState.profile && AppState.profile.role === 'admin';
        return `
            <div class="space-y-6 fade-in h-full flex flex-col relative">
                <div class="flex border-b border-slate-200 mb-2">
                    <button class="flex-1 py-3 text-sm font-bold text-primary border-b-2 border-primary" id="tab-notice">안전공지</button>
                    <button class="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors" id="tab-edu">교육자료실</button>
                </div>
                
                ${isAdmin ? `
                <div class="px-2 mb-2 flex justify-end">
                    <button id="btn-show-form" class="bg-primary hover:bg-blue-800 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1">
                        <i class="fa-solid fa-pen"></i> 등록하기
                    </button>
                </div>
                
                <!-- 등록 폼 (기본 숨김) -->
                <div id="register-form-container" class="hidden bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-4 fade-in relative">
                    <button id="btn-close-form" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                    <h4 class="font-bold text-slate-800 mb-4" id="form-title">새 안전공지 등록</h4>
                    <form id="notice-form" class="space-y-3">
                        <input type="hidden" id="n-id" value="">
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">제목</label>
                            <input type="text" id="n-title" required class="block w-full p-2.5 border border-slate-300 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="제목을 입력하세요">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">내용 (또는 설명)</label>
                            <textarea id="n-content" rows="3" required class="block w-full p-2.5 border border-slate-300 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="내용을 입력하세요"></textarea>
                        </div>
                        <div id="drive-link-container" class="hidden">
                            <label class="block text-xs font-medium text-slate-700 mb-1">구글 드라이브 링크 (교육자료 전용)</label>
                            <input type="url" id="n-link" class="block w-full p-2.5 border border-slate-300 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="https://drive.google.com/...">
                        </div>
                        <div id="notice-file-container">
                            <label class="block text-xs font-medium text-slate-700 mb-1">붙임 (첨부파일)</label>
                            <input type="file" id="n-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1">
                        </div>
                        <button type="submit" class="w-full bg-slate-800 hover:bg-black text-white font-bold py-3 rounded-xl shadow-md transition-colors mt-2 text-sm" id="n-submit-btn">
                            <i class="fa-solid fa-check mr-1"></i> 등록 완료
                        </button>
                    </form>
                </div>
                ` : ''}

                <div id="notice-list" class="flex-1 overflow-y-auto space-y-3 pb-4 px-2">
                    <div class="animate-pulse space-y-3 p-2"><div class="h-20 bg-slate-200 rounded-2xl w-full"></div><div class="h-20 bg-slate-200 rounded-2xl w-full"></div><div class="h-20 bg-slate-200 rounded-2xl w-full"></div></div>
                </div>

                <!-- 상세 보기 모달 -->
                <div id="notice-detail-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4 opacity-0 transition-opacity">
                    <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transform scale-95 transition-transform flex flex-col max-h-[90vh]" id="notice-detail-modal-content">
                        <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2"><i class="fa-regular fa-bell text-primary"></i> <span id="detail-category-badge">안전 공지</span></h3>
                            <button id="btn-close-detail" class="text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200">
                                <i class="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        <div class="p-6 overflow-y-auto flex-1">
                            <h2 class="text-xl font-bold text-slate-800 mb-2" id="detail-title">제목</h2>
                            <p class="text-xs text-slate-400 mb-6" id="detail-date">2026-06-04</p>
                            <div class="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed mb-6" id="detail-body">내용</div>
                            
                            <div id="detail-attachment" class="hidden border-t border-slate-100 pt-4">
                                <h4 class="text-xs font-bold text-slate-500 mb-2">첨부자료</h4>
                                <a href="#" target="_blank" id="detail-link-btn" class="inline-flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                                    <i class="fa-solid fa-paperclip"></i> <span id="detail-link-text">첨부파일 확인하기</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        this.currentTab = 'notice';
        this.loadData();

        const tabNotice = document.getElementById('tab-notice');
        const tabEdu = document.getElementById('tab-edu');

        if (tabNotice && tabEdu) {
            tabNotice.addEventListener('click', () => {
                this.currentTab = 'notice';
                tabNotice.className = "flex-1 py-3 text-sm font-bold text-primary border-b-2 border-primary transition-all";
                tabEdu.className = "flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all";
                this.updateFormUI();
                this.loadData();
            });

            tabEdu.addEventListener('click', () => {
                this.currentTab = 'education';
                tabEdu.className = "flex-1 py-3 text-sm font-bold text-primary border-b-2 border-primary transition-all";
                tabNotice.className = "flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all";
                this.updateFormUI();
                this.loadData();
            });
        }
        
        // Admin Form Events
        const btnShowForm = document.getElementById('btn-show-form');
        const btnCloseForm = document.getElementById('btn-close-form');
        const formContainer = document.getElementById('register-form-container');
        const noticeForm = document.getElementById('notice-form');
        
        if (btnShowForm && formContainer) {
            btnShowForm.addEventListener('click', () => {
                document.getElementById('n-id').value = '';
                document.getElementById('n-submit-btn').innerHTML = '<i class="fa-solid fa-check mr-1"></i> 등록 완료';
                noticeForm.reset();
                formContainer.classList.remove('hidden');
                btnShowForm.classList.add('hidden');
            });
            
            btnCloseForm.addEventListener('click', () => {
                formContainer.classList.add('hidden');
                btnShowForm.classList.remove('hidden');
            });
            
            // 상세 모달 닫기
            const detailModal = document.getElementById('notice-detail-modal');
            const detailModalContent = document.getElementById('notice-detail-modal-content');
            const btnCloseDetail = document.getElementById('btn-close-detail');
            
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
            
            noticeForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('n-id').value;
                const title = document.getElementById('n-title').value;
                const content = document.getElementById('n-content').value;
                const link = document.getElementById('n-link') ? document.getElementById('n-link').value : null;
                const fileInput = document.getElementById('n-file');
                const hasFile = fileInput && fileInput.files.length > 0;
                
                if (!AppState.supabase) {
                    alert('[Mock] ' + (id ? '수정' : '등록') + '되었습니다.' + (hasFile ? '\\n(첨부파일: ' + fileInput.files[0].name + ')' : ''));
                    noticeForm.reset();
                    formContainer.classList.add('hidden');
                    btnShowForm.classList.remove('hidden');
                    this.loadData();
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
                    const res = await AppState.supabase.from('notices').update({
                        category: this.currentTab,
                        title: title,
                        content: content,
                        drive_link: this.currentTab === 'education' ? link : null,
                        ...(hasFile && { file_url: fileUrl })
                    }).eq('id', id);
                    error = res.error;
                } else {
                    const res = await AppState.supabase.from('notices').insert([{
                        category: this.currentTab,
                        title: title,
                        content: content,
                        drive_link: this.currentTab === 'education' ? link : null,
                        file_url: fileUrl
                    }]);
                    error = res.error;
                }
                
                showLoading(false);
                if (error) {
                    alert('등록 실패: ' + error.message);
                } else {
                    alert('성공적으로 등록되었습니다.');
                    noticeForm.reset();
                    formContainer.classList.add('hidden');
                    btnShowForm.classList.remove('hidden');
                    this.loadData();
                }
            });
        }
    },
    
    updateFormUI() {
        const titleEl = document.getElementById('form-title');
        const linkContainer = document.getElementById('drive-link-container');
        const linkInput = document.getElementById('n-link');
        
        if (!titleEl) return;
        
        if (this.currentTab === 'notice') {
            titleEl.textContent = '새 안전공지 등록';
            if(linkContainer) linkContainer.classList.add('hidden');
            if(linkInput) linkInput.removeAttribute('required');
        } else {
            titleEl.textContent = '새 교육자료 등록';
            if(linkContainer) linkContainer.classList.remove('hidden');
            if(linkInput) linkInput.setAttribute('required', 'true');
        }
    },

    async loadData() {
        const listEl = document.getElementById('notice-list');
        listEl.innerHTML = '<div class="animate-pulse space-y-3 p-2"><div class="h-20 bg-slate-200 rounded-2xl w-full"></div><div class="h-20 bg-slate-200 rounded-2xl w-full"></div><div class="h-20 bg-slate-200 rounded-2xl w-full"></div></div>';
        
        if (!AppState.supabase) {
            setTimeout(() => {
                if (this.currentTab === 'notice') {
                    listEl.innerHTML = `
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-3 cursor-pointer hover:bg-slate-50 btn-view-notice" data-type="notice" data-title="[Mock] 장마철 대비 수해 예방 지침" data-content="관할 구역 내 배수로 정비 및 펌프 사전 점검 요망..." data-date="2026-06-02">
                            <div class="w-10 h-10 shrink-0 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-lg">
                                <i class="fa-solid fa-thumbtack"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-sm text-slate-800 truncate mb-1">[Mock] 장마철 대비 수해 예방 지침</h4>
                                <p class="text-xs text-slate-500 truncate">관할 구역 내 배수로 정비 및 펌프 사전 점검 요망...</p>
                                <span class="text-[10px] text-slate-400 mt-2 block">2026-06-02</span>
                            </div>
                        </div>
                    `;
                } else {
                    listEl.innerHTML = `
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 btn-view-notice cursor-pointer hover:bg-slate-50" data-type="education" data-title="[Mock] 2분기 협력사 법정 안전보건교육 자료" data-content="구글 드라이브 대용량 공유 링크" data-link="https://drive.google.com/" data-date="2026-06-01">
                            <div class="flex items-start gap-3">
                                <div class="w-10 h-10 shrink-0 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-lg">
                                    <i class="fa-brands fa-google-drive"></i>
                                </div>
                                <div class="flex-1 min-w-0 mb-3">
                                    <h4 class="font-bold text-sm text-slate-800 truncate mb-1">[Mock] 2분기 협력사 법정 안전보건교육 자료 (PPT/PDF)</h4>
                                    <p class="text-[10px] text-slate-400">구글 드라이브 대용량 공유 링크</p>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }, 300);
            return;
        }

        const { data, error } = await AppState.supabase
            .from('notices')
            .select('*')
            .eq('category', this.currentTab)
            .order('created_at', { ascending: false });

        if (error || data.length === 0) {
            listEl.innerHTML = `
                <div class="text-center py-10 flex flex-col items-center">
                    <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 text-3xl mb-3">
                        <i class="fa-regular fa-folder-open"></i>
                    </div>
                    <p class="text-slate-500 text-sm">등록된 항목이 없습니다.</p>
                </div>
            `;
            return;
        }

        const isAdmin = AppState.profile && AppState.profile.role === 'admin';

        listEl.innerHTML = data.map(item => {
            const editControls = isAdmin ? `
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                    <button class="btn-edit-notice w-6 h-6 rounded bg-slate-100 text-slate-500 hover:text-primary hover:bg-blue-50 flex items-center justify-center transition-colors" data-id="${item.id}" data-title="${item.title.replace(/"/g, '&quot;')}" data-content="${(item.content || '').replace(/"/g, '&quot;')}" data-link="${(item.drive_link || '').replace(/"/g, '&quot;')}">
                        <i class="fa-solid fa-pen text-[10px]"></i>
                    </button>
                    <button class="btn-del-notice w-6 h-6 rounded bg-slate-100 text-slate-500 hover:text-brandRed hover:bg-red-50 flex items-center justify-center transition-colors" data-id="${item.id}">
                        <i class="fa-solid fa-trash text-[10px]"></i>
                    </button>
                </div>
            ` : '';

            if (this.currentTab === 'notice') {
                return `
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-3 cursor-pointer hover:bg-slate-50 relative group btn-view-notice" data-type="notice" data-title="${item.title.replace(/"/g, '&quot;')}" data-content="${(item.content || '').replace(/"/g, '&quot;')}" data-file="${(item.file_url || '').replace(/"/g, '&quot;')}" data-date="${item.created_at}">
                        ${editControls}
                        <div class="w-10 h-10 shrink-0 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center text-lg">
                            <i class="fa-regular fa-bell"></i>
                        </div>
                        <div class="flex-1 min-w-0 pr-10">
                            <h4 class="font-bold text-sm text-slate-800 truncate mb-1">${item.title}</h4>
                            <p class="text-xs text-slate-500 truncate">${item.content || ''}</p>
                            ${item.file_url ? `
                            <div class="mt-2 text-[10px] bg-slate-100 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit border border-slate-200">
                                <i class="fa-solid fa-paperclip"></i> 첨부파일 있음
                            </div>
                            ` : ''}
                            <span class="text-[10px] text-slate-400 mt-2 block">${new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative group">
                        ${editControls}
                        <div class="flex items-start gap-3">
                            <div class="w-10 h-10 shrink-0 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-lg">
                                <i class="fa-brands fa-google-drive"></i>
                            </div>
                            <div class="flex-1 min-w-0 mb-3 pr-10">
                                <h4 class="font-bold text-sm text-slate-800 truncate mb-1">${item.title}</h4>
                                <p class="text-[10px] text-slate-400">${item.content || '구글 드라이브 대용량 공유 링크'}</p>
                                ${item.file_url ? `
                                <a href="${item.file_url}" target="_blank" rel="noopener noreferrer" class="mt-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation();">
                                    <i class="fa-solid fa-paperclip"></i> 붙임파일 확인
                                </a>
                                ` : ''}
                            </div>
                        </div>
                        ${item.drive_link ? `
                        <button class="w-full bg-slate-50 hover:bg-slate-100 text-blue-600 text-xs font-bold py-2 rounded-xl transition-colors border border-slate-100" onclick="window.open('${item.drive_link}', '_blank')">
                            <i class="fa-solid fa-arrow-up-right-from-square mr-1"></i> 자료 열람하기
                        </button>
                        ` : ''}
                    </div>
                `;
            }
        }).join('');

        // 상세 보기 이벤트 위임
        listEl.querySelectorAll('.btn-view-notice').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                const title = btn.getAttribute('data-title');
                const content = btn.getAttribute('data-content');
                const date = btn.getAttribute('data-date');
                const fileUrl = btn.getAttribute('data-file');
                const driveLink = btn.getAttribute('data-link');
                
                const badgeEl = document.getElementById('detail-category-badge');
                if (badgeEl) {
                    if (type === 'notice') {
                        badgeEl.parentElement.innerHTML = '<i class="fa-regular fa-bell text-primary"></i> <span id="detail-category-badge">안전 공지</span>';
                    } else {
                        badgeEl.parentElement.innerHTML = '<i class="fa-brands fa-google-drive text-blue-600"></i> <span id="detail-category-badge">교육 자료실</span>';
                    }
                }
                
                document.getElementById('detail-title').textContent = title || '';
                document.getElementById('detail-date').textContent = date ? new Date(date).toLocaleString() : '';
                document.getElementById('detail-body').textContent = content || '';
                
                const attachContainer = document.getElementById('detail-attachment');
                const linkBtn = document.getElementById('detail-link-btn');
                
                if (driveLink) {
                    attachContainer.classList.remove('hidden');
                    linkBtn.href = driveLink;
                    linkBtn.className = 'inline-flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors';
                    linkBtn.innerHTML = '<i class="fa-brands fa-google-drive"></i> <span id="detail-link-text">자료 열람하기</span>';
                } else if (fileUrl) {
                    attachContainer.classList.remove('hidden');
                    linkBtn.href = fileUrl;
                    linkBtn.className = 'inline-flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors border border-slate-200';
                    linkBtn.innerHTML = '<i class="fa-solid fa-paperclip"></i> <span id="detail-link-text">첨부파일 열기</span>';
                } else {
                    attachContainer.classList.add('hidden');
                }
                
                const modal = document.getElementById('notice-detail-modal');
                const modalContent = document.getElementById('notice-detail-modal-content');
                
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    modalContent.classList.remove('scale-95');
                }, 10);
            });
        });

        // 수정/삭제 이벤트 위임
        if (isAdmin) {
            listEl.querySelectorAll('.btn-edit-notice').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const formContainer = document.getElementById('register-form-container');
                    const btnShowForm = document.getElementById('btn-show-form');
                    
                    document.getElementById('n-id').value = btn.dataset.id;
                    document.getElementById('n-title').value = btn.dataset.title;
                    document.getElementById('n-content').value = btn.dataset.content;
                    if(document.getElementById('n-link')) {
                        document.getElementById('n-link').value = btn.dataset.link;
                    }
                    
                    const titleEl = document.getElementById('form-title');
                    if(titleEl) titleEl.textContent = this.currentTab === 'notice' ? '공지 수정' : '교육자료 수정';
                    document.getElementById('n-submit-btn').innerHTML = '<i class="fa-solid fa-check mr-1"></i> 수정 완료';
                    
                    formContainer.classList.remove('hidden');
                    if(btnShowForm) btnShowForm.classList.add('hidden');
                });
            });

            listEl.querySelectorAll('.btn-del-notice').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm('정말 삭제하시겠습니까?')) {
                        if (!AppState.supabase) {
                            alert('[Mock] 삭제되었습니다.');
                            return;
                        }
                        showLoading(true);
                        const { error } = await AppState.supabase.from('notices').delete().eq('id', btn.dataset.id);
                        showLoading(false);
                        if (error) alert('삭제 실패: ' + error.message);
                        else this.loadData();
                    }
                });
            });
        }
    }
};
