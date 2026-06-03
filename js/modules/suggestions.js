window.Modules['suggestions'] = {
    title: '건의사항 & 질문하기',
    
    render() {
        return `
            <div class="space-y-6 fade-in h-full flex flex-col">
                <!-- 상단 액션 바 -->
                <div class="flex justify-between items-end mb-2">
                    <div>
                        <h2 class="text-lg font-bold text-slate-800">현장 소통 게시판</h2>
                        <p class="text-xs text-slate-500">위험 요소 신고 및 건의사항</p>
                    </div>
                    <button id="btn-new-suggestion" class="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-blue-800 transition-colors">
                        <i class="fa-solid fa-pen mr-1"></i> 글쓰기
                    </button>
                </div>

                <!-- 리스트 영역 -->
                <div id="suggestions-list" class="flex-1 overflow-y-auto space-y-3 pb-4">
                    <div class="animate-pulse space-y-3 p-2"><div class="h-20 bg-slate-200 rounded-2xl w-full"></div><div class="h-20 bg-slate-200 rounded-2xl w-full"></div></div>
                </div>
            </div>

            <!-- 글쓰기 모달 -->
            <div id="modal-suggestion" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 hidden flex flex-col justify-end md:justify-center items-center">
                <div class="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-2xl shadow-2xl p-5 slide-in-top">
                    <div class="flex justify-between items-center mb-4 border-b pb-3">
                        <h3 class="font-bold text-lg text-slate-800" id="sug-modal-title">새 게시글 작성</h3>
                        <button id="btn-close-modal" class="text-slate-400 hover:text-slate-700 text-xl"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <form id="form-suggestion" class="space-y-4">
                        <input type="hidden" id="sug-id" value="">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">제목</label>
                            <input type="text" id="sug-title" required class="w-full border border-slate-300 rounded-xl p-3 focus:ring-primary focus:border-primary text-sm" placeholder="제목을 입력하세요">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">내용</label>
                            <textarea id="sug-content" required rows="4" class="w-full border border-slate-300 rounded-xl p-3 focus:ring-primary focus:border-primary text-sm" placeholder="현장의 위험요소나 건의사항을 자세히 적어주세요"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">붙임 (사진/파일)</label>
                            <input type="file" id="sug-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1">
                        </div>
                        <button type="submit" class="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-md mt-2" id="sug-submit-btn">
                            등록하기
                        </button>
                    </form>
                </div>
            </div>
        `;
    },

    init() {
        this.loadSuggestions();

        const btnNew = document.getElementById('btn-new-suggestion');
        const modal = document.getElementById('modal-suggestion');
        const btnClose = document.getElementById('btn-close-modal');
        const form = document.getElementById('form-suggestion');

        if (btnNew && modal) {
            btnNew.addEventListener('click', () => {
                document.getElementById('sug-id').value = '';
                document.getElementById('sug-modal-title').textContent = '새 게시글 작성';
                document.getElementById('sug-submit-btn').textContent = '등록하기';
                form.reset();
                modal.classList.remove('hidden');
            });
            btnClose.addEventListener('click', () => modal.classList.add('hidden'));
            modal.addEventListener('click', (e) => {
                if(e.target === modal) modal.classList.add('hidden');
            });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('sug-id').value;
                const title = document.getElementById('sug-title').value;
                const content = document.getElementById('sug-content').value;
                const fileInput = document.getElementById('sug-file');
                const hasFile = fileInput && fileInput.files.length > 0;

                if (!AppState.supabase) {
                    alert('[Mock] 게시글이 ' + (id ? '수정' : '등록') + '되었습니다.' + (hasFile ? '\\n(첨부파일: ' + fileInput.files[0].name + ')' : ''));
                    modal.classList.add('hidden');
                    form.reset();
                    return;
                }

                showLoading(true);
                let fileUrl = null;
                if (hasFile) {
                    fileUrl = 'mock_attachment_' + Date.now() + '.jpg';
                }

                let error;
                if (id) {
                    // Update
                    const res = await AppState.supabase
                        .from('suggestions')
                        .update({ 
                            title: title, 
                            content: content,
                            ...(hasFile && { file_url: fileUrl })
                        })
                        .eq('id', id);
                    error = res.error;
                } else {
                    // Insert
                    const res = await AppState.supabase
                        .from('suggestions')
                        .insert([{
                            title: title,
                            content: content,
                            file_url: fileUrl,
                            author_id: AppState.user.id
                        }]);
                    error = res.error;
                }
                
                showLoading(false);
                if (error) {
                    alert('처리 실패: ' + error.message);
                } else {
                    modal.classList.add('hidden');
                    form.reset();
                    this.loadSuggestions();
                }
            });
        }
    },

    async loadSuggestions() {
        const listEl = document.getElementById('suggestions-list');
        
        if (!AppState.supabase) {
            listEl.innerHTML = `
                <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <div class="flex justify-between items-start mb-2">
                        <span class="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded">답변대기</span>
                        <span class="text-[10px] text-slate-400">방금 전</span>
                    </div>
                    <h4 class="font-bold text-sm text-slate-800 mb-1">[Mock] 작업장 조명 추가 설치 건의</h4>
                    <p class="text-xs text-slate-500 line-clamp-2">A구역 지하 작업장 조명이 너무 어두워 발빠짐 사고 위험이 있습니다.</p>
                    <button class="mt-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation(); alert('첨부파일 다운로드 (Mock)')">
                        <i class="fa-solid fa-paperclip"></i> 현장사진.jpg
                    </button>
                    <div class="mt-3 flex justify-between items-center text-xs text-slate-400 border-t pt-2 border-slate-50">
                        <span>홍길동 (테스트협력사)</span>
                        <span><i class="fa-regular fa-comment-dots"></i> 0</span>
                    </div>
                </div>
            `;
            return;
        }

        const { data, error } = await AppState.supabase
            .from('suggestions')
            .select('*, users(full_name, company_name)')
            .order('created_at', { ascending: false });

        if (error) {
            listEl.innerHTML = '<p class="text-center text-red-500 py-4">데이터를 불러오지 못했습니다.</p>';
            return;
        }

        if (data.length === 0) {
            listEl.innerHTML = `
                <div class="text-center py-10 flex flex-col items-center">
                    <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 text-3xl mb-3">
                        <i class="fa-regular fa-folder-open"></i>
                    </div>
                    <p class="text-slate-500 text-sm">등록된 게시글이 없습니다.</p>
                </div>
            `;
            return;
        }

        const statusMap = {
            'pending': { label: '접수완료', color: 'bg-yellow-100 text-yellow-700' },
            'in_progress': { label: '검토중', color: 'bg-blue-100 text-blue-700' },
            'resolved': { label: '조치완료', color: 'bg-green-100 text-green-700' }
        };

        listEl.innerHTML = data.map(item => {
            const st = statusMap[item.status] || statusMap['pending'];
            const date = new Date(item.created_at).toLocaleDateString();
            const author = item.users ? `${item.users.full_name} (${item.users.company_name})` : '알 수 없음';
            
            const isAuthor = AppState.user && item.author_id === AppState.user.id;
            const isAdmin = AppState.profile && AppState.profile.role === 'admin';
            const canEdit = isAuthor || isAdmin;

            return `
                <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group">
                    <div class="flex justify-between items-start mb-2">
                        <span class="${st.color} text-[10px] font-bold px-2 py-1 rounded">${st.label}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] text-slate-400">${date}</span>
                            ${canEdit ? `
                            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button class="btn-edit-sug w-6 h-6 rounded bg-slate-50 text-slate-400 hover:text-primary hover:bg-blue-50 flex items-center justify-center transition-colors" data-id="${item.id}" data-title="${item.title.replace(/"/g, '&quot;')}" data-content="${item.content.replace(/"/g, '&quot;')}">
                                    <i class="fa-solid fa-pen text-[10px]"></i>
                                </button>
                                <button class="btn-del-sug w-6 h-6 rounded bg-slate-50 text-slate-400 hover:text-brandRed hover:bg-red-50 flex items-center justify-center transition-colors" data-id="${item.id}">
                                    <i class="fa-solid fa-trash text-[10px]"></i>
                                </button>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="cursor-pointer" onclick="alert('게시글 상세 보기 및 댓글 기능은 기능 확장 가이드에 따라 추가 구현이 가능합니다.')">
                        <h4 class="font-bold text-sm text-slate-800 mb-1">${item.title}</h4>
                        <p class="text-xs text-slate-500 line-clamp-2">${item.content}</p>
                        ${item.file_url ? `
                        <button class="mt-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation(); alert('첨부파일 다운로드 기능은 파일 스토리지가 연결되어야 작동합니다.')">
                            <i class="fa-solid fa-paperclip"></i> 첨부자료 확인
                        </button>
                        ` : ''}
                        <div class="mt-3 flex justify-between items-center text-xs text-slate-400 border-t pt-2 border-slate-50">
                            <span class="truncate pr-2"><i class="fa-regular fa-user mr-1"></i> ${author}</span>
                            <span class="shrink-0 text-primary">자세히 보기 <i class="fa-solid fa-angle-right ml-1"></i></span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // 이벤트 위임
        listEl.querySelectorAll('.btn-edit-sug').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const title = btn.dataset.title;
                const content = btn.dataset.content;
                
                document.getElementById('sug-id').value = id;
                document.getElementById('sug-title').value = title;
                document.getElementById('sug-content').value = content;
                document.getElementById('sug-modal-title').textContent = '게시글 수정';
                document.getElementById('sug-submit-btn').textContent = '수정하기';
                document.getElementById('modal-suggestion').classList.remove('hidden');
            });
        });

        listEl.querySelectorAll('.btn-del-sug').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
                    if (!AppState.supabase) {
                        alert('[Mock] 삭제되었습니다.');
                        return;
                    }
                    showLoading(true);
                    const { error } = await AppState.supabase.from('suggestions').delete().eq('id', btn.dataset.id);
                    showLoading(false);
                    if (error) alert('삭제 실패: ' + error.message);
                    else this.loadSuggestions();
                }
            });
        });
    }
};
