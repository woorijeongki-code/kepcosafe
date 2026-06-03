window.Modules['feedback'] = {
    title: '피드백 제출',
    
    render() {
        const isAdmin = AppState.profile && AppState.profile.role === 'admin';
        
        let html = `
            <div class="space-y-6 fade-in h-full flex flex-col">
                <!-- 탭 메뉴 -->
                <div class="flex border-b border-slate-200 mb-2">
                    <button class="flex-1 py-3 text-sm font-bold text-primary border-b-2 border-primary" id="tab-meeting">무정전회의록 피드백</button>
                    <button class="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors" id="tab-edu">교육자료 피드백</button>
                </div>
                
                <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                    <p class="text-sm text-blue-800" id="feedback-desc">무정전 공법 관련 회의록을 확인하고, 현장 의견이나 보완 사항을 제출해 주세요.</p>
                </div>
        `;

        if (!isAdmin) {
            html += `
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h4 class="font-bold text-slate-800 mb-4" id="form-title">의견 제출하기</h4>
                    <form id="feedback-form" class="space-y-4">
                        <input type="hidden" id="fb-id" value="">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">제목</label>
                            <input type="text" id="fb-title" required class="block w-full p-3 border border-slate-300 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="예: 6월 안전교육 이수 및 건의사항">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">상세 내용</label>
                            <textarea id="fb-content" rows="4" required class="block w-full p-3 border border-slate-300 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="의견을 자유롭게 적어주세요."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">붙임 (첨부파일)</label>
                            <input type="file" id="fb-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1">
                        </div>
                        <div class="flex gap-2">
                            <button type="submit" class="flex-1 bg-primary hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-md transition-colors" id="fb-submit-btn">
                                <i class="fa-solid fa-paper-plane mr-1"></i> 제출하기
                            </button>
                            <button type="button" id="btn-fb-cancel-edit" class="hidden flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl shadow-sm transition-colors">
                                취소
                            </button>
                        </div>
                    </form>
                </div>
            `;
        } else {
            html += `
                <div class="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-amber-700 text-sm font-bold text-center">
                    관리자는 피드백을 조회만 할 수 있습니다.
                </div>
            `;
        }

        html += `
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-1">
                    <h4 class="font-bold text-slate-800 mb-4" id="list-title">제출된 의견 내역</h4>
                    <div id="feedback-list" class="space-y-3 pb-4">
                        <div class="animate-pulse space-y-3 p-2"><div class="h-20 bg-slate-200 rounded-2xl w-full"></div><div class="h-20 bg-slate-200 rounded-2xl w-full"></div></div>
                    </div>
                </div>
            </div>
        `;
        
        return html;
    },

    init() {
        this.currentTab = 'meeting'; // 'meeting' or 'edu'
        this.loadFeedback();

        const form = document.getElementById('feedback-form');
        const btnCancelEdit = document.getElementById('btn-fb-cancel-edit');
        
        if (btnCancelEdit) {
            btnCancelEdit.addEventListener('click', () => {
                document.getElementById('fb-id').value = '';
                document.getElementById('fb-submit-btn').innerHTML = '<i class="fa-solid fa-paper-plane mr-1"></i> 제출하기';
                form.reset();
                btnCancelEdit.classList.add('hidden');
            });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('fb-id').value;
                const title = document.getElementById('fb-title').value;
                const content = document.getElementById('fb-content').value;
                const fileInput = document.getElementById('fb-file');
                const hasFile = fileInput && fileInput.files.length > 0;
                
                if (!title.trim() || !content.trim()) return;

                if (!AppState.supabase) {
                    alert('[Mock] 피드백이 ' + (id ? '수정' : '제출') + '되었습니다.' + (hasFile ? '\\n(첨부파일: ' + fileInput.files[0].name + ')' : ''));
                    form.reset();
                    if(btnCancelEdit) btnCancelEdit.classList.add('hidden');
                    document.getElementById('fb-submit-btn').innerHTML = '<i class="fa-solid fa-paper-plane mr-1"></i> 제출하기';
                    this.loadFeedback();
                    return;
                }

                showLoading(true);
                let fileUrl = null;
                if (hasFile) {
                    fileUrl = 'mock_attachment_' + Date.now() + '.pdf';
                }

                let error;
                if (id) {
                    const res = await AppState.supabase.from('feedback').update({
                        category: this.currentTab,
                        title: title,
                        content: content,
                        ...(hasFile && { file_url: fileUrl })
                    }).eq('id', id);
                    error = res.error;
                } else {
                    const res = await AppState.supabase.from('feedback').insert([{
                        category: this.currentTab,
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
                    alert(id ? '수정되었습니다.' : '성공적으로 제출되었습니다.');
                    form.reset();
                    document.getElementById('fb-id').value = '';
                    if(btnCancelEdit) btnCancelEdit.classList.add('hidden');
                    document.getElementById('fb-submit-btn').innerHTML = '<i class="fa-solid fa-paper-plane mr-1"></i> 제출하기';
                    this.loadFeedback();
                }
            });
        }

        // Tab events
        const tabMeeting = document.getElementById('tab-meeting');
        const tabEdu = document.getElementById('tab-edu');
        const descEl = document.getElementById('feedback-desc');

        if (tabMeeting && tabEdu) {
            tabMeeting.addEventListener('click', () => {
                this.currentTab = 'meeting';
                tabMeeting.className = "flex-1 py-3 text-sm font-bold text-primary border-b-2 border-primary transition-all";
                tabEdu.className = "flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all";
                if(descEl) descEl.textContent = "무정전 공법 관련 회의록을 확인하고, 현장 의견이나 보완 사항을 제출해 주세요.";
                this.loadFeedback();
            });

            tabEdu.addEventListener('click', () => {
                this.currentTab = 'edu';
                tabEdu.className = "flex-1 py-3 text-sm font-bold text-primary border-b-2 border-primary transition-all";
                tabMeeting.className = "flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all";
                if(descEl) descEl.textContent = "안전 교육자료를 열람하신 후 이수 확인 및 교육에 대한 피드백을 남겨 주세요.";
                this.loadFeedback();
            });
        }
    },

    async loadFeedback() {
        const listEl = document.getElementById('feedback-list');
        listEl.innerHTML = '<div class="animate-pulse space-y-3 p-2"><div class="h-20 bg-slate-200 rounded-2xl w-full"></div><div class="h-20 bg-slate-200 rounded-2xl w-full"></div></div>';
        
        if (!AppState.supabase) {
            setTimeout(() => {
                listEl.innerHTML = `
                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-4">
                        <div class="w-10 h-10 shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-bold">
                            대
                        </div>
                        <div class="flex-1">
                            <h5 class="font-bold text-sm text-slate-800 mb-1">[Mock] ${this.currentTab === 'meeting' ? '무정전 작업 시 안전고리 체결 건의' : '6월 정기 안전교육 이수 완료 및 건의'}</h5>
                            <p class="text-xs text-slate-600 leading-relaxed mb-2">현장 의견입니다. 잘 부탁드립니다.</p>
                            <button class="mb-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation(); alert('첨부파일 다운로드 (Mock)')">
                                <i class="fa-solid fa-paperclip"></i> 증빙자료.pdf
                            </button>
                            <p class="text-[10px] text-slate-400">대덕전기(주) · 2026-06-02</p>
                        </div>
                    </div>
                `;
            }, 300);
            return;
        }

        const isAdmin = AppState.profile && AppState.profile.role === 'admin';
        
        let query = AppState.supabase
            .from('feedback')
            .select('*, users(company_name, full_name)')
            .eq('category', this.currentTab)
            .order('created_at', { ascending: false });

        // 협력사는 본인이 쓴 글만 볼 수 있음
        if (!isAdmin) {
            query = query.eq('author_id', AppState.user.id);
        }

        const { data, error } = await query;

        if (error) {
            listEl.innerHTML = `<p class="text-center text-sm text-red-500 py-4">목록 로드 실패</p>`;
            return;
        }

        if (data.length === 0) {
            listEl.innerHTML = `<p class="text-center text-sm text-slate-500 py-8">제출된 의견이 없습니다.</p>`;
            return;
        }

        listEl.innerHTML = data.map(item => {
            const companyName = item.users?.company_name || '협력회사';
            const firstLetter = companyName.charAt(0);
            
            const isAuthor = AppState.user && item.author_id === AppState.user.id;
            
            const editControls = (isAuthor || isAdmin) ? `
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                    ${isAuthor ? `
                    <button class="btn-edit-fb w-6 h-6 rounded bg-slate-200 text-slate-500 hover:text-primary hover:bg-blue-100 flex items-center justify-center transition-colors" data-id="${item.id}" data-title="${item.title.replace(/"/g, '&quot;')}" data-content="${item.content.replace(/"/g, '&quot;')}">
                        <i class="fa-solid fa-pen text-[10px]"></i>
                    </button>
                    ` : ''}
                    <button class="btn-del-fb w-6 h-6 rounded bg-slate-200 text-slate-500 hover:text-brandRed hover:bg-red-100 flex items-center justify-center transition-colors" data-id="${item.id}">
                        <i class="fa-solid fa-trash text-[10px]"></i>
                    </button>
                </div>
            ` : '';

            return `
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-4 hover:bg-slate-100 transition-colors relative group">
                    ${editControls}
                    <div class="w-10 h-10 shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-bold">
                        ${firstLetter}
                    </div>
                    <div class="flex-1 pr-12">
                        <h5 class="font-bold text-sm text-slate-800 mb-1">${item.title}</h5>
                        <p class="text-xs text-slate-600 leading-relaxed mb-2">${item.content}</p>
                        ${item.file_url ? `
                        <button class="mb-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation(); alert('첨부파일 다운로드 기능은 파일 스토리지가 연결되어야 작동합니다.')">
                            <i class="fa-solid fa-paperclip"></i> 첨부자료 확인
                        </button>
                        ` : ''}
                        <p class="text-[10px] text-slate-400">${companyName} · ${new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            `;
        }).join('');

        // 이벤트 위임
        listEl.querySelectorAll('.btn-edit-fb').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('fb-id').value = btn.dataset.id;
                document.getElementById('fb-title').value = btn.dataset.title;
                document.getElementById('fb-content').value = btn.dataset.content;
                document.getElementById('fb-submit-btn').innerHTML = '<i class="fa-solid fa-check mr-1"></i> 수정 완료';
                document.getElementById('btn-fb-cancel-edit').classList.remove('hidden');
                document.getElementById('form-title').scrollIntoView({ behavior: 'smooth' });
            });
        });

        listEl.querySelectorAll('.btn-del-fb').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm('정말 삭제하시겠습니까?')) {
                    if (!AppState.supabase) {
                        alert('[Mock] 삭제되었습니다.');
                        return;
                    }
                    showLoading(true);
                    const { error } = await AppState.supabase.from('feedback').delete().eq('id', btn.dataset.id);
                    showLoading(false);
                    if (error) alert('삭제 실패: ' + error.message);
                    else this.loadFeedback();
                }
            });
        });
    }
};
