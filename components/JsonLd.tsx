// 구조화 데이터(JSON-LD)를 <script type="application/ld+json">로 렌더한다.
// dangerouslySetInnerHTML를 쓰되, 입력은 전부 코드에서 만든 정적 객체라 사용자 입력이 섞이지 않는다.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify 결과의 위험 문자를 이스케이프한다.
      //  "<" : </script> 조기 종료 방지
      //  ">" : "]]>" 등 시퀀스 차단
      //  "&" : HTML 엔티티 오해석 방지
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
          .replace(/</g, "\\u003c")
          .replace(/>/g, "\\u003e")
          .replace(/&/g, "\\u0026"),
      }}
    />
  );
}
