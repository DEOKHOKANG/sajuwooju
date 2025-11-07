# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "뒤로 가기" [ref=e5] [cursor=pointer]:
          - /url: /menu
          - button "뒤로 가기" [ref=e6]:
            - img [ref=e7]
        - heading "내 쿠폰" [level=1] [ref=e9]
    - main [ref=e10]:
      - generic [ref=e11]:
        - button "사용가능 (2)" [ref=e12] [cursor=pointer]
        - button "만료됨 (1)" [active] [ref=e13] [cursor=pointer]
      - generic [ref=e16]:
        - generic [ref=e18]:
          - generic [ref=e19]: 5,000원
          - generic [ref=e20]: 생일 축하 쿠폰
          - generic [ref=e21]: 전체 상품 5,000원 할인
        - generic [ref=e22]: "유효기간: 2024.10.31까지"
  - button "Open Next.js Dev Tools" [ref=e28] [cursor=pointer]:
    - img [ref=e29]
  - alert [ref=e32]
```