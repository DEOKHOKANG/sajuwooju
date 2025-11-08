# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e7]:
      - img [ref=e8]
    - generic [ref=e11]:
      - button "Open issues overlay" [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: "1"
          - generic [ref=e15]: "2"
        - generic [ref=e16]:
          - text: Issue
          - generic [ref=e17]: s
      - button "Collapse issues badge" [ref=e18]:
        - img [ref=e19]
  - alert [ref=e21]
  - generic [ref=e23]:
    - generic [ref=e24]: ⚠️
    - heading "오류 발생" [level=1] [ref=e25]
    - heading "문제가 발생했습니다" [level=2] [ref=e26]
    - paragraph [ref=e27]:
      - text: 일시적인 오류가 발생했습니다.
      - text: 잠시 후 다시 시도해주세요.
    - paragraph [ref=e29]: Cannot read properties of undefined (reading 'length')
    - generic [ref=e30]:
      - button "다시 시도" [ref=e31] [cursor=pointer]
      - button "홈으로 돌아가기" [ref=e32] [cursor=pointer]
    - paragraph [ref=e34]:
      - text: 문제가 계속되면
      - link "고객센터" [ref=e35] [cursor=pointer]:
        - /url: /support
      - text: 로 문의해주세요.
```