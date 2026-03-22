/**
 * 주소 기반 도시(city) 분류기
 *
 * 카카오 API address_name에서 시 단위 city 값을 추출한다.
 * 규칙:
 *   - 특별시/광역시 → 해당 시 이름 (서울특별시 → SEOUL)
 *   - 도 → 하위 시/군 이름 (경기도 파주시 → PAJU)
 */

/** 특별시/광역시 → 영문 city 매핑 */
const METRO_CITY_MAP: Record<string, string> = {
  서울특별시: "SEOUL",
  서울: "SEOUL",
  부산광역시: "BUSAN",
  부산: "BUSAN",
  인천광역시: "INCHEON",
  인천: "INCHEON",
  대구광역시: "DAEGU",
  대구: "DAEGU",
  대전광역시: "DAEJEON",
  대전: "DAEJEON",
  광주광역시: "GWANGJU",
  광주: "GWANGJU",
  울산광역시: "ULSAN",
  울산: "ULSAN",
  세종특별자치시: "SEJONG",
  세종: "SEJONG",
};

/**
 * 도+시/군 조합 매핑 — 동명이군(고성군 등) 구분을 위해 "도|시군" 키 사용
 * 도 축약형도 포함 (경기|파주시, 경기도|파주시 둘 다 매칭)
 */
