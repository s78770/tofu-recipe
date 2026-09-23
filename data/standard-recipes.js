// 표준 레시피 — research/recipe-8kg.json 기반. 수정하면 모든 사용자에게 반영됩니다.
window.DEFAULT_RECIPES = [
  {
    "name": "전통 간수 두부 (콩 1말 기준)",
    "soyKg": 8,
    "coagulant": "천연간수",
    "ingredients": [
      {
        "name": "백태(대두)",
        "amount": 8,
        "unit": "kg",
        "note": "한국식 1말. 깨진 콩, 벌레 먹은 콩, 돌 제거"
      },
      {
        "name": "불림 물",
        "amount": 32,
        "unit": "L",
        "note": "건콩의 3~5배. 콩이 물에 잠기게. 여름엔 중간에 1회 교체"
      },
      {
        "name": "마쇄·헹굼 물(가수)",
        "amount": 48,
        "unit": "L",
        "note": "건콩의 6배(범위 40~64 L). 갈 때 30~35 L, 솥·비지 헹굼에 나머지. 두유 Brix에 따라 현장에서 조정"
      },
      {
        "name": "들기름(소포용)",
        "amount": 30,
        "unit": "mL",
        "note": "15~45 mL. 끓기 시작할 때 투입. 식품용 소포제는 제품 표시량을 따름"
      },
      {
        "name": "천연간수(액상)",
        "amount": 600,
        "unit": "mL",
        "note": "400~800 mL(콩 1kg당 50~100 mL). 간수 농도 편차가 크므로 현장에 따라 조정"
      },
      {
        "name": "간수 희석용 물",
        "amount": 2,
        "unit": "L",
        "note": "따뜻한 물. 간수의 3~4배"
      }
    ],
    "steps": [
      {
        "title": "선별·세척",
        "minutes": 15,
        "temp": null,
        "detail": "이물질과 불량 콩을 골라내고, 찬물을 3~4회 갈아 주며 비벼 씻는다. 뜨는 콩은 걷어낸다."
      },
      {
        "title": "불림",
        "minutes": 600,
        "temp": "수온 13~18℃ (봄·가을 기준)",
        "detail": "여름(20~25℃) 6~7시간, 봄·가을 10시간, 겨울(5~10℃) 16시간. 불린 무게가 건콩의 2.2~2.3배(약 18kg)이고 갈랐을 때 속이 평평하면 완료."
      },
      {
        "title": "물 빼기·헹굼·계량",
        "minutes": 15,
        "temp": null,
        "detail": "불린 콩 무게를 기록한다(목표 17.6~18.4kg)."
      },
      {
        "title": "마쇄(갈기)",
        "minutes": 45,
        "temp": "40℃ 이하",
        "detail": "찬물 30~35 L를 조금씩 부으며 맷돌 기계로 곱게 간다. 총 가수량은 건콩의 6배(48 L) 기준."
      },
      {
        "title": "콩물 끓이기·소포",
        "minutes": 40,
        "temp": "95~100℃",
        "detail": "바닥을 긁듯이 계속 젓는다. 끓기 시작하면 들기름 30 mL를 넣고, 끓어오른 뒤 약불로 5분(3~10분) 유지한다. 거품은 걷어낸다."
      },
      {
        "title": "비지 짜기",
        "minutes": 30,
        "temp": "약 90℃",
        "detail": "면포나 압착기로 1차로 짜고, 비지에 뜨거운 물 5~8 L를 부어 2차로 짠다. 예상 두유 약 48 L, 젖은 비지 약 11 kg."
      },
      {
        "title": "식히기·Brix 측정",
        "minutes": 12,
        "temp": "75~80℃",
        "detail": "모두부 목표 10~11 °Bx(범위 10~12). 9 미만이면 다음 작업부터 가수를 줄인다."
      },
      {
        "title": "간수 투입",
        "minutes": 5,
        "temp": "75~80℃",
        "detail": "희석 간수를 2~3회로 나눠 넣는다. 1차 60%를 넣고 큰 원을 그리며 8~10회 천천히 젓는다. 2~3분 뒤 순물이 탁하면 나머지를 표면에 뿌린다. 순물이 맑은 연노랑이면 중단한다."
      },
      {
        "title": "응고 대기",
        "minutes": 15,
        "temp": "약 70℃ 보온",
        "detail": "뚜껑을 덮고 휘젓지 않는다(10~20분). 순두부는 이 단계에서 떠낸다."
      },
      {
        "title": "틀에 담기",
        "minutes": 10,
        "temp": null,
        "detail": "적신 면포를 깐 두부판(예: 45×35×10cm, 3~4판)에 순물을 적당히 떠내고 응고물을 고르게 담는다."
      },
      {
        "title": "압착",
        "minutes": 20,
        "temp": null,
        "detail": "처음 5분은 뚜껑판 무게만 싣고, 이후 판당 10~20 kg을 올린다(15~30분). 무게는 현장에 따라 조정."
      },
      {
        "title": "찬물 담금·절단",
        "minutes": 30,
        "temp": "15℃ 이하",
        "detail": "면포째 찬물(여름엔 얼음물)에 20~30분 담가 식힌 뒤 물속에서 모 단위로 자른다."
      }
    ],
    "expectedYieldKg": 24,
    "tips": [
      "불림은 시간보다 무게(건콩의 2.2~2.3배)와 단면 상태로 판단한다.",
      "두유 Brix 10~11이 모두부의 기준이다. 매회 Brix와 가수량을 기록해 다음 작업의 가수량을 보정한다.",
      "응고 온도 70~80℃가 최적이다. 70℃ 이하면 무르고, 80℃ 이상이면 딱딱하고 수율이 낮아진다.",
      "간수는 한 번에 넣지 말고 2~3회로 나눠, 순물이 맑은 연노랑이 되면 멈춘다.",
      "압착은 가볍게 시작해 점점 무겁게 해야 수율과 조직이 좋다.",
      "천연간수는 제품마다 농도가 달라 첫 작업에서는 권장량의 70%만 먼저 넣고 상태를 본다.",
      "비지는 뜨거운 물로 한 번 더 헹궈 짜면 수율이 오른다.",
      "여름엔 불림물을 중간에 교체하고, 두부는 얼음물로 빨리 식혀 10℃ 이하로 보관한다."
    ],
    "troubleshooting": [
      {
        "problem": "안 굳음 / 순물이 탁함",
        "cause": "두유 Brix 9 미만(가수 과다), 간수 부족·약함, 투입 온도 65℃ 미만, 덜 끓임",
        "fix": "희석 간수를 10%씩 추가하고 75℃로 다시 데운다. 다음 작업부터 가수량을 줄인다."
      },
      {
        "problem": "너무 딱딱함 / 퍽퍽함",
        "cause": "간수 과다, 투입 온도 85℃ 초과, 과교반, 과압착",
        "fix": "간수 10~20% 감량, 75℃에 투입, 젓는 횟수 축소, 압착 무게·시간 감소"
      },
      {
        "problem": "쓴맛",
        "cause": "간수(염화마그네슘) 과다, 찬물 담금 부족",
        "fix": "간수를 줄이고 찬물 담금을 30분 이상, 물을 갈아 준다."
      },
      {
        "problem": "탄내 / 누른내",
        "cause": "직화 솥 바닥 눌음, 교반 부족, 센 불",
        "fix": "바닥을 긁으며 계속 젓고 끓기 직전부터 약불로 줄인다. 두꺼운 솥이나 스팀솥을 쓴다."
      },
      {
        "problem": "비린내 / 날콩내",
        "cause": "가열 부족, 마쇄 중 온도 상승",
        "fix": "끓은 뒤 5분 이상 유지하고 찬물로 간다."
      },
      {
        "problem": "신맛 / 쉰내",
        "cause": "여름 과불림, 불림물 부패, 두유 방치",
        "fix": "여름엔 6~7시간 불리고 물을 교체한다. 마쇄 후 즉시 가열한다."
      },
      {
        "problem": "구멍 많고 거친 조직",
        "cause": "거품 혼입, 응고 온도 과고, 급한 투입",
        "fix": "소포를 철저히 하고 거품을 걷는다. 75~80℃에 나눠 넣는다."
      },
      {
        "problem": "수율 저조",
        "cause": "불림 부족, 가수 부족, 비지 2차 짜기 생략",
        "fix": "불림 무게를 확인하고 비지 헹굼 짜기, 가수량을 점검한다."
      },
      {
        "problem": "겨울철 응고 지연",
        "cause": "두유·도구 온도 하강",
        "fix": "응고통을 예열하고 보온 덮개를 쓴다. 투입 온도를 80℃ 쪽으로 올린다."
      }
    ],
    "coagulantOptions": [
      {
        "name": "천연간수/해수간수(액상)",
        "amountPerKgSoy": 75,
        "unit": "mL",
        "dilution": "따뜻한 물로 3~4배 희석. 농도 편차가 커서 현장에 따라 조정(50~100 mL/kg)",
        "addTempC": "75~80"
      },
      {
        "name": "염화마그네슘(6수염 결정)",
        "amountPerKgSoy": 13,
        "unit": "g",
        "dilution": "따뜻한 물에 약 5~7%로 완전 용해(8kg 기준 104 g을 물 1.5~2 L에). 범위 11~15 g/kg",
        "addTempC": "70~75"
      },
      {
        "name": "황산칼슘(석고)",
        "amountPerKgSoy": 18,
        "unit": "g",
        "dilution": "물 약 10배에 현탁(8kg 기준 144 g을 물 1~1.5 L에). 투입 직전 저어 줌. 범위 15~25 g/kg",
        "addTempC": "80~85"
      },
      {
        "name": "GDL(글루코노델타락톤)",
        "amountPerKgSoy": 15,
        "unit": "g",
        "dilution": "찬물에 투입 직전 용해(8kg 기준 120 g을 물 0.5~1 L에). 범위 12~18 g/kg",
        "addTempC": "85~90 (연두부는 15~17℃ 냉두유에 혼합 후 재가열)"
      }
    ],
    "sources": [
      "https://m.cafe.daum.net/touch108/6G6S/10",
      "https://www.thinkfood.co.kr/news/articleView.html?idxno=34596",
      "https://www.thinkfood.co.kr/news/articleView.html?idxno=34687",
      "https://patents.google.com/patent/KR20080036319A/ko",
      "https://patents.google.com/patent/WO2019209016A1/ko",
      "https://www.imaeil.com/page/view/2012112214085539624",
      "https://www.bizjoongang.co.kr/news/articleView.html?idxno=17465",
      "https://www.nongmin.com/article/20111121011240",
      "https://www.ib612.com/2025/10/homemade-tofu-recipe-nigari-ratio-guide.html",
      "https://www.foodtoday.or.kr/news/article.html?no=161650",
      "http://www.fsnews.co.kr/news/articleView.html?idxno=1660",
      "http://taejingns.com/bbs/board.php?bo_table=tech&wr_id=22",
      "https://blog.pulmuone.com/1797"
    ],
    "id": "std-ganssu-8kg",
    "targets": {
      "soakHours": "여름 6~7h / 봄가을 10h / 겨울 16h",
      "brix": "10~11",
      "coagTempC": "75~80℃ (간수)",
      "restMinutes": "15분",
      "pressMinutes": "5분 + 20분",
      "yieldRatio": "×3.0 (2.5~3.5)"
    }
  }
];
