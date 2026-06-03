-- 1. users 테이블 (사용자 프로필 및 권한)
-- Supabase의 auth.users 테이블과 연동되어 추가 정보를 저장합니다.
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 2. sos_alerts 테이블 (실시간 SOS 및 긴급 알림)
CREATE TABLE public.sos_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    level TEXT DEFAULT 'danger' CHECK (level IN ('info', 'warning', 'danger')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 3. suggestions 테이블 (건의사항 & 질문하기)
CREATE TABLE public.suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 4. suggestion_comments 테이블 (건의사항 답변 및 댓글)
CREATE TABLE public.suggestion_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    suggestion_id UUID REFERENCES public.suggestions(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 5. meeting_minutes 테이블 (무정전회의록)
CREATE TABLE public.meeting_minutes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    file_url TEXT,
    meeting_date DATE NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 6. feedbacks 테이블 (안전자료 피드백)
CREATE TABLE public.feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    target_type TEXT NOT NULL CHECK (target_type IN ('meeting', 'notice', 'case')),
    target_id UUID NOT NULL, -- 연관된 아이템의 ID
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 7. notices 테이블 (안전공지사항 & 교육자료실)
CREATE TABLE public.notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT DEFAULT 'notice' CHECK (category IN ('notice', 'education')),
    drive_link TEXT, -- 구글 드라이브 대용량 공유 링크
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 8. cases 테이블 (안전사고사례 & 우수사례)
CREATE TABLE public.cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'accident' CHECK (category IN ('accident', 'best_practice')),
    image_url TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- ==============================================================================
-- [Row Level Security (RLS) Policies]
-- 데이터 보안을 위해 테이블별 읽기/쓰기 권한을 설정합니다.
-- ==============================================================================

-- RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestion_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_minutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- users 정책: 로그인한 사용자는 모든 프로필을 볼 수 있음 (작성자 이름 표시 용도)
CREATE POLICY "Users are viewable by authenticated users" ON public.users FOR SELECT USING (auth.role() = 'authenticated');
-- 자기 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- sos_alerts 정책: 누구나 볼 수 있음, admin만 생성 가능 (이 정책은 admin 여부를 db function이나 role로 체크해야 함. 간소화 위해 authenticated면 생성 가능하게 하되, 프론트에서 UI 막음. 엄격하게 하려면 user.role = 'admin' 체크 필요)
CREATE POLICY "SOS viewable by everyone" ON public.sos_alerts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "SOS insertable by admin" ON public.sos_alerts FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- suggestions 정책: 누구나 보고 쓸 수 있음. 수정/삭제는 작성자와 admin만.
CREATE POLICY "Suggestions viewable by everyone" ON public.suggestions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Suggestions insertable by users" ON public.suggestions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Suggestions updateable by author or admin" ON public.suggestions FOR UPDATE USING (
    auth.uid() = author_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- comments: 누구나 보고 쓸 수 있음.
CREATE POLICY "Comments viewable by everyone" ON public.suggestion_comments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Comments insertable by users" ON public.suggestion_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- meetings, notices, cases: 누구나 볼 수 있음. 생성/수정/삭제는 admin만 가능.
CREATE POLICY "Meetings viewable by everyone" ON public.meeting_minutes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Meetings insertable by admin" ON public.meeting_minutes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Notices viewable by everyone" ON public.notices FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Notices insertable by admin" ON public.notices FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Cases viewable by everyone" ON public.cases FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Cases insertable by admin" ON public.cases FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- feedbacks: 누구나 작성 가능.
CREATE POLICY "Feedbacks viewable by everyone" ON public.feedbacks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Feedbacks insertable by users" ON public.feedbacks FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Realtime 연동을 위한 Publication 설정 (sos_alerts는 실시간 감지 필요)
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_alerts;
