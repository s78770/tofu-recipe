# 두부 레시피 관리

콩 1말(8kg) 기준 두부 제조 레시피를 관리하는 정적 웹앱입니다. (HTML + CSS + JS, 빌드 없음)

## 기능
- **표준 레시피 (읽기 전용)**: 리서치 기반 1말 기준 표준 공정·재료·응고제별 사용량·목표값(Brix, 응고 온도 등)·문제 해결
- **연구 레시피**: 표준에서 "🧪 연구 시작" → 복제 후 수정. 편집할 때마다 버전이 올라가고 변경 사유가 **연구 이력**에 남음
- **제조 기록**: 날짜·실험 변수·불림·Brix·응고 온도·응고제·수율·평가 기록, 수율비 통계
- **최적 조건 지정**: 레시피별 시험 제조 비교표에서 가장 좋은 기록을 🏆 최적으로 지정
- **연구 노하우**: 분류·검증 상태(가설/검증 중/검증됨/효과 없음)·태그로 요령과 실패 원인을 기록하고 검색. 레시피·제조 기록과 연결
- **배합 계산기**: 콩 양(2/4/8/16kg 등)에 맞춰 재료·응고제 비례 계산
- **백업**: JSON 내보내기/가져오기 (데이터는 브라우저 localStorage에 저장)

## PC · 안드로이드
- PC는 상단 탭, 휴대폰은 하단 탭바와 카드형 표로 자동 전환
- 앱 설치(PWA): 안드로이드 크롬 메뉴 → 홈 화면에 추가, PC 크롬·엣지 주소창의 설치 아이콘. 설치하면 전체 화면으로 열리고 오프라인에서도 동작

## 파일 구성
| 파일 | 설명 |
|---|---|
| `index.html`, `style.css`, `app.js` | 앱 |
| `data/standard-recipes.js` | 표준 레시피 데이터 (여기를 고치면 모든 사용자에게 반영) |
| `manifest.webmanifest`, `sw.js`, `icons/` | 앱 설치·오프라인 |
| `research/recipe-8kg.md` | 1말 기준 두부 제조 리서치 원문 |

## 로컬 실행
`index.html`을 브라우저로 열면 됩니다.

## GitHub Pages 배포
```bash
git remote add origin https://github.com/<계정>/tofu-recipe.git
git push -u origin main
```
GitHub 저장소 → Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `(root)` → 저장.
잠시 후 `https://<계정>.github.io/tofu-recipe/` 에서 접속됩니다.