const PROVINCE_CITY_MAP: Record<string, string> = {
  // 경기도
  "경기도|파주시": "PAJU", "경기|파주시": "PAJU",
  "경기도|고양시": "GOYANG", "경기|고양시": "GOYANG",
  "경기도|수원시": "SUWON", "경기|수원시": "SUWON",
  "경기도|성남시": "SEONGNAM", "경기|성남시": "SEONGNAM",
  "경기도|용인시": "YONGIN", "경기|용인시": "YONGIN",
  "경기도|화성시": "HWASEONG", "경기|화성시": "HWASEONG",
  "경기도|안양시": "ANYANG", "경기|안양시": "ANYANG",
  "경기도|안산시": "ANSAN", "경기|안산시": "ANSAN",
  "경기도|평택시": "PYEONGTAEK", "경기|평택시": "PYEONGTAEK",
  "경기도|시흥시": "SIHEUNG", "경기|시흥시": "SIHEUNG",
  "경기도|김포시": "GIMPO", "경기|김포시": "GIMPO",
  "경기도|광명시": "GWANGMYEONG", "경기|광명시": "GWANGMYEONG",
  "경기도|하남시": "HANAM", "경기|하남시": "HANAM",
  "경기도|군포시": "GUNPO", "경기|군포시": "GUNPO",
  "경기도|의왕시": "UIWANG", "경기|의왕시": "UIWANG",
  "경기도|오산시": "OSAN", "경기|오산시": "OSAN",
  "경기도|이천시": "ICHEON", "경기|이천시": "ICHEON",
  "경기도|여주시": "YEOJU", "경기|여주시": "YEOJU",
  "경기도|양평군": "YANGPYEONG", "경기|양평군": "YANGPYEONG",
  "경기도|가평군": "GAPYEONG", "경기|가평군": "GAPYEONG",
  "경기도|포천시": "POCHEON", "경기|포천시": "POCHEON",
  "경기도|동두천시": "DONGDUCHEON", "경기|동두천시": "DONGDUCHEON",
  "경기도|양주시": "YANGJU", "경기|양주시": "YANGJU",
  "경기도|의정부시": "UIJEONGBU", "경기|의정부시": "UIJEONGBU",
  "경기도|구리시": "GURI", "경기|구리시": "GURI",
  "경기도|남양주시": "NAMYANGJU", "경기|남양주시": "NAMYANGJU",
  "경기도|광주시": "GWANGJU_GG", "경기|광주시": "GWANGJU_GG",
  "경기도|부천시": "BUCHEON", "경기|부천시": "BUCHEON",
  "경기도|연천군": "YEONCHEON", "경기|연천군": "YEONCHEON",
  "경기도|과천시": "GWACHEON", "경기|과천시": "GWACHEON",

  // 강원도 (강원특별자치도)
  "강원특별자치도|춘천시": "CHUNCHEON", "강원도|춘천시": "CHUNCHEON", "강원|춘천시": "CHUNCHEON",
  "강원특별자치도|원주시": "WONJU", "강원도|원주시": "WONJU", "강원|원주시": "WONJU",
  "강원특별자치도|강릉시": "GANGNEUNG", "강원도|강릉시": "GANGNEUNG", "강원|강릉시": "GANGNEUNG",
  "강원특별자치도|속초시": "SOKCHO", "강원도|속초시": "SOKCHO", "강원|속초시": "SOKCHO",
  "강원특별자치도|동해시": "DONGHAE", "강원도|동해시": "DONGHAE", "강원|동해시": "DONGHAE",
  "강원특별자치도|삼척시": "SAMCHEOK", "강원도|삼척시": "SAMCHEOK", "강원|삼척시": "SAMCHEOK",
  "강원특별자치도|평창군": "PYEONGCHANG", "강원도|평창군": "PYEONGCHANG", "강원|평창군": "PYEONGCHANG",
  "강원특별자치도|정선군": "JEONGSEON", "강원도|정선군": "JEONGSEON", "강원|정선군": "JEONGSEON",
  "강원특별자치도|양양군": "YANGYANG", "강원도|양양군": "YANGYANG", "강원|양양군": "YANGYANG",
  "강원특별자치도|인제군": "INJE", "강원도|인제군": "INJE", "강원|인제군": "INJE",
  "강원특별자치도|홍천군": "HONGCHEON", "강원도|홍천군": "HONGCHEON", "강원|홍천군": "HONGCHEON",
  "강원특별자치도|횡성군": "HOENGSEONG", "강원도|횡성군": "HOENGSEONG", "강원|횡성군": "HOENGSEONG",
  "강원특별자치도|영월군": "YEONGWOL", "강원도|영월군": "YEONGWOL", "강원|영월군": "YEONGWOL",
  "강원특별자치도|태백시": "TAEBAEK", "강원도|태백시": "TAEBAEK", "강원|태백시": "TAEBAEK",
  "강원특별자치도|철원군": "CHEORWON", "강원도|철원군": "CHEORWON", "강원|철원군": "CHEORWON",
  "강원특별자치도|화천군": "HWACHEON", "강원도|화천군": "HWACHEON", "강원|화천군": "HWACHEON",
  // 고성군 — 강원 vs 경남 구분
  "강원특별자치도|고성군": "GOSEONG_GW", "강원도|고성군": "GOSEONG_GW", "강원|고성군": "GOSEONG_GW",

  // 충청남도
  "충청남도|천안시": "CHEONAN", "충남|천안시": "CHEONAN",
  "충청남도|아산시": "ASAN", "충남|아산시": "ASAN",
  "충청남도|서산시": "SEOSAN", "충남|서산시": "SEOSAN",
  "충청남도|당진시": "DANGJIN", "충남|당진시": "DANGJIN",
  "충청남도|보령시": "BORYEONG", "충남|보령시": "BORYEONG",
  "충청남도|공주시": "GONGJU", "충남|공주시": "GONGJU",
  "충청남도|논산시": "NONSAN", "충남|논산시": "NONSAN",
  "충청남도|계룡시": "GYERYONG", "충남|계룡시": "GYERYONG",
  "충청남도|홍성군": "HONGSEONG", "충남|홍성군": "HONGSEONG",
  "충청남도|예산군": "YESAN", "충남|예산군": "YESAN",
  "충청남도|태안군": "TAEAN", "충남|태안군": "TAEAN",
  "충청남도|부여군": "BUYEO", "충남|부여군": "BUYEO",
  "충청남도|서천군": "SEOCHEON", "충남|서천군": "SEOCHEON",
  "충청남도|청양군": "CHEONGYANG", "충남|청양군": "CHEONGYANG",
  "충청남도|금산군": "GEUMSAN", "충남|금산군": "GEUMSAN",

  // 충청북도
  "충청북도|청주시": "CHEONGJU", "충북|청주시": "CHEONGJU",
  "충청북도|충주시": "CHUNGJU", "충북|충주시": "CHUNGJU",
  "충청북도|제천시": "JECHEON", "충북|제천시": "JECHEON",
  "충청북도|단양군": "DANYANG", "충북|단양군": "DANYANG",
  "충청북도|영동군": "YEONGDONG", "충북|영동군": "YEONGDONG",
  "충청북도|옥천군": "OKCHEON", "충북|옥천군": "OKCHEON",
  "충청북도|보은군": "BOEUN", "충북|보은군": "BOEUN",
  "충청북도|음성군": "EUMSEONG", "충북|음성군": "EUMSEONG",
  "충청북도|진천군": "JINCHEON", "충북|진천군": "JINCHEON",
  "충청북도|증평군": "JEUNGPYEONG", "충북|증평군": "JEUNGPYEONG",
  "충청북도|괴산군": "GOESAN", "충북|괴산군": "GOESAN",

  // 전북특별자치도
  "전북특별자치도|전주시": "JEONJU", "전라북도|전주시": "JEONJU", "전북|전주시": "JEONJU",
  "전북특별자치도|군산시": "GUNSAN", "전라북도|군산시": "GUNSAN", "전북|군산시": "GUNSAN",
  "전북특별자치도|익산시": "IKSAN", "전라북도|익산시": "IKSAN", "전북|익산시": "IKSAN",
  "전북특별자치도|남원시": "NAMWON", "전라북도|남원시": "NAMWON", "전북|남원시": "NAMWON",
  "전북특별자치도|정읍시": "JEONGEUP", "전라북도|정읍시": "JEONGEUP", "전북|정읍시": "JEONGEUP",
  "전북특별자치도|김제시": "GIMJE", "전라북도|김제시": "GIMJE", "전북|김제시": "GIMJE",
  "전북특별자치도|완주군": "WANJU", "전라북도|완주군": "WANJU", "전북|완주군": "WANJU",
  "전북특별자치도|부안군": "BUAN", "전라북도|부안군": "BUAN", "전북|부안군": "BUAN",
  "전북특별자치도|고창군": "GOCHANG", "전라북도|고창군": "GOCHANG", "전북|고창군": "GOCHANG",
  "전북특별자치도|순창군": "SUNCHANG", "전라북도|순창군": "SUNCHANG", "전북|순창군": "SUNCHANG",
  "전북특별자치도|임실군": "IMSIL", "전라북도|임실군": "IMSIL", "전북|임실군": "IMSIL",
  "전북특별자치도|무주군": "MUJU", "전라북도|무주군": "MUJU", "전북|무주군": "MUJU",
  "전북특별자치도|진안군": "JINAN", "전라북도|진안군": "JINAN", "전북|진안군": "JINAN",
  "전북특별자치도|장수군": "JANGSU", "전라북도|장수군": "JANGSU", "전북|장수군": "JANGSU",

  // 전라남도
  "전라남도|목포시": "MOKPO", "전남|목포시": "MOKPO",
  "전라남도|여수시": "YEOSU", "전남|여수시": "YEOSU",
  "전라남도|순천시": "SUNCHEON", "전남|순천시": "SUNCHEON",
  "전라남도|광양시": "GWANGYANG", "전남|광양시": "GWANGYANG",
  "전라남도|나주시": "NAJU", "전남|나주시": "NAJU",
  "전라남도|담양군": "DAMYANG", "전남|담양군": "DAMYANG",
  "전라남도|곡성군": "GOKSEONG", "전남|곡성군": "GOKSEONG",
  "전라남도|구례군": "GURYE", "전남|구례군": "GURYE",
  "전라남도|보성군": "BOSEONG", "전남|보성군": "BOSEONG",
  "전라남도|화순군": "HWASUN", "전남|화순군": "HWASUN",
  "전라남도|장흥군": "JANGHEUNG", "전남|장흥군": "JANGHEUNG",
  "전라남도|강진군": "GANGJIN", "전남|강진군": "GANGJIN",
  "전라남도|해남군": "HAENAM", "전남|해남군": "HAENAM",
  "전라남도|영암군": "YEONGAM", "전남|영암군": "YEONGAM",
  "전라남도|무안군": "MUAN", "전남|무안군": "MUAN",
  "전라남도|함평군": "HAMPYEONG", "전남|함평군": "HAMPYEONG",
  "전라남도|영광군": "YEONGGWANG", "전남|영광군": "YEONGGWANG",
  "전라남도|장성군": "JANGSEONG", "전남|장성군": "JANGSEONG",
  "전라남도|완도군": "WANDO", "전남|완도군": "WANDO",
  "전라남도|진도군": "JINDO", "전남|진도군": "JINDO",
  "전라남도|신안군": "SINAN", "전남|신안군": "SINAN",

  // 경상북도
  "경상북도|포항시": "POHANG", "경북|포항시": "POHANG",
  "경상북도|경주시": "GYEONGJU", "경북|경주시": "GYEONGJU",
  "경상북도|김천시": "GIMCHEON", "경북|김천시": "GIMCHEON",
  "경상북도|안동시": "ANDONG", "경북|안동시": "ANDONG",
  "경상북도|구미시": "GUMI", "경북|구미시": "GUMI",
  "경상북도|영주시": "YEONGJU", "경북|영주시": "YEONGJU",
  "경상북도|영천시": "YEONGCHEON", "경북|영천시": "YEONGCHEON",
  "경상북도|상주시": "SANGJU", "경북|상주시": "SANGJU",
  "경상북도|문경시": "MUNGYEONG", "경북|문경시": "MUNGYEONG",
  "경상북도|경산시": "GYEONGSAN", "경북|경산시": "GYEONGSAN",
  "경상북도|군위군": "GUNWI", "경북|군위군": "GUNWI",
  "경상북도|의성군": "UISEONG", "경북|의성군": "UISEONG",
  "경상북도|청송군": "CHEONGSONG", "경북|청송군": "CHEONGSONG",
  "경상북도|영양군": "YEONGYANG", "경북|영양군": "YEONGYANG",
  "경상북도|영덕군": "YEONGDEOK", "경북|영덕군": "YEONGDEOK",
  "경상북도|청도군": "CHEONGDO", "경북|청도군": "CHEONGDO",
  "경상북도|고령군": "GORYEONG", "경북|고령군": "GORYEONG",
  "경상북도|성주군": "SEONGJU", "경북|성주군": "SEONGJU",
  "경상북도|칠곡군": "CHILGOK", "경북|칠곡군": "CHILGOK",
  "경상북도|예천군": "YECHEON", "경북|예천군": "YECHEON",
  "경상북도|봉화군": "BONGHWA", "경북|봉화군": "BONGHWA",
  "경상북도|울진군": "ULJIN", "경북|울진군": "ULJIN",
  "경상북도|울릉군": "ULLEUNG", "경북|울릉군": "ULLEUNG",

  // 경상남도
  "경상남도|창원시": "CHANGWON", "경남|창원시": "CHANGWON",
  "경상남도|진주시": "JINJU", "경남|진주시": "JINJU",
  "경상남도|통영시": "TONGYEONG", "경남|통영시": "TONGYEONG",
  "경상남도|사천시": "SACHEON", "경남|사천시": "SACHEON",
  "경상남도|김해시": "GIMHAE", "경남|김해시": "GIMHAE",
  "경상남도|밀양시": "MIRYANG", "경남|밀양시": "MIRYANG",
  "경상남도|거제시": "GEOJE", "경남|거제시": "GEOJE",
  "경상남도|양산시": "YANGSAN", "경남|양산시": "YANGSAN",
  "경상남도|의령군": "UIRYEONG", "경남|의령군": "UIRYEONG",
  "경상남도|함안군": "HAMAN", "경남|함안군": "HAMAN",
  "경상남도|창녕군": "CHANGNYEONG", "경남|창녕군": "CHANGNYEONG",
  // 고성군 — 경남 (강원과 구분)
  "경상남도|고성군": "GOSEONG_GN", "경남|고성군": "GOSEONG_GN",
  "경상남도|남해군": "NAMHAE", "경남|남해군": "NAMHAE",
  "경상남도|하동군": "HADONG", "경남|하동군": "HADONG",
  "경상남도|산청군": "SANCHEONG", "경남|산청군": "SANCHEONG",
  "경상남도|함양군": "HAMYANG", "경남|함양군": "HAMYANG",
  "경상남도|거창군": "GEOCHANG", "경남|거창군": "GEOCHANG",
  "경상남도|합천군": "HAPCHEON", "경남|합천군": "HAPCHEON",

  // 제주특별자치도
  "제주특별자치도|제주시": "JEJU", "제주도|제주시": "JEJU", "제주|제주시": "JEJU",
  "제주특별자치도|서귀포시": "SEOGWIPO", "제주도|서귀포시": "SEOGWIPO", "제주|서귀포시": "SEOGWIPO",
};

