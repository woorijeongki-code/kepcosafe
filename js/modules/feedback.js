window.Modules['feedback'] = {
    title: '?¼ë“œë°??œì¶œ',
    
    render() {
        const isAdmin = AppState.profile && AppState.profile.role === 'admin';
        
        let html = `
            <div class="space-y-6 fade-in h-full flex flex-col">
                <!-- ??ë©”ë‰´ -->
                <div class="flex border-b border-slate-200 mb-2">
                    <button class="flex-1 py-3 text-sm font-bold text-primary border-b-2 border-primary" id="tab-meeting">ë¬´ì •?„íšŒ?˜ë¡ ?¼ë“œë°?/button>
                    <button class="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors" id="tab-edu">êµìœ¡?ë£Œ ?¼ë“œë°?/button>
                </div>
                
                <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                    <p class="text-sm text-blue-800" id="feedback-desc">ë¬´ì •??ê³µë²• ê´€???Œì˜ë¡ì„ ?•ì¸?˜ê³ , ?„ì¥ ?˜ê²¬?´ë‚˜ ë³´ì™„ ?¬í•­???œì¶œ??ì£¼ì„¸?? (ê´€ë¦¬ìê°€ ?¬ë¦° ?Œì˜ë¡ì—???œëª…???¨ê¸¸ ???ˆìŠµ?ˆë‹¤.)</p>
                </div>

                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h4 class="font-bold text-slate-800 mb-4" id="form-title">${isAdmin ? '?Œì˜ë¡?/ ?ë£Œ ?…ë¡œ?? : '?˜ê²¬ ?œì¶œ?˜ê¸°'}</h4>
                    <form id="feedback-form" class="space-y-4">
                        <input type="hidden" id="fb-id" value="">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">?œëª©</label>
                            <input type="text" id="fb-title" required class="block w-full p-3 border border-slate-300 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="?? 6???ˆì „êµìœ¡ ?´ìˆ˜ ë°?ê±´ì˜?¬í•­">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">?ì„¸ ?´ìš©</label>
                            <textarea id="fb-content" rows="4" required class="block w-full p-3 border border-slate-300 rounded-xl focus:ring-primary focus:border-primary text-sm" placeholder="${isAdmin ? '?Œì˜ë¡??´ìš©???”ì•½?˜ì—¬ ?‘ì„±??ì£¼ì„¸??' : '?˜ê²¬???ìœ ë¡?²Œ ?ì–´ì£¼ì„¸??'}"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">ë¶™ì„ (ì²¨ë??Œì¼)</label>
                            <input type="file" id="fb-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1">
                        </div>
                        <div class="flex gap-2">
                            <button type="submit" class="flex-1 bg-primary hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-md transition-colors" id="fb-submit-btn">
                                <i class="fa-solid fa-paper-plane mr-1"></i> ${isAdmin ? '?…ë¡œ?œí•˜ê¸? : '?œì¶œ?˜ê¸°'}
                            </button>
                            <button type="button" id="btn-fb-cancel-edit" class="hidden flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl shadow-sm transition-colors">
                                ì·¨ì†Œ
                            </button>
                        </div>
                    </form>
                </div>

                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-1 relative">
                    <h4 class="font-bold text-slate-800 mb-4" id="list-title">?´ì—­ ë°??œëª… ?„í™©</h4>
                    <div id="feedback-list" class="space-y-4 pb-4 h-[400px] overflow-y-auto pr-2">
                        <div class="animate-pulse space-y-3 p-2"><div class="h-20 bg-slate-200 rounded-2xl w-full"></div><div class="h-20 bg-slate-200 rounded-2xl w-full"></div></div>
                    </div>
                </div>
            </div>

            <!-- ?œëª… ëª¨ë‹¬ -->
            <div id="signature-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4 opacity-0 transition-opacity">
                <div class="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden transform scale-95 transition-transform flex flex-col">
                    <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                        <h3 class="font-bold text-slate-800">?Œì˜ë¡??œëª…</h3>
                        <button id="btn-close-sig" class="text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200">
                            <i class="fa-solid fa-xmark text-lg"></i>
                        </button>
                    </div>
                    <div class="p-4 flex flex-col items-center">
                        <p class="text-xs text-slate-500 mb-2">?„ë˜ ?¤ëª¨ ì¹??ˆì— ?œëª…???•ìë¡?ê·¸ë ¤ì£¼ì„¸??</p>
                        <canvas id="signature-pad" width="300" height="150" class="border-2 border-slate-200 rounded-xl bg-slate-50 touch-none mb-3"></canvas>
                        <div class="flex w-full gap-2">
                            <button id="btn-clear-sig" class="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 rounded-xl text-sm transition-colors">ì§€?°ê¸°</button>
                            <button id="btn-save-sig" class="w-2/3 bg-primary hover:bg-blue-800 text-white font-bold py-2 rounded-xl text-sm transition-colors shadow-md">?œëª… ?„ë£Œ</button>
                        </div>
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
                document.getElementById('fb-submit-btn').innerHTML = `<i class="fa-solid fa-paper-plane mr-1"></i> ${AppState.profile && AppState.profile.role === 'admin' ? '?…ë¡œ?œí•˜ê¸? : '?œì¶œ?˜ê¸°'}`;
                form.reset();
                btnCancelEdit.classList.add('hidden');
            });
        }
        
        this.initSignaturePad();

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
                    alert('[Mock] ?¼ë“œë°±ì´ ' + (id ? '?˜ì •' : '?œì¶œ') + '?˜ì—ˆ?µë‹ˆ??' + (hasFile ? '\\n(ì²¨ë??Œì¼: ' + fileInput.files[0].name + ')' : ''));
                    form.reset();
                    if(btnCancelEdit) btnCancelEdit.classList.add('hidden');
                    document.getElementById('fb-submit-btn').innerHTML = '<i class="fa-solid fa-paper-plane mr-1"></i> ?œì¶œ?˜ê¸°';
                    this.loadFeedback();
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
                    alert('ì²˜ë¦¬ ?¤íŒ¨: ' + error.message);
                } else {
                    alert(id ? '?˜ì •?˜ì—ˆ?µë‹ˆ??' : '?±ê³µ?ìœ¼ë¡??œì¶œ?˜ì—ˆ?µë‹ˆ??');
                    form.reset();
                    document.getElementById('fb-id').value = '';
                    if(btnCancelEdit) btnCancelEdit.classList.add('hidden');
                    document.getElementById('fb-submit-btn').innerHTML = '<i class="fa-solid fa-paper-plane mr-1"></i> ?œì¶œ?˜ê¸°';
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
                if(descEl) descEl.textContent = "ë¬´ì •??ê³µë²• ê´€???Œì˜ë¡ì„ ?•ì¸?˜ê³ , ?„ì¥ ?˜ê²¬?´ë‚˜ ë³´ì™„ ?¬í•­???œì¶œ??ì£¼ì„¸??";
                this.loadFeedback();
            });

            tabEdu.addEventListener('click', () => {
                this.currentTab = 'edu';
                tabEdu.className = "flex-1 py-3 text-sm font-bold text-primary border-b-2 border-primary transition-all";
                tabMeeting.className = "flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all";
                if(descEl) descEl.textContent = "?ˆì „ êµìœ¡?ë£Œë¥??´ëŒ?˜ì‹  ???´ìˆ˜ ?•ì¸ ë°?êµìœ¡???€???¼ë“œë°±ì„ ?¨ê²¨ ì£¼ì„¸??";
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
                            ?€
                        </div>
                        <div class="flex-1">
                            <h5 class="font-bold text-sm text-slate-800 mb-1">[Mock] ${this.currentTab === 'meeting' ? 'ë¬´ì •???‘ì—… ???ˆì „ê³ ë¦¬ ì²´ê²° ê±´ì˜' : '6???•ê¸° ?ˆì „êµìœ¡ ?´ìˆ˜ ?„ë£Œ ë°?ê±´ì˜'}</h5>
                            <p class="text-xs text-slate-600 leading-relaxed mb-2">?„ì¥ ?˜ê²¬?…ë‹ˆ?? ??ë¶€?ë“œë¦½ë‹ˆ??</p>
                            <button class="mb-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200" onclick="event.stopPropagation(); alert('ì²¨ë??Œì¼ ?¤ìš´ë¡œë“œ (Mock)')">
                                <i class="fa-solid fa-paperclip"></i> ì¦ë¹™?ë£Œ.pdf
                            </button>
                            <p class="text-[10px] text-slate-400">?€?•ì „ê¸?ì£? Â· 2026-06-02</p>
                        </div>
                    </div>
                `;
            }, 300);
            return;
        }

        const isAdmin = AppState.profile && AppState.profile.role === 'admin';
        
        let query = AppState.supabase
            .from('feedback')
            .select('*, users(company_name, full_name, role), signatures(id, signer_id, signature_url, users(company_name))')
            .eq('category', this.currentTab)
            .order('created_at', { ascending: false });

        const { data, error } = await query;
        let filteredData = data;
        
        if (!isAdmin) {
            // ?‘ë ¥?¬ëŠ” ë³¸ì¸????ê¸€?´ê±°?? ê´€ë¦¬ìê°€ ?¬ë¦° ê¸€(?Œì˜ë¡?ë§?ë³????ˆìŒ
            filteredData = data?.filter(item => item.author_id === AppState.user.id || item.users?.role === 'admin') || [];
        }

        if (error) {
            listEl.innerHTML = `<p class="text-center text-sm text-red-500 py-4">ëª©ë¡ ë¡œë“œ ?¤íŒ¨</p>`;
            return;
        }

        if (filteredData.length === 0) {
            listEl.innerHTML = `<p class="text-center text-sm text-slate-500 py-8">?±ë¡???´ì—­???†ìŠµ?ˆë‹¤.</p>`;
            return;
        }

        listEl.innerHTML = filteredData.map(item => {
            const isWriterAdmin = item.users?.role === 'admin';
            const companyName = isWriterAdmin ? '?œêµ­?„ë ¥ê³µì‚¬' : (item.users?.company_name || '?‘ë ¥?Œì‚¬');
            const firstLetter = isWriterAdmin ? '?? : companyName.charAt(0);
            const badgeClass = isWriterAdmin ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600';
            
            const isAuthor = AppState.user && item.author_id === AppState.user.id;
            
            const signatures = item.signatures || [];
            const hasSigned = !isAdmin && signatures.some(sig => sig.signer_id === AppState.user.id);
            
            let sigHtml = '';
            if (isWriterAdmin) {
                // ê´€ë¦¬ìê°€ ???Œì˜ë¡ì˜ ê²½ìš°, ?œëª… ê´€??UI ?œì‹œ
                if (isAdmin) {
                    // ê´€ë¦¬ì ?”ë©´: ?œëª…???‘ë ¥??ëª©ë¡ê³??œëª… ?´ë?ì§€ ?œì‹œ
                    if (signatures.length > 0) {
                        sigHtml = `
                            <div class="mt-3 pt-3 border-t border-slate-100">
                                <p class="text-[10px] font-bold text-slate-500 mb-2">?œëª… ?„ë£Œ ?„í™© (${signatures.length}ê°œì‚¬)</p>
                                <div class="flex flex-wrap gap-2">
                                    ${signatures.map(sig => `
                                        <div class="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center w-20">
                                            <p class="text-[9px] font-bold text-slate-700 truncate mb-1" title="${sig.users?.company_name}">${sig.users?.company_name}</p>
                                            <img src="${sig.signature_url}" class="w-full h-8 object-contain bg-white rounded">
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    } else {
                        sigHtml = `<div class="mt-3 pt-3 border-t border-slate-100"><p class="text-[10px] text-slate-400">?„ì§ ?œëª…???‘ë ¥?¬ê? ?†ìŠµ?ˆë‹¤.</p></div>`;
                    }
                } else {
                    // ?‘ë ¥???”ë©´: ?œëª…?˜ê¸° ë²„íŠ¼ ?ëŠ” ?„ë£Œ ë°°ì? ?œì‹œ
                    if (hasSigned) {
                        sigHtml = `
                            <div class="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                                <span class="bg-green-100 text-green-700 text-xs font-bold py-1 px-3 rounded-lg"><i class="fa-solid fa-check mr-1"></i> ?œëª… ?„ë£Œ</span>
                            </div>
                        `;
                    } else {
                        sigHtml = `
                            <div class="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                                <button class="btn-open-sig bg-primary text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md hover:bg-blue-800 transition-colors" data-id="${item.id}">
                                    <i class="fa-solid fa-pen-nib mr-1"></i> ?œëª…?˜ê¸°
                                </button>
                            </div>
                        `;
                    }
                }
            }
            
            const editControls = (isAuthor || isAdmin) ? `
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                    ${isAuthor ? `
                    <button class="btn-edit-fb w-6 h-6 rounded bg-slate-200 text-slate-500 hover:text-primary hover:bg-blue-100 flex items-center justify-center transition-colors" data-id="${item.id}" data-title="${(item.title || '').replace(/"/g, '&quot;')}" data-content="${(item.content || '').replace(/"/g, '&quot;')}">
                        <i class="fa-solid fa-pen text-[10px]"></i>
                    </button>
                    ` : ''}
                    <button class="btn-del-fb w-6 h-6 rounded bg-slate-200 text-slate-500 hover:text-brandRed hover:bg-red-100 flex items-center justify-center transition-colors" data-id="${item.id}">
                        <i class="fa-solid fa-trash text-[10px]"></i>
                    </button>
                </div>
            ` : '';

            return `
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group flex flex-col hover:shadow-sm transition-shadow">
                    ${editControls}
                    <div class="flex gap-4">
                        <div class="w-10 h-10 shrink-0 ${badgeClass} rounded-full flex items-center justify-center text-lg font-bold">
                            ${firstLetter}
                        </div>
                        <div class="flex-1 min-w-0 pr-8">
                            <h5 class="font-bold text-sm text-slate-800 mb-1">${item.title}</h5>
                            <p class="text-xs text-slate-600 leading-relaxed mb-2 whitespace-pre-wrap">${item.content}</p>
                            ${item.file_url ? `
                            <a href="${item.file_url}" target="_blank" rel="noopener noreferrer" class="mb-2 text-[10px] bg-white hover:bg-slate-100 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-slate-200">
                                <i class="fa-solid fa-paperclip"></i> ì²¨ë??ë£Œ ë³´ê¸°
                            </a>
                            ` : ''}
                            <p class="text-[10px] text-slate-400">${companyName} Â· ${new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    ${sigHtml}
                </div>
            `;
        }).join('');

        // ?´ë²¤???„ì„
        listEl.querySelectorAll('.btn-edit-fb').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('fb-id').value = btn.dataset.id;
                document.getElementById('fb-title').value = btn.dataset.title;
                document.getElementById('fb-content').value = btn.dataset.content;
                document.getElementById('fb-submit-btn').innerHTML = '<i class="fa-solid fa-check mr-1"></i> ?˜ì • ?„ë£Œ';
                document.getElementById('btn-fb-cancel-edit').classList.remove('hidden');
                document.getElementById('form-title').scrollIntoView({ behavior: 'smooth' });
            });
        });

        listEl.querySelectorAll('.btn-del-fb').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm('?•ë§ ?? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?')) {
                    if (!AppState.supabase) {
                        alert('[Mock] ?? œ?˜ì—ˆ?µë‹ˆ??');
                        return;
                    }
                    showLoading(true);
                    const { error } = await AppState.supabase.from('feedback').delete().eq('id', btn.dataset.id);
                    showLoading(false);
                    if (error) alert('?? œ ?¤íŒ¨: ' + error.message);
                    else this.loadFeedback();
                }
            });
        });

        listEl.querySelectorAll('.btn-open-sig').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.activeFeedbackId = btn.dataset.id;
                const modal = document.getElementById('signature-modal');
                const modalContent = modal.firstElementChild;
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    modalContent.classList.remove('scale-95');
                }, 10);
            });
        });
    },

    initSignaturePad() {
        const canvas = document.getElementById('signature-pad');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        
        // ìº”ë²„??ì´ˆê¸°??        ctx.fillStyle = '#f8fafc'; // slate-50
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            let clientX = e.clientX;
            let clientY = e.clientY;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const startDrawing = (e) => {
            isDrawing = true;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            e.preventDefault();
        };

        const draw = (e) => {
            if (!isDrawing) return;
            const pos = getPos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = '#0f172a'; // slate-900
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            e.preventDefault();
        };

        const stopDrawing = () => {
            isDrawing = false;
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);

        document.getElementById('btn-clear-sig').addEventListener('click', () => {
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
        
        const modal = document.getElementById('signature-modal');
        const modalContent = modal.firstElementChild;
        const closeModal = () => {
            modal.classList.add('opacity-0');
            modalContent.classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        };
        
        document.getElementById('btn-close-sig').addEventListener('click', closeModal);

        document.getElementById('btn-save-sig').addEventListener('click', async () => {
            if (!this.activeFeedbackId) return;
            
            const dataUrl = canvas.toDataURL('image/png');
            
            showLoading(true);
            try {
                if (!AppState.supabase) {
                    alert('[Mock] ?œëª…???€?¥ë˜?ˆìŠµ?ˆë‹¤.');
                    closeModal();
                    this.loadFeedback();
                    return;
                }
                
                // Base64 ?´ë?ì§€ë¥?Blob?¼ë¡œ ë³€?˜í•˜??Storage???…ë¡œ??                const res = await fetch(dataUrl);
                const blob = await res.blob();
                const fileName = `sig_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.png`;
                
                const { data: uploadData, error: uploadError } = await AppState.supabase.storage
                    .from('attachments')
                    .upload(`signatures/${fileName}`, blob);
                    
                if (uploadError) throw uploadError;
                
                const { data: publicUrlData } = AppState.supabase.storage
                    .from('attachments')
                    .getPublicUrl(`signatures/${fileName}`);
                    
                // signatures ?Œì´ë¸”ì— insert
                const { error: dbError } = await AppState.supabase.from('signatures').insert([{
                    feedback_id: this.activeFeedbackId,
                    signer_id: AppState.user.id,
                    signature_url: publicUrlData.publicUrl
                }]);
                
                if (dbError) throw dbError;
                
                alert('?œëª…???„ë£Œ?˜ì—ˆ?µë‹ˆ??');
                closeModal();
                this.loadFeedback();
            } catch (err) {
                console.error("?œëª… ?€???¤ë¥˜:", err);
                alert("?œëª… ?€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: " + err.message);
            } finally {
                showLoading(false);
            }
        });
    }
};

