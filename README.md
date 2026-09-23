# 두부 레시피 관리

콩 1말(8kg) 기준 두부 제조 레시피를 관리하는 정적 웹앱입니다. (HTML + CSS + JS, 빌드 없음)

## 기능
- **표준 레시피 (읽기 전용)**: 리서치 기반 1말 기준 표준 공정·재료·응고제별 사용량·목표값(Brix, 응고 온도 등)·문제 해결
- **연구 레시피**: 표준에서 "🧪 연구 시작" → 복제 후 수정. 편집할 때마다 버전이 올라가고 변경 사유가 **연구 이력**에 남음
- **제조 기록**: 날짜·실험 변수·불림·Brix·응고 온도·응고제·수율·평가 기록, 수율비 통계
- **최적 조건 지정**: 레시피별 시험 제조 비교표에서 가장 좋은 기록을 🏆 최적으로 지정
- **배합 계산기**: 콩 양(2/4/8/16kg 등)에 맞춰 재료·응고제 비례 계산
- **백업**: JSON 내보내기/가져오기 (데이터는 브라우저 localStorage에 저장)

## 파일 구성
| 파일 | 설명 |
|---|---|
| `index.html`, `style.css`, `app.js` | 앱 |
| `data/standard-recipes.js` | 표준 레시피 데이터 (여기를 고치면 모든 사용자에게 반영) |
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