/** 도 이름 목록 (축약형 포함) */
const PROVINCE_NAMES = new Set([
  "경기도", "경기",
  "강원특별자치도", "강원도", "강원",
  "충청북도", "충북",
  "충청남도", "충남",
  "전북특별자치도", "전라북도", "전북",
  "전라남도", "전남",
  "경상북도", "경북",
  "경상남도", "경남",
  "제주특별자치도", "제주도", "제주",
]);

/**
 * 카카오 API address_name에서 city 코드를 추출
 *
 * @param addressName - 카카오 API의 address_name 또는 road_address_name
 * @returns city 코드 또는 null (분류 실패 시)
 */
export function classifyCity(addressName: string): string | null {
  if (!addressName) return null;

  const parts = addressName.trim().split(/\s+/);
  if (parts.length < 2) return null;

  const first = parts[0];
  const second = parts[1];

  // 1. 특별시/광역시 → 시 이름 반환
  if (METRO_CITY_MAP[first]) {
    return METRO_CITY_MAP[first];
  }

  // 2. 도 하위 → "도|시군" 조합키로 조회
  if (PROVINCE_NAMES.has(first)) {
    const key = `${first}|${second}`;
    if (PROVINCE_CITY_MAP[key]) {
      return PROVINCE_CITY_MAP[key];
    }
    return null;
  }

  return null;
}

/**
 * city 코드에서 한글 도시명 반환 (출력용)
 */
const CITY_KO_MAP: Record<string, string> = {
  SEOUL: "서울",
  BUSAN: "부산",
  INCHEON: "인천",
  DAEGU: "대구",
  DAEJEON: "대전",
  GWANGJU: "광주",
  ULSAN: "울산",
  SEJONG: "세종",
};

// PROVINCE_CITY_MAP에서 역매핑 생성 (중복 방지를 위해 첫 번째만)
const _seen = new Set<string>();
for (const [key, city] of Object.entries(PROVINCE_CITY_MAP)) {
  if (!_seen.has(city)) {
    _seen.add(city);
    const cityName = key.split("|")[1];
    CITY_KO_MAP[city] = cityName.replace(/[시군]$/, "");
  }
}

export function cityToKorean(cityCode: string): string {
  return CITY_KO_MAP[cityCode] || cityCode;
}
