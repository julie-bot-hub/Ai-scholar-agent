# AI Scholar Agent 프로젝트 핵심 정리

## 1. 목적
이 문서는 팀원 아이디어 문서 5종과 학술지 목록 xlsx를 통합해, 팀 프로젝트의 공통 핵심 아이디어를 하나의 실행 가능한 설계안으로 정리한 결과물이다. 최종 목표는 **대학원생을 위한 신뢰 기반 논문 탐색·검증·비교 에이전트**를 만드는 것이다.

## 2. 문서 통합 결과: 공통 핵심 아이디어
- 연구 주제와 관련된 논문을 단순 추천하는 것이 아니라, 실제 존재 여부와 저널 품질까지 검증하는 신뢰 기반 탐색 시스템을 만든다.
- 검색 범위를 아무 논문이 아니라 사전에 정의된 상위 학술지 목록으로 제한해 환각과 품질 편차를 줄인다.
- 결과물은 논문 목록에서 끝나지 않고, 사용자 연구와의 공통점·차별점·research gap까지 자동 비교해야 한다.
- 멀티 에이전트 구조를 통해 검색, 검증, 랭킹, 비교, 비평 단계를 분리하고 self-correction 루프를 둔다.
- 단일 LLM baseline 대비 DOI 유효성, top journal precision, 관련성, 보고서 품질 측면에서 우수함을 보여주는 평가 설계가 필요하다.

## 3. 문서별 공통 근거
- 에이전트 구조는 일회성 응답보다 Critic 기반 재검토 루프가 있는 순차 파이프라인이 가장 현실적이라는 합의가 보였다.
- 프로젝트 차별점은 일반 논문 검색이 아니라 top-journal-aware literature review assistant라는 포지셔닝에 있다.
- 확장안에서는 DB/스토리지/MCP를 붙일 수 있지만, 현재 단계에서는 메타데이터 중심 MVP부터 구현하는 것이 현실적이다.

## 4. 최종 프로젝트 정의
**프로젝트 한 줄 정의**  
제공된 경영대학 학술지 목록 안에서만 논문을 탐색하고, DOI 및 메타데이터 검증을 거쳐, 사용자 연구와의 공통점·차별점·research gap까지 정리해 주는 신뢰 기반 멀티 에이전트 시스템

### 왜 이 주제가 적합한가
- 대학원생은 ChatGPT, Google Scholar, Web of Science, Scopus를 오가며 문헌을 찾지만, 환각 논문 추천과 DOI 오류 때문에 검증 비용이 크다.
- 교수자 평가 기준상 단순 검색기가 아니라 Agent 아키텍처와 평가 벤치마크가 드러나는 시스템이 필요하다.
- 따라서 프로젝트의 핵심 문제는 '신뢰 가능한 상위 학술지 논문만 빠르게 탐색·검증·비교해 주는 연구 보조 Agent'를 만드는 것이다.

### 이번 프로젝트의 명시적 제약
- 검색 대상 저널은 반드시 제공된 xlsx 학술지 목록에 포함된 저널로만 제한한다.
- 논문 메타데이터는 OpenAlex, Crossref, Semantic Scholar 같은 공개 메타데이터 API로 수집한다.
- PDF 확보는 Open Access 범위에서만 허용하고, paywall 우회 다운로드는 금지한다.
- 추천 결과는 DOI, 저널명, 연도, 저자, 관련성의 최소 검증을 통과해야 한다.

## 5. 추천 시스템 아키텍처
1. **Planner Agent**: 사용자 연구 주제/초록을 받아 키워드, 하위 질문, 학문 분야 후보를 생성한다.
2. **Journal Selector Agent**: xlsx 학술지 목록에서 해당 분야 컬럼의 허용 저널 집합을 선택한다.
3. **Retriever Agent**: 허용 저널 집합과 키워드 조건을 결합해 OpenAlex/Crossref/Semantic Scholar에서 후보 논문을 수집한다.
4. **Verifier Agent**: DOI resolve 여부, 저널명 일치, 연도/저자 기본 일치 여부를 검증해 환각 후보를 제거한다.
5. **Ranker Agent**: 관련성, 저널 등급, 인용 수, 최신성으로 최종 점수를 계산한다.
6. **Comparator Agent**: 추천 논문과 사용자 연구 간 공통점, 차별점, research gap을 구조화해 생성한다.
7. **Critic Agent**: 검증 누락, 낮은 관련성, 저널 매칭 오류를 체크하고 필요 시 Retriever/Ranker 재실행을 요청한다.
8. **Report Agent**: 최종 논문 리스트, 비교 결과, 평가 로그를 Markdown/PDF/Excel 형태로 정리한다.

