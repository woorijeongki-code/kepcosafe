window.Modules['notices'] = {
    title: 'Í≥µÏ? Î∞?ÍµêÏú°?êÎ£å',
    
    render() {
        const isAdmin = AppState.profile && AppState.profile.role === 'admin';
        return `
            <div class="space-y-6 fade-in h-full flex flex-col relative">
                <div class="flex border-b border-slate-200 mb-2">
                    <button class="flex-1 py-3 text-sm font-bold text-primary border-b-2 border-primary" id="tab-notice">?àÏ†ÑÍ≥µÏ?</button>
                    <button class="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors" id="tab-edu">ÍµêÏú°?êÎ£å??/button>
                </div>
                
                ${isAdmin ? `
                <div class="px-2 mb-2 flex justify-end">
                    <button id="btn-show-form" class="bg-primary hover:bg-blue-800 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1">
                        <i class="fa-solid fa-pen"></i> ?±Î°ù?òÍ∏∞
                    </button>
                </div>
                
                <!-- ?±Î°ù ??(Í∏∞Î≥∏ ?®Í?) -->
                <div id="register-form-container" class="hidden bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-4 fade-in relative">
                    <button id="btn-close-form" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                        <i class="fa-solid fa-xmark text-lg"></i>
                    </button>
                    <h4 class="font-bold text-slate-800 mb-4" id="form-title">???àÏ†ÑÍ≥µÏ? ?±Î°ù</h4>
                    <form id="notice-form" class="space-y-3">
                        <input type="hidden" id="n-id" value="">
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">?úÎ™©</label>
                            <input type="text" id="n-title" required class="block w-full p-2.5 border border-slate-300 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="?úÎ™©???ÖÎ†•?òÏÑ∏??>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1">?¥Ïö© (?êÎäî ?§Î™Ö)</label>
                            <textarea id="n-content" rows="3" required class="block w-full p-2.5 border border-slate-300 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="?¥Ïö©???ÖÎ†•?òÏÑ∏??></textarea>
                        </div>
                        <div id="drive-link-container" class="hidden">
                            <label class="block text-xs font-medium text-slate-700 mb-1">Íµ¨Í? ?úÎùº?¥Î∏å ÎßÅÌÅ¨ (ÍµêÏú°?êÎ£å ?ÑÏö©)</label>
                            <input type="url" id="n-link" class="block w-full p-2.5 border border-slate-300 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="https://drive.google.com/...">
                        </div>
                        <div id="notice-file-container">
                            <label class="block text-xs font-medium text-slate-700 mb-1">Î∂ôÏûÑ (Ï≤®Î??åÏùº)</label>
                            <input type="file" id="n-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1">
                        </div>
                        <button type="submit" class="w-full bg-slate-800 hover:bg-black text-white font-bold py-3 rounded-xl shadow-md transition-colors mt-2 text-sm" id="n-submit-btn">
                            <i class="fa-solid fa-check mr-1"></i> ?±Î°ù ?ÑÎ£å
                        </button>
                    </form>
                </div>
                ` : ''}

                <div id="notice-list" class="flex-1 overflow-y-auto space-y-3 pb-4 px-2">
                    <div class="animate-pulse space-y-3 p-2"><div class="h-20 bg-slate-200 rounded-2xl w-full"></div><div class="h-20 bg-slate-200 rounded-2xl w-full"></div><div class="h-20 bg-slate-200 rounded-2xl w-full"></div></div>
                </div>

                <!-- ?ÅÏÑ∏ Î≥¥Í∏∞ Î™®Îã¨ -->
                <div id="notice-detail-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4 opacity-0 transition-opacity">
                    <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transform scale-95 transition-transform flex flex-col max-h-[90vh]" id="notice-detail-modal-content">
                        <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                            <h3 class="font-bold text-slate-800 flex items-center gap-2"><i class="fa-regular fa-bell text-primary"></i> <span id="detail-category-badge">?àÏ†Ñ Í≥µÏ?</span></h3>
                            <button id="btn-close-detail" class="text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200">
                                <i class="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        <div class="p-6 overflow-y-auto flex-1">
                            <h2 class="text-xl font-bold text-slate-800 mb-2" id="detail-title">?úÎ™©</h2>
                            <p class="text-xs text-slate-400 mb-6" id="detail-date">2026-06-04</p>
                            <div class="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed mb-6" id="detail-body">?¥Ïö©</div>
                            
                            <div id="detail-attachment" class="hidden border-t border-slate-100 pt-4">
                                <h4 class="text-xs font-bold text-slate-500 mb-2">Ï≤®Î??êÎ£å</h4>
                                <a href="#" target="_blank" id="detail-link-btn" class="inline-flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                                    <i class="fa-solid fa-paperclip"></i> <span id="detail-link-text">Ï≤®Î??åÏùº ?ïÏù∏?òÍ∏∞</span>
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
                document.getElementById('n-submit-btn').innerHTML = '<i class="fa-solid fa-check mr-1"></i> ?±Î°ù ?ÑÎ£å';
                noticeForm.reset();
                formContainer.classList.remove('hidden');
                btnShowForm.classList.add('hidden');
            });
            
            btnCloseForm.addEventListener('click', () => {
                formContainer.classList.add('hidden');
                btnShowForm.classList.remove('hidden');
            });
            
            // ?ÅÏÑ∏ Î™®Îã¨ ?´Í∏∞
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
                    alert('[Mock] ' + (id ? '?òÏ†ï' : '?±Î°ù') + '?òÏóà?µÎãà??' + (hasFile ? '\\n(Ï≤®Î??åÏùº: ' + fileInput.files[0].name + ')' : ''));
                    noticeForm.reset();
                    formContainer.classList.add('hidden');
                    btnShowForm.classList.remove('hidden');
                    this.loadData();
                    return;
                }
                
                showLoading(true);
                // ?§Ï†ú ?åÏùº ?ÖÎ°ú??Î°úÏßÅ
                let fileUrl = null;
                if (hasFile) {
                    const file = fileInput.files[0];
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                    
                    const { data: uploadData, error: uploadError } = await AppState.supabase.storage
                        .from('attachments')
                        .upload(fileName, new Blob([await file.arrayBuffer()], {type: file.type || 'application/pdf'}), { contentType: file.type || 'application/pdf' });
                        
                    if (uploadError) {
                        alert('?åÏùº ?ÖÎ°ú???§Ìå®: ' + uploadError.message);
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
                        file_url: fileUrl,
                        created_by: AppState.user.id
                    }]);
                    error = res.error;
                }
                
                showLoading(false);
                if (error) {
                    alert('?±Î°ù ?§Ìå®: ' + error.message);
                } else {
                    alert('?±Í≥µ?ÅÏúºÎ°??±Î°ù?òÏóà?µÎãà??');
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
            titleEl.textContent = '???àÏ†ÑÍ≥µÏ? ?±Î°ù';
            if(linkContainer) linkContainer.classList.add('hidden');
            if(linkInput) linkInput.removeAttribute('required');
        } else {
            titleEl.textContent = '??ÍµêÏú°?êÎ£å ?±Î°ù';
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
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-3 cursor-pointer hover:bg-slate-50 btn-view-notice" data-type="notice" data-title="[Mock] ?•ÎßàÏ≤??ÄÎπ??òÌï¥ ?àÎ∞© ÏßÄÏπ? data-content="Í¥Ä??Íµ¨Ïó≠ ??Î∞∞ÏàòÎ°??ïÎπÑ Î∞??åÌîÑ ?¨Ï†Ñ ?êÍ? ?îÎßù..." data-date="2026-06-02">
                            <div class="w-10 h-10 shrink-0 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-lg">
                                <i class="fa-solid fa-thumbtack"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-sm text-slate-800 truncate mb-1">[Mock] ?•ÎßàÏ≤??ÄÎπ??òÌï¥ ?àÎ∞© ÏßÄÏπ?/h4>
                                <p class="text-xs text-slate-500 truncate">Í¥Ä??Íµ¨Ïó≠ ??Î∞∞ÏàòÎ°??ïÎπÑ Î∞??åÌîÑ ?¨Ï†Ñ ?êÍ? ?îÎßù...</p>
                                <span class="text-[10px] text-slate-400 mt-2 block">2026-06-02</span>
                            </div>
                        </div>
                    `;
                } else {
                    listEl.innerHTML = `
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 btn-view-notice cursor-pointer hover:bg-slate-50" data-type="education" data-title="[Mock] 2Î∂ÑÍ∏∞ ?ëÎ†•??Î≤ïÏ†ï ?àÏ†ÑÎ≥¥Í±¥ÍµêÏú° ?êÎ£å" data-content="Íµ¨Í? ?úÎùº?¥Î∏å ?Ä?©Îüâ Í≥µÏú† ÎßÅÌÅ¨" data-link="https://drive.google.com/" data-date="2026-06-01">
                            <div class="flex items-start gap-3">
                                <div class="w-10 h-10 shrink-0 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-lg">
                                    <i class="fa-brands fa-google-drive"></i>
                                </div>
                                <div class="flex-1 min-w-0 mb-3">
                                    <h4 class="font-bold text-sm text-slate-800 truncate mb-1">[Mock] 2Î∂ÑÍ∏∞ ?ëÎ†•??Î≤ïÏ†ï ?àÏ†ÑÎ≥¥Í±¥ÍµêÏú° ?êÎ£å (PPT/PDF)</h4>
                                    <p class="text-[10px] text-slate-400">Íµ¨Í? ?úÎùº?¥Î∏å ?Ä?©Îüâ Í≥µÏú† ÎßÅÌÅ¨</p>
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
                    <p class="text-slate-500 text-sm">?±Î°ù????™©???ÜÏäµ?àÎã§.</p>
                </div>
            `;
            return;
        }

        const isAdmin = AppState.profile && AppState.profile.role === 'admin';

        listEl.innerHTML = data.map(item => {
            const editControls = isAdmin ? `
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                    <button class="btn-edit-notice w-6 h-6 rounded bg-slate-100 text-slate-500 hover:text-primary hover:bg-blue-50 flex items-center justify-center transition-colors" data-id="${item.id}" data-title="${(item.title || '').replace(/"/g, '&quot;')}" data-content="${(item.content || '').replace(/"/g, '&quot;')}" data-link="${(item.drive_link || '').replace(/"/g, '&quot;')}">
                        <i class="fa-solid fa-pen text-[10px]"></i>
                    </button>
                    <button class="btn-del-notice w-6 h-6 rounded bg-slate-100 text-slate-500 hover:text-brandRed hover:bg-red-50 flex items-center justify-center transition-colors" data-id="${item.id}">
                        <i class="fa-solid fa-trash text-[10px]"></i>
                    </button>
                </div>
            ` : '';

            if (this.currentTab === 'notice') {
                return `
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-3 cursor-pointer hover:bg-slate-50 relative group btn-view-notice" data-type="notice" data-title="${(item.title || '').replace(/"/g, '&quot;')}" data-content="${(item.content || '').replace(/"/g, '&quot;')}" data-file="${(item.file_url || '').replace(/"/g, '&quot;')}" data-date="${item.created_at}">
                        ${editControls}
                        <div class="w-10 h-10 shrink-0 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center text-lg">
                            <i class="fa-regular fa-bell"></i>
                        </div>
                        <div class="flex-1 min-w-0 pr-10">
                            <h4 class="font-bold text-sm text-slate-800 truncate mb-1">${item.title}</h4>
                            <p class="text-xs text-slate-500 truncate">${item.content || ''}</p>
                            ${item.file_url ? `
                            <div class="mt-2 text-[10px] bg-slate-100 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit border border-slate-200">
                                <i class="fa-solid fa-paperclip"></i> Ï≤®Î??åÏùº ?àÏùå
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
                                <p class="text-[10px] text-slate-400">${item.content || 'Íµ¨Í? ?úÎùº?¥Î∏å ?Ä?©Îüâ Í≥µÏú† ÎßÅÌÅ¨'}</p>
                                ${item.file_url ? `
                                <a href="${item.file_url}" target="_blank" rel="noopener noreferrer" class="mt-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation();">
                                    <i class="fa-solid fa-paperclip"></i> Î∂ôÏûÑ?åÏùº ?ïÏù∏
                                </a>
                                ` : ''}
                            </div>
                        </div>
                        ${item.drive_link ? `
                        <button class="w-full bg-slate-50 hover:bg-slate-100 text-blue-600 text-xs font-bold py-2 rounded-xl transition-colors border border-slate-100" onclick="window.open('${item.drive_link}', '_blank')">
                            <i class="fa-solid fa-arrow-up-right-from-square mr-1"></i> ?êÎ£å ?¥Îûå?òÍ∏∞
                        </button>
                        ` : ''}
                    </div>
                `;
            }
        }).join('');

        // ?ÅÏÑ∏ Î≥¥Í∏∞ ?¥Î≤§???ÑÏûÑ
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
                        badgeEl.parentElement.innerHTML = '<i class="fa-regular fa-bell text-primary"></i> <span id="detail-category-badge">?àÏ†Ñ Í≥µÏ?</span>';
                    } else {
                        badgeEl.parentElement.innerHTML = '<i class="fa-brands fa-google-drive text-blue-600"></i> <span id="detail-category-badge">ÍµêÏú° ?êÎ£å??/span>';
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
                    linkBtn.innerHTML = '<i class="fa-brands fa-google-drive"></i> <span id="detail-link-text">?êÎ£å ?¥Îûå?òÍ∏∞</span>';
                } else if (fileUrl) {
                    attachContainer.classList.remove('hidden');
                    linkBtn.href = fileUrl;
                    linkBtn.className = 'inline-flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors border border-slate-200';
                    linkBtn.innerHTML = '<i class="fa-solid fa-paperclip"></i> <span id="detail-link-text">Ï≤®Î??åÏùº ?¥Í∏∞</span>';
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

        // ?òÏ†ï/??†ú ?¥Î≤§???ÑÏûÑ
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
                    if(titleEl) titleEl.textContent = this.currentTab === 'notice' ? 'Í≥µÏ? ?òÏ†ï' : 'ÍµêÏú°?êÎ£å ?òÏ†ï';
                    document.getElementById('n-submit-btn').innerHTML = '<i class="fa-solid fa-check mr-1"></i> ?òÏ†ï ?ÑÎ£å';
                    
                    formContainer.classList.remove('hidden');
                    if(btnShowForm) btnShowForm.classList.add('hidden');
                });
            });

            listEl.querySelectorAll('.btn-del-notice').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm('?ïÎßê ??†ú?òÏãúÍ≤†Ïäµ?àÍπå?')) {
                        if (!AppState.supabase) {
                            alert('[Mock] ??†ú?òÏóà?µÎãà??');
                            return;
                        }
                        showLoading(true);
                        const { error } = await AppState.supabase.from('notices').delete().eq('id', btn.dataset.id);
                        showLoading(false);
                        if (error) alert('??†ú ?§Ìå®: ' + error.message);
                        else this.loadData();
                    }
                });
            });
        }
    }
};

