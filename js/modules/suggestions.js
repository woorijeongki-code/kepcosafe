window.Modules['suggestions'] = {
    title: 'ê±´ì˜?¬í•­ & ì§ˆë¬¸?˜ê¸°',
    
    render() {
        return `
            <div class="space-y-6 fade-in h-full flex flex-col">
                <!-- ?ë‹¨ ?¡ì…˜ ë°?-->
                <div class="flex justify-between items-end mb-2">
                    <div>
                        <h2 class="text-lg font-bold text-slate-800">?„ì¥ ?Œí†µ ê²Œì‹œ??/h2>
                        <p class="text-xs text-slate-500">?„í—˜ ?”ì†Œ ? ê³  ë°?ê±´ì˜?¬í•­</p>
                    </div>
                    <button id="btn-new-suggestion" class="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-blue-800 transition-colors">
                        <i class="fa-solid fa-pen mr-1"></i> ê¸€?°ê¸°
                    </button>
                </div>

                <!-- ë¦¬ìŠ¤???ì—­ -->
                <div id="suggestions-list" class="flex-1 overflow-y-auto space-y-3 pb-4">
                    <div class="animate-pulse space-y-3 p-2"><div class="h-20 bg-slate-200 rounded-2xl w-full"></div><div class="h-20 bg-slate-200 rounded-2xl w-full"></div></div>
                </div>
            </div>

            <!-- ê¸€?°ê¸° ëª¨ë‹¬ -->
            <div id="modal-suggestion" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 hidden flex flex-col justify-end md:justify-center items-center">
                <div class="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-2xl shadow-2xl p-5 slide-in-top">
                    <div class="flex justify-between items-center mb-4 border-b pb-3">
                        <h3 class="font-bold text-lg text-slate-800" id="sug-modal-title">??ê²Œì‹œê¸€ ?‘ì„±</h3>
                        <button id="btn-close-modal" class="text-slate-400 hover:text-slate-700 text-xl"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <form id="form-suggestion" class="space-y-4">
                        <input type="hidden" id="sug-id" value="">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">?œëª©</label>
                            <input type="text" id="sug-title" required class="w-full border border-slate-300 rounded-xl p-3 focus:ring-primary focus:border-primary text-sm" placeholder="?œëª©???…ë ¥?˜ì„¸??>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">?´ìš©</label>
                            <textarea id="sug-content" required rows="4" class="w-full border border-slate-300 rounded-xl p-3 focus:ring-primary focus:border-primary text-sm" placeholder="?„ì¥???„í—˜?”ì†Œ??ê±´ì˜?¬í•­???ì„¸???ì–´ì£¼ì„¸??></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">ë¶™ì„ (?¬ì§„/?Œì¼)</label>
                            <input type="file" id="sug-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1">
                        </div>
                        <button type="submit" class="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-md mt-2" id="sug-submit-btn">
                            ?±ë¡?˜ê¸°
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
                document.getElementById('sug-modal-title').textContent = '??ê²Œì‹œê¸€ ?‘ì„±';
                document.getElementById('sug-submit-btn').textContent = '?±ë¡?˜ê¸°';
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
                    alert('[Mock] ê²Œì‹œê¸€??' + (id ? '?˜ì •' : '?±ë¡') + '?˜ì—ˆ?µë‹ˆ??' + (hasFile ? '\\n(ì²¨ë??Œì¼: ' + fileInput.files[0].name + ')' : ''));
                    modal.classList.add('hidden');
                    form.reset();
                    return;
                }

                // ?¤ì œ ?Œì¼ ?…ë¡œ??ë¡œì§
                let fileUrl = null;
                if (hasFile) {
                    const file = fileInput.files[0];
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                    
                    const { data: uploadData, error: uploadError } = await AppState.supabase.storage
                        .from('attachments')
                        .upload(fileName, new Blob([await file.arrayBuffer()], {type: file.type || 'application/pdf'}), { contentType: file.type || 'application/pdf' });
                        
                    if (uploadError) {
                        alert('?Œì¼ ?…ë¡œ???¤íŒ¨: ' + uploadError.message);
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
                    alert('ì²˜ë¦¬ ?¤íŒ¨: ' + error.message);
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
                        <span class="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded">?µë??€ê¸?/span>
                        <span class="text-[10px] text-slate-400">ë°©ê¸ˆ ??/span>
                    </div>
                    <h4 class="font-bold text-sm text-slate-800 mb-1">[Mock] ?‘ì—…??ì¡°ëª… ì¶”ê? ?¤ì¹˜ ê±´ì˜</h4>
                    <p class="text-xs text-slate-500 line-clamp-2">Aêµ¬ì—­ ì§€???‘ì—…??ì¡°ëª…???ˆë¬´ ?´ë‘??ë°œë¹ ì§??¬ê³  ?„í—˜???ˆìŠµ?ˆë‹¤.</p>
                    <button class="mt-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation(); alert('ì²¨ë??Œì¼ ?¤ìš´ë¡œë“œ (Mock)')">
                        <i class="fa-solid fa-paperclip"></i> ?„ì¥?¬ì§„.jpg
                    </button>
                    <div class="mt-3 flex justify-between items-center text-xs text-slate-400 border-t pt-2 border-slate-50">
                        <span>?ê¸¸??(?ŒìŠ¤?¸í˜‘?¥ì‚¬)</span>
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
            listEl.innerHTML = '<p class="text-center text-red-500 py-4">?°ì´?°ë? ë¶ˆëŸ¬?¤ì? ëª»í–ˆ?µë‹ˆ??</p>';
            return;
        }

        if (data.length === 0) {
            listEl.innerHTML = `
                <div class="text-center py-10 flex flex-col items-center">
                    <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 text-3xl mb-3">
                        <i class="fa-regular fa-folder-open"></i>
                    </div>
                    <p class="text-slate-500 text-sm">?±ë¡??ê²Œì‹œê¸€???†ìŠµ?ˆë‹¤.</p>
                </div>
            `;
            return;
        }

        const statusMap = {
            'pending': { label: '?‘ìˆ˜?„ë£Œ', color: 'bg-yellow-100 text-yellow-700' },
            'in_progress': { label: 'ê²€? ì¤‘', color: 'bg-blue-100 text-blue-700' },
            'resolved': { label: 'ì¡°ì¹˜?„ë£Œ', color: 'bg-green-100 text-green-700' }
        };

        listEl.innerHTML = data.map(item => {
            const st = statusMap[item.status] || statusMap['pending'];
            const date = new Date(item.created_at).toLocaleDateString();
            const author = item.users ? `${item.users.full_name} (${item.users.company_name})` : '?????†ìŒ';
            
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
                    <div class="cursor-pointer" onclick="alert('ê²Œì‹œê¸€ ?ì„¸ ë³´ê¸° ë°??“ê? ê¸°ëŠ¥?€ ê¸°ëŠ¥ ?•ì¥ ê°€?´ë“œ???°ë¼ ì¶”ê? êµ¬í˜„??ê°€?¥í•©?ˆë‹¤.')">
                        <h4 class="font-bold text-sm text-slate-800 mb-1">${item.title}</h4>
                        <p class="text-xs text-slate-500 line-clamp-2">${item.content}</p>
                        ${item.file_url ? `
                        <a href="${item.file_url}" target="_blank" rel="noopener noreferrer" class="mt-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation();">
                            <i class="fa-solid fa-paperclip"></i> ì²¨ë??ë£Œ ?•ì¸
                        </a>
                        ` : ''}
                        <div class="mt-3 flex justify-between items-center text-xs text-slate-400 border-t pt-2 border-slate-50">
                            <span class="truncate pr-2"><i class="fa-regular fa-user mr-1"></i> ${author}</span>
                            <span class="shrink-0 text-primary">?ì„¸??ë³´ê¸° <i class="fa-solid fa-angle-right ml-1"></i></span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // ?´ë²¤???„ì„
        listEl.querySelectorAll('.btn-edit-sug').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const title = btn.dataset.title;
                const content = btn.dataset.content;
                
                document.getElementById('sug-id').value = id;
                document.getElementById('sug-title').value = title;
                document.getElementById('sug-content').value = content;
                document.getElementById('sug-modal-title').textContent = 'ê²Œì‹œê¸€ ?˜ì •';
                document.getElementById('sug-submit-btn').textContent = '?˜ì •?˜ê¸°';
                document.getElementById('modal-suggestion').classList.remove('hidden');
            });
        });

        listEl.querySelectorAll('.btn-del-sug').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm('?•ë§ ??ê²Œì‹œê¸€???? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?')) {
                    if (!AppState.supabase) {
                        alert('[Mock] ?? œ?˜ì—ˆ?µë‹ˆ??');
                        return;
                    }
                    showLoading(true);
                    const { error } = await AppState.supabase.from('suggestions').delete().eq('id', btn.dataset.id);
                    showLoading(false);
                    if (error) alert('?? œ ?¤íŒ¨: ' + error.message);
                    else this.loadSuggestions();
                }
            });
        });
    }
};