## 6. 저널 범위 설계
검색 대상은 xlsx에 있는 학술지로만 제한한다. 초기 MVP에서는 모든 분야를 한 번에 다루기보다, 연구 주제와 연관성이 높은 분야 컬럼을 1~3개 선택해 검색 범위를 좁히는 것이 적절하다.

### 공통
- Management Science
- Harvard Business Review
- MIT Sloan Management Review
- California Management Review
- Journal of Business Research
- Journal of Business Ethics
- 경영학연구

### 마케팅
- Journal of Marketing Research
- Journal Consumer Research
- Marketing Science
- Journal of Marketing
- Journal of Retailing
- Journal of Product Innovation Management
- Journal of Consumer Psychology
- Journal of the Academy of Marketing Science

### 경영정보
- MIS Quarterly
- Information Systems Research
- Journal Management information Systems
- IEEE Transactions on Engineering Management
- Information & Management
- Communications of the ACM (research article only)
- Decision Support System
- Journal of AIS

### 조직․인사
- Academy of Management Review
- Academy of Management Journal
- Administrative Science Quarterly
- Strategic Management Journal
- Journal of Management
- Personnel Psychology
- Journal of Applied Psychology
- Organization Science

### 무역/국제경영
- Journal of International Business Studies
- Journal of World Business
- Supply Chain Management: An international Journal
- International Journal of Management Reviews
- Journal of International Management
- Journal of International Marketing
- Journal of Risk and Uncertainty
- British Journal of Management

## 7. 데이터 흐름
1. 사용자가 연구 주제 또는 초록을 입력한다.
2. Planner가 키워드와 학문 분야 후보를 생성한다.
3. Journal Selector가 xlsx 허용 저널 집합을 확정한다.
4. Retriever가 허용 저널 조건으로 논문 후보를 수집한다.
5. Verifier가 DOI/저널명/연도/저자를 검증한다.
6. Ranker가 관련성, 저널 수준, 인용 수, 최신성 기준으로 정렬한다.
7. Comparator가 공통점, 차별점, research gap을 생성한다.
8. Critic이 오류를 점검하고 재검색이 필요하면 loop를 수행한다.
9. Report Agent가 Markdown/PDF/Excel 산출물을 만든다.

## 8. 평가 벤치마크 설계
- Baseline 1: 단일 LLM에게 '관련 top journal 논문 5편 추천'을 직접 요청한다.
- Baseline 2: 키워드 기반 API 검색 후 인용 수 정렬만 수행한다.
- Proposed: 허용 저널 목록 제한 + DOI 검증 + 랭킹 + 비교 + Critic 루프를 포함한 멀티 에이전트 구조.
- 권장 평가지표: Paper Validity Rate, Top Journal Precision, Relevance Score, Hallucination Rate, Comparison Quality, Latency, Cost.
- 권장 평가 데이터: 연구 키워드/질문 20개 이상, 각 키워드당 Top 5 추천 결과를 human evaluation rubric으로 채점.

## 9. 구현 로드맵
- 1단계 MVP: 키워드 입력 -> 허용 저널 선정 -> 논문 후보 검색 -> DOI 검증 -> Top 5 출력
- 2단계 품질화: 저널명 정규화, 관련성 점수, citation/recency 랭킹 추가
- 3단계 비교 기능: 공통점/차별점/research gap 생성
- 4단계 산출물: Markdown/PDF/Excel 보고서 자동 생성
- 5단계 고도화: Critic self-correction, 캐시/DB, MCP 도구 연결, 데모 UI

## 10. 지금 당장 권장하는 MVP 범위
- 검색 입력은 연구 키워드 1개 또는 짧은 초록 1개로 제한한다.
- 데이터 소스는 OpenAlex + Crossref 조합으로 시작한다.
- 저널 필터는 xlsx 목록의 마케팅, 경영정보, 조직·인사처럼 핵심 분야 2~3개부터 적용한다.
- 비교 결과는 공통점 2개, 차별점 2개, research gap 1개로 고정 포맷화한다.
- 베이스라인은 단일 LLM 응답과 keyword-only 검색 결과 두 가지로 둔다.

## 11. 설계 결론
여러분 팀의 아이디어를 하나로 합치면, 가장 강한 방향은 **“많이 찾아주는 AI”가 아니라 “허용된 상위 저널 안에서 실제 존재하는 논문만 골라 내 연구와 연결해 주는 신뢰 기반 AI Scholar Agent”**이다.  
특히 이번 과제에서는 xlsx 학술지 목록을 공식 journal universe로 삼는 것이 매우 중요하다. 이 제약이 있어야 품질 기준, 평가 기준, 시스템 설계 기준이 동시에 선명해진다.
