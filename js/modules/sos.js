window.Modules['sos'] = {
    title: 'ê¸´ê¸‰ ?Œë¦¼ ?œë¹„??,
    
    render() {
        const isAdmin = AppState.profile && AppState.profile.role === 'admin';
        
        let html = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10 fade-in">
                
                <!-- ?¼ìª½ ?ì—­: ?Œë«???´ë? ê¸´ê¸‰ ?Œë¦¼ ?œë¹„??-->
                <div class="space-y-6">
                    <div class="bg-red-50 border border-red-100 rounded-2xl p-5">
                        <div class="flex items-center gap-3 mb-2">
                            <i class="fa-solid fa-triangle-exclamation text-red-500 text-xl"></i>
                            <h3 class="font-bold text-red-800">?Œë«???´ë? ê¸´ê¸‰ ?Œë¦¼</h3>
                        </div>
                        <p class="text-sm text-red-600">ê´€ë¦¬ìê°€ ê¸´ê¸‰ ?Œë¦¼??ë°œì†¡?˜ë©´, ?‘ì† ì¤‘ì¸ ëª¨ë“  ?‘ë ¥???±ì— ì¦‰ì‹œ ë¹¨ê°„??ê²½ê³  ?ì—…???œì‹œ?©ë‹ˆ??</p>
                    </div>
        `;

        if (isAdmin) {
            html += `
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h4 class="font-bold text-slate-800 mb-4">??ê¸´ê¸‰ ?Œë¦¼ ë°œì†¡</h4>
                    <form id="sos-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">ë©”ì‹œì§€ ?´ìš©</label>
                            <textarea id="sos-message" rows="3" required class="block w-full p-3 border border-slate-300 rounded-xl focus:ring-red-500 focus:border-red-500 text-sm" placeholder="?? [ê¸´ê¸‰] ê°•í’?¼ë¡œ ?¸í•œ ?€?Œí¬?ˆì¸ ?‘ì—… ?„ë©´ ì¤‘ì?"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">ë¶™ì„ (ì²¨ë??Œì¼)</label>
                            <input type="file" id="sos-file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1">
                        </div>
                        <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2">
                            <i class="fa-solid fa-paper-plane"></i> ?„ì²´ ë°œì†¡
                        </button>
                    </form>
                </div>
            `;
        }

        html += `
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h4 class="font-bold text-slate-800 mb-4">ìµœê·¼ ?˜ì‹ ???Œë¦¼ ê¸°ë¡</h4>
                    <div id="sos-history" class="space-y-3">
                        <div class="animate-pulse space-y-3 p-2" id="sos-loader"><div class="h-16 bg-slate-200 rounded-xl w-full"></div><div class="h-16 bg-slate-200 rounded-xl w-full"></div></div>
                    </div>
                </div>
            </div>

            <!-- ?¤ë¥¸ìª??ì—­: ?œì „ ?‘ì—…ì¤‘ì? ?”ì²­ ?¸ë? ë§í¬ -->
            <div class="space-y-6">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
                    <div class="bg-gradient-to-br from-slate-700 to-slate-800 p-6 text-white text-center flex-1 flex flex-col justify-center items-center relative overflow-hidden">
                        <!-- ë°°ê²½ ?°ì½”?ˆì´???”ì†Œ -->
                        <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                        <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-black/20 rounded-full blur-2xl"></div>
                        
                        <div class="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-4xl mb-4 relative z-10 shadow-inner">
                            <i class="fa-solid fa-hand-front-face text-rose-400"></i>
                        </div>
                        <h3 class="font-black text-2xl mb-2 relative z-10">?‘ì—…ì¤‘ì? ?”ì²­?œë„</h3>
                        <p class="text-sm text-slate-300 mb-8 max-w-sm mx-auto leading-relaxed relative z-10 font-medium">
                            ê·¼ë¡œ?ê? ?°ì—…?¬í•´ê°€ ë°œìƒ??ê¸‰ë°•???„í—˜???ˆëŠ” ê²½ìš°?ëŠ” ì¦‰ì‹œ ?‘ì—…??ì¤‘ì??˜ê³  ?€?¼í•  ???ˆìœ¼ë©? 
                            ?‘ì—…ì¤‘ì? ë°??€????ì¦‰ì‹œ ?ˆì „ë³´ê±´ê´€ë¦¬ì±…?„ì ?±ì—ê²?ë³´ê³ ?´ì•¼ ?©ë‹ˆ??
                        </p>
                        
                        <a href="https://www.kepco.co.kr/home/customer/safety/report/stop-work/guide.do" target="_blank" class="w-full max-w-xs bg-rose-600 text-white hover:bg-rose-700 font-black py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex justify-center items-center gap-2 text-lg relative z-10 border border-rose-500">
                            ??ì°½ì—???”ì²­?˜ê¸° <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                        <p class="text-xs text-slate-400 mt-5 relative z-10 flex items-center justify-center gap-1.5"><i class="fa-solid fa-circle-info"></i> ?œì „ ê³µì‹ ?ˆí˜?´ì? ?ˆì „ ?¬í„¸ë¡??ˆì „?˜ê²Œ ?´ë™?©ë‹ˆ??</p>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        return html;
    },

    init() {
        this.loadHistory();
        this.setupRealtime();

        const form = document.getElementById('sos-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const msg = document.getElementById('sos-message').value;
                const fileInput = document.getElementById('sos-file');
                const hasFile = fileInput && fileInput.files.length > 0;

                if (!msg.trim()) return;

                if (!AppState.supabase) {
                    alert('[Mock] ?Œë¦¼??ë°œì†¡?˜ì—ˆ?µë‹ˆ??' + (hasFile ? '\\n(ì²¨ë??Œì¼: ' + fileInput.files[0].name + ')' : ''));
                    this.showSOSAlert(msg);
                    form.reset();
                    return;
                }

                showLoading(true);
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

                const { error } = await AppState.supabase
                    .from('sos_alerts')
                    .insert([{
                        message: msg,
                        sender_id: AppState.user.id,
                        level: 'danger',
                        ...(hasFile && { file_url: fileUrl })
                    }]);
                
                showLoading(false);
                if (error) {
                    alert('ë°œì†¡ ?¤íŒ¨: ' + error.message);
                } else {
                    form.reset();
                    // Realtime???‘ë™?˜ì? ?Šì„ ê²½ìš°ë¥??€ë¹„í•´ ì§ì ‘ ëª©ë¡ ê°±ì‹ 
                    this.loadHistory();
                    
                    // ?±ê³µ ë©”ì‹œì§€ ?„ìš°ê¸?                    alert('ê¸´ê¸‰ ?Œë¦¼???±ê³µ?ìœ¼ë¡?ë°œì†¡?˜ì—ˆ?µë‹ˆ??');
                }
            });
        }
    },

    async loadHistory() {
        const historyContainer = document.getElementById('sos-history');
        if (!AppState.supabase) {
            historyContainer.innerHTML = '<p class="text-center text-sm text-slate-500 py-4">?°ì´?°ë² ?´ìŠ¤ ?°ê²° ?†ìŒ (Mock)</p>';
            return;
        }

        const { data, error } = await AppState.supabase
            .from('sos_alerts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            historyContainer.innerHTML = `<p class="text-center text-sm text-red-500 py-4">ëª©ë¡ ë¡œë“œ ?¤íŒ¨</p>`;
            return;
        }

        if (data.length === 0) {
            historyContainer.innerHTML = `<p class="text-center text-sm text-slate-500 py-4">ìµœê·¼ ?Œë¦¼???†ìŠµ?ˆë‹¤.</p>`;
            return;
        }

        const isAdmin = AppState.profile && AppState.profile.role === 'admin';

        historyContainer.innerHTML = data.map(alert => `
            <div class="p-3 bg-red-50 rounded-xl border border-red-100 border-l-4 border-l-red-500 flex justify-between items-start">
                <div>
                    <p class="text-sm font-bold text-slate-800 mb-1">${alert.message}</p>
                    ${alert.file_url ? `
                    <a href="${alert.file_url}" target="_blank" rel="noopener noreferrer" class="mb-2 text-[10px] bg-white hover:bg-slate-100 text-slate-600 py-1 px-2 rounded-lg flex items-center gap-1 w-fit transition-colors border border-red-200" onclick="event.stopPropagation();">
                        <i class="fa-solid fa-paperclip"></i> ì²¨ë??Œì¼ ?•ì¸
                    </a>
                    ` : ''}
                    <p class="text-[10px] text-slate-500">${new Date(alert.created_at).toLocaleString()}</p>
                </div>
                ${isAdmin ? `
                <button class="btn-delete-sos text-red-300 hover:text-red-600 transition-colors shrink-0 px-2 py-1" data-id="${alert.id}" title="ë©”ì‹œì§€ ?? œ">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                ` : ''}
            </div>
        `).join('');

        // ?? œ ?´ë²¤??ë¦¬ìŠ¤??ë°”ì¸??(ê´€ë¦¬ì??
        if (isAdmin) {
            historyContainer.querySelectorAll('.btn-delete-sos').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.dataset.id;
                    if (confirm('??ê¸´ê¸‰ ?Œë¦¼ ë©”ì‹œì§€ë¥??? œ?˜ì‹œê² ìŠµ?ˆê¹Œ? (?? œ ??ê¸°ë¡?ì„œ ?¬ë¼ì§‘ë‹ˆ??')) {
                        await this.deleteAlert(id);
                    }
                });
            });
        }
    },
    
    async deleteAlert(id) {
        if (!AppState.supabase) {
            alert('[Mock] ë©”ì‹œì§€ê°€ ?? œ?˜ì—ˆ?µë‹ˆ??');
            this.loadHistory();
            return;
        }

        showLoading(true);
        const { error } = await AppState.supabase
            .from('sos_alerts')
            .delete()
            .eq('id', id);
            
        showLoading(false);
        if (error) {
            alert('?? œ ?¤íŒ¨: ' + error.message);
        } else {
            this.loadHistory();
        }
    },

    setupRealtime() {
        if (!AppState.supabase || window._sosRealtimeInitialized) return;
        
        window._sosRealtimeInitialized = true;
        
        // Listen to inserts on sos_alerts table
        AppState.supabase
            .channel('public:sos_alerts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_alerts' }, payload => {
                this.showSOSAlert(payload.new.message);
                // ?„ì¬ ë·°ê? sosë©?ëª©ë¡ ê°±ì‹ 
                if (window.AppRouter && window.AppRouter.currentModule === 'sos') {
                    this.loadHistory();
                }
            })
            .subscribe();
            
        // SOS ?ì—… ?«ê¸° ?´ë²¤???±ë¡
        const btnClose = document.getElementById('btn-close-sos');
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                document.getElementById('sos-alert-container').classList.add('hidden');
            });
        }
        
        // ?¤ë” SOS ë°œì†¡ ë²„íŠ¼ ?´ë²¤???±ë¡ (ê´€ë¦¬ì???¨ì¶• ë²„íŠ¼)
        const btnTrigger = document.getElementById('btn-sos-trigger');
        if (btnTrigger) {
            // ì¤‘ë³µ ë°”ì¸??ë°©ì?
            const newBtnTrigger = btnTrigger.cloneNode(true);
            btnTrigger.parentNode.replaceChild(newBtnTrigger, btnTrigger);
            
            newBtnTrigger.addEventListener('click', () => {
                window.AppRouter.navigate('sos');
            });
        }
    },

    showSOSAlert(message) {
        const container = document.getElementById('sos-alert-container');
        const msgEl = document.getElementById('sos-alert-message');
        
        msgEl.textContent = message;
        container.classList.remove('hidden');
        
        // ì§„ë™ ?¨ê³¼ (ì§€??ê¸°ê¸°)
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 500]);
        }
    }
};

