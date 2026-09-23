# 두부 카세 레시피 관리

콩 1말(8kg) 기준 두부 제조 레시피를 관리하는 정적 웹앱입니다. (HTML + CSS + JS, 빌드 없음)

## 기능
- **표준 레시피 3종 (읽기 전용)**: 부드러운 두부 · 시장 판두부 · 단단한 전통 손두부. 리서치 기반 1말 기준 공정·재료·응고제·목표값·문제 해결, 3종 한눈에 비교
- **그림 레시피**: 공정별 일러스트 카드, 공정 흐름도, 재료 카드, 경도 표시. 상세 표 보기와 전환
- **작업 모드**: 한 단계씩 크게 보여 주고 타이머(알람·진동), 화면 꺼짐 방지
- **연구 레시피**: 표준에서 "🧪 연구 시작" → 복제 후 수정. 편집할 때마다 버전이 올라가고 변경 사유가 **연구 이력**에 남음
- **제조 기록**: 날짜·실험 변수·불림·Brix·응고 온도·응고제·수율·평가 기록, 수율비 통계
- **최적 조건 지정**: 레시피별 시험 제조 비교표에서 가장 좋은 기록을 🏆 최적으로 지정
- **연구 노하우**: 분류·검증 상태(가설/검증 중/검증됨/효과 없음)·태그로 요령과 실패 원인을 기록하고 검색. 레시피·제조 기록과 연결
- **배합 계산기**: 콩 양(2/4/8/16kg 등)에 맞춰 재료·응고제 비례 계산
- **백업**: JSON 내보내기/가져오기 (Supabase 미설정 시 브라우저 localStorage에 저장)
- **팀 클라우드**: 별도 Supabase 프로젝트의 Auth + PostgreSQL/Realtime 동기화

## PC · 안드로이드
- PC는 상단 탭, 휴대폰은 하단 탭바와 카드형 표로 자동 전환
- 앱 설치(PWA): 안드로이드 크롬 메뉴 → 홈 화면에 추가, PC 크롬·엣지 주소창의 설치 아이콘. 설치하면 전체 화면으로 열리고 오프라인에서도 동작

## 파일 구성
| 파일 | 설명 |
|---|---|
| `index.html`, `style.css`, `app.js` | 앱 |
| `data/standard-recipes.js` | 표준 레시피 데이터 (여기를 고치면 모든 사용자에게 반영) |
| `manifest.webmanifest`, `sw.js`, `icons/` | 앱 설치·오프라인 |
| `illustrations.js` | 공정 일러스트(SVG) |
| `supabase-config.js`, `sync.js`, `supabase-schema.sql` | 두부 전용 Supabase 로그인·동기화·보안 정책 |
| `research/recipe-3types.md` | 두부 3종 비교 리서치 원문 |
| `research/recipe-8kg.md` | 1말 기준 두부 제조 리서치 원문 (초기) |

## 두부 전용 Supabase 설정

1. Supabase에서 **새 프로젝트**를 별도로 만듭니다. MESIN_DAO 프로젝트는 선택하지 않습니다.
2. 새 프로젝트의 SQL Editor에서 `supabase-schema.sql`을 실행합니다.
3. Authentication → Providers에서 Email 로그인을 활성화합니다.
4. 새 프로젝트의 URL과 anon key만 `supabase-config.js`에 입력합니다.
5. Authentication → URL Configuration에 배포 주소를 추가합니다.

새 프로젝트의 이메일 계정으로 로그인하면 두부 레시피 전용 데이터만 저장됩니다. 설정 전에는 기존처럼 기기 내부 저장만 사용합니다.

## 로컬 실행

정적 서버가 필요합니다. 예를 들어 VS Code Live Server를 사용하거나, Node가 있다면 프로젝트 폴더에서 `npx serve .`를 실행한 뒤 표시된 주소로 접속합니다.

## GitHub Pages 배포
```bash
git remote add origin https://github.com/<계정>/tofu-recipe.git
git push -u origin main
```
GitHub 저장소 → Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `(root)` → 저장.
잠시 후 `https://<계정>.github.io/tofu-recipe/` 에서 접속됩니다.
