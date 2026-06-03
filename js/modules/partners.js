window.Modules['partners'] = {
    title: '협력사 관리',
    
    render() {
        return `
            <div class="space-y-6 fade-in h-full flex flex-col pb-10">
                <!-- 상단 요약 -->
                <div class="grid grid-cols-2 gap-4 mb-2">
                    <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                        <div class="absolute right-0 bottom-0 text-6xl opacity-10 transform translate-x-4 translate-y-4">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <p class="text-blue-100 text-xs font-medium mb-1">등록된 총 협력사</p>
                        <h3 class="text-3xl font-black" id="total-partners-count">- <span class="text-sm font-medium">개사</span></h3>
                    </div>
                    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-center items-center cursor-pointer hover:bg-slate-50 transition-colors" id="btn-open-add-modal">
                        <div class="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl mb-2">
                            <i class="fa-solid fa-plus"></i>
                        </div>
                        <h4 class="font-bold text-slate-800 text-sm">새 협력사 발급</h4>
                    </div>
                </div>

                <!-- 협력사 리스트 -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
                    <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h4 class="font-bold text-slate-800"><i class="fa-solid fa-list-ul mr-2 text-slate-400"></i>협력회사 목록</h4>
                        <div class="relative">
                            <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input type="text" id="search-partner" class="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs w-32 focus:w-48 transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="회사명 검색">
                        </div>
                    </div>
                    
                    <div id="partners-list" class="flex-1 overflow-y-auto p-4 space-y-3">
                        <div class="animate-pulse space-y-3"><div class="h-16 bg-slate-100 rounded-xl w-full"></div><div class="h-16 bg-slate-100 rounded-xl w-full"></div></div>
                    </div>
                </div>

                <!-- 계정 발급 모달 (기본 숨김) -->
                <div id="add-partner-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4 opacity-0 transition-opacity">
                    <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform scale-95 transition-transform" id="add-partner-modal-content">
                        <div class="bg-primary p-6 text-white text-center relative">
                            <button id="btn-close-modal" class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                                <i class="fa-solid fa-xmark text-xl"></i>
                            </button>
                            <div class="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center text-3xl mb-3 shadow-inner">
                                <i class="fa-solid fa-user-plus"></i>
                            </div>
                            <h2 class="text-xl font-bold">새 협력사 계정 발급</h2>
                            <p class="text-xs text-blue-200 mt-1">입력하신 정보로 즉시 로그인이 가능합니다.</p>
                        </div>
                        
                        <form id="add-partner-form" class="p-6 space-y-5">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1.5">회사명 (또는 총가공사 이름)</label>
                                <input type="text" id="p-company" required class="block w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-sm transition-all" placeholder="예: (주)대덕건설">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1.5">현장책임자 (이름)</label>
                                <input type="text" id="p-fullname" class="block w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-sm transition-all" placeholder="예: 김소장">
                            </div>
                            <div id="p-email-container">
                                <label class="block text-sm font-bold text-slate-700 mb-1.5">로그인 이메일 (등록 시만 필요)</label>
                                <input type="email" id="p-email" class="block w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-sm transition-all" placeholder="예: partner1@kepco.com">
                            </div>
                            <div id="p-password-container">
                                <label class="block text-sm font-bold text-slate-700 mb-1.5">초기 비밀번호 (등록 시만 필요)</label>
                                <input type="text" id="p-password" minlength="6" class="block w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-sm transition-all" placeholder="6자리 이상 비밀번호 입력">
                            </div>
                            
                            <button type="submit" class="w-full bg-primary hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all mt-4 text-sm flex items-center justify-center gap-2" id="p-submit-btn">
                                <i class="fa-solid fa-check"></i> 계정 생성 및 승인
                            </button>
                            <input type="hidden" id="p-id" value="">
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        this.allPartners = [];
        this.loadPartners();
        this.setupModal();
        
        // 검색 기능
        const searchInput = document.getElementById('search-partner');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.trim().toLowerCase();
                this.renderList(term);
            });
        }
    },

    setupModal() {
        const modal = document.getElementById('add-partner-modal');
        const modalContent = document.getElementById('add-partner-modal-content');
        const btnOpen = document.getElementById('btn-open-add-modal');
        const btnClose = document.getElementById('btn-close-modal');
        const form = document.getElementById('add-partner-form');

        const openModal = (isEdit = false) => {
            if (!isEdit) {
                document.getElementById('p-id').value = '';
                document.getElementById('p-email-container').classList.remove('hidden');
                document.getElementById('p-password-container').classList.remove('hidden');
                document.getElementById('p-email').setAttribute('required', 'true');
                document.getElementById('p-password').setAttribute('required', 'true');
                document.getElementById('p-submit-btn').innerHTML = '<i class="fa-solid fa-check"></i> 계정 생성 및 승인';
            }
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modalContent.classList.remove('scale-95');
            }, 10);
        };

        const closeModal = () => {
            modal.classList.add('opacity-0');
            modalContent.classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                form.reset();
            }, 300); // Wait for transition
        };

        if (btnOpen) btnOpen.addEventListener('click', () => openModal(false));
        if (btnClose) btnClose.addEventListener('click', closeModal);
        
        // 외부 클릭 시 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('p-id').value;
                const company = document.getElementById('p-company').value.trim();
                const fullName = document.getElementById('p-fullname').value.trim() || '현장소장';
                const email = document.getElementById('p-email').value.trim();
                const password = document.getElementById('p-password').value;

                if (!AppState.supabase) {
                    if (id) {
                        const idx = this.allPartners.findIndex(p => p.id === id);
                        if(idx !== -1) {
                            this.allPartners[idx].company_name = company;
                            this.allPartners[idx].full_name = fullName;
                        }
                        alert(`[Mock] '${company}' 계정이 수정되었습니다.`);
                    } else {
                        alert(`[Mock] '${company}' 계정이 발급되었습니다.\n(이메일: ${email})`);
                        this.allPartners.unshift({
                            id: Date.now().toString(),
                            company_name: company,
                            full_name: fullName,
                            created_at: new Date().toISOString()
                        });
                    }
                    this.renderList();
                    closeModal();
                    return;
                }

                // 실제 DB 환경 (보조 클라이언트를 이용한 세션 유지 트릭)
                showLoading(true);
                
                try {
                    if (id) {
                        // 수정 로직
                        const { error: updateError } = await AppState.supabase.from('users').update({
                            company_name: company,
                            full_name: fullName
                        }).eq('id', id);

                        if (updateError) throw updateError;
                        alert(`${company} 협력사 정보가 수정되었습니다.`);
                    } else {
                        // 생성 로직
                        const tempClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
                            auth: { persistSession: false, autoRefreshToken: false }
                        });

                        const { data: authData, error: authError } = await tempClient.auth.signUp({
                            email: email,
                            password: password,
                        });

                        if (authError) throw authError;

                        const newUserId = authData.user.id;

                        const { error: dbError } = await AppState.supabase.from('users').insert([{
                            id: newUserId,
                            company_name: company,
                            full_name: fullName,
                            role: 'user'
                        }]);

                        if (dbError) throw dbError;
                        alert(`${company} 협력사 계정 발급이 완료되었습니다.`);
                    }
                    
                    closeModal();
                    this.loadPartners();

                } catch (err) {
                    console.error("계정 발급 오류:", err);
                    alert("계정 생성 중 오류가 발생했습니다: " + err.message);
                } finally {
                    showLoading(false);
                }
            });
        }
    },

    async loadPartners() {
        const listEl = document.getElementById('partners-list');
        const countEl = document.getElementById('total-partners-count');
        
        listEl.innerHTML = '<div class="animate-pulse space-y-3"><div class="h-16 bg-slate-100 rounded-xl w-full"></div><div class="h-16 bg-slate-100 rounded-xl w-full"></div></div>';

        if (!AppState.supabase) {
            // Mock Data
            setTimeout(() => {
                if (!this.allPartners) this.allPartners = [];
                this.renderList();
            }, 300);
            return;
        }

        const { data, error } = await AppState.supabase
            .from('users')
            .select('id, company_name, full_name, created_at, role')
            .eq('role', 'user')
            .order('created_at', { ascending: false });

        if (error) {
            listEl.innerHTML = `<p class="text-center text-sm text-red-500 py-8">목록 로드 실패</p>`;
            if (countEl) countEl.innerHTML = '0 <span class="text-sm font-medium">개사</span>';
            return;
        }

        // 이벤트 위임 설정 (수정 및 삭제)
        listEl.addEventListener('click', async (e) => {
            const btnDelete = e.target.closest('.btn-delete-partner');
            const btnEdit = e.target.closest('.btn-edit-partner');
            
            if (btnDelete) {
                const id = btnDelete.dataset.id;
                const companyName = btnDelete.dataset.name;
                if (confirm(`정말 '${companyName}' 협력사 계정을 삭제하시겠습니까?\n(주의: 글쓰기 내역 등 모든 기록이 삭제될 수 있습니다)`)) {
                    await this.deletePartner(id);
                }
            } else if (btnEdit) {
                const id = btnEdit.dataset.id;
                const companyName = btnEdit.dataset.name;
                const fullName = btnEdit.dataset.full;
                
                document.getElementById('p-id').value = id;
                document.getElementById('p-company').value = companyName;
                document.getElementById('p-fullname').value = fullName;
                
                // 수정 시 이메일/비번 숨김 처리
                document.getElementById('p-email-container').classList.add('hidden');
                document.getElementById('p-password-container').classList.add('hidden');
                document.getElementById('p-email').removeAttribute('required');
                document.getElementById('p-password').removeAttribute('required');
                
                document.getElementById('p-submit-btn').innerHTML = '<i class="fa-solid fa-check"></i> 정보 수정하기';
                
                // openModal() 수동 호출과 동일한 애니메이션
                const modal = document.getElementById('add-partner-modal');
                const modalContent = document.getElementById('add-partner-modal-content');
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    modalContent.classList.remove('scale-95');
                }, 10);
            }
        });

        this.allPartners = data || [];
        this.renderList();
    },
    
    async deletePartner(id) {
        if (!AppState.supabase) {
            // Mock Data 삭제
            this.allPartners = this.allPartners.filter(p => p.id !== id);
            this.renderList();
            alert('[Mock] 삭제되었습니다.');
            return;
        }

        // 실제 환경에서는 users 테이블에서 레코드를 지움 (소프트 삭제 또는 프로필 삭제 효과)
        showLoading(true);
        const { error } = await AppState.supabase
            .from('users')
            .delete()
            .eq('id', id);
            
        showLoading(false);
        
        if (error) {
            alert('삭제 실패: ' + error.message);
        } else {
            alert('협력사가 삭제되었습니다.');
            this.loadPartners();
        }
    },

    renderList(searchTerm = '') {
        const listEl = document.getElementById('partners-list');
        const countEl = document.getElementById('total-partners-count');
        
        let filtered = this.allPartners;
        if (searchTerm) {
            filtered = this.allPartners.filter(p => p.company_name.toLowerCase().includes(searchTerm));
        }

        if (countEl) {
            countEl.innerHTML = `${this.allPartners.length} <span class="text-sm font-medium">개사</span>`;
        }

        if (filtered.length === 0) {
            listEl.innerHTML = `
                <div class="text-center py-10">
                    <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-3xl mx-auto mb-3">
                        <i class="fa-solid fa-users-slash"></i>
                    </div>
                    <p class="text-slate-500 text-sm">등록된 협력사가 없습니다.</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = filtered.map(item => {
            const firstLetter = item.company_name ? item.company_name.charAt(0) : '?';
            const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString() : '날짜 없음';
            
            return `
                <div class="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow group">
                    <div class="w-12 h-12 shrink-0 bg-gradient-to-tr from-blue-100 to-indigo-50 text-primary rounded-xl flex items-center justify-center text-xl font-black shadow-sm">
                        ${firstLetter}
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-slate-800 text-sm truncate">${item.company_name}</h4>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-medium">현장 책임자: ${item.full_name || '미등록'}</span>
                            <span class="text-[10px] text-slate-400">등록일: ${dateStr}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="btn-edit-partner text-slate-300 hover:text-primary transition-colors w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center" data-id="${item.id}" data-name="${item.company_name}" data-full="${item.full_name || ''}" title="수정하기">
                            <i class="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button class="btn-delete-partner text-slate-300 hover:text-brandRed transition-colors w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center" data-id="${item.id}" data-name="${item.company_name}" title="삭제하기">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
};
