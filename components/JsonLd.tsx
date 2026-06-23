// 구조화 데이터(JSON-LD)를 <script type="application/ld+json">로 렌더한다.
// dangerouslySetInnerHTML를 쓰되, 입력은 전부 코드에서 만든 정적 객체라 사용자 입력이 섞이지 않는다.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify 결과의 "<"를 이스케이프해 </script> 조기 종료를 막는다.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
