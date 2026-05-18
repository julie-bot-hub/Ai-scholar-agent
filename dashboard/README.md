# AI Scholar Agent Dashboard

정적 HTML/CSS 대시보드입니다. 브라우저에서 `dashboard/index.html`을 직접 열어 확인할 수 있고, Cloudflare Pages에 그대로 배포할 수 있습니다.

## Cloudflare Pages 배포

1. GitHub에 이 저장소를 push합니다.
2. Cloudflare Dashboard에서 **Workers & Pages**로 이동합니다.
3. **Create application** -> **Pages** -> **Connect to Git**를 선택합니다.
4. `julie-bot-hub/Ai-scholar-agent` 저장소를 선택합니다.
5. Build settings를 다음처럼 설정합니다.

```text
Framework preset: None
Build command: 비워둠
Build output directory: dashboard
Root directory: /
```

6. **Save and Deploy**를 누르면 Cloudflare가 `dashboard/index.html`을 사이트 루트로 배포합니다.

## 나중에 실제 검색 UI로 확장하려면

현재 화면은 기존 리포트 결과를 보여주는 정적 데모입니다. 사용자가 주제를 입력하고 서버에서 `npm run dev -- "topic"`을 실행하게 하려면 Cloudflare Pages만으로는 부족하고, 다음 중 하나가 필요합니다.

- Cloudflare Workers API + 별도 Node 실행 환경
- Cloudflare Pages 프론트엔드 + Render/Fly.io/Railway 같은 Node 서버
- 검색 결과를 미리 JSON으로 생성한 뒤 Pages가 정적 JSON을 읽는 방식

MVP 발표용이면 정적 Pages 배포가 가장 빠르고 안정적입니다.
