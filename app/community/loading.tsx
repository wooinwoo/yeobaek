// 첫 요청이 DB를 기다리는 동안 빈 화면 대신 글 목록 자리를 먼저 보여준다.
export default function CommunityLoading() {
  return (
    <div className="pt-24 pb-20 px-5 md:px-8" aria-busy="true">
      <div className="max-w-[1120px] mx-auto">
        <h1 className="font-serif text-[26px] md:text-5xl font-semibold text-on-surface mb-3">마음을 나누는 공간</h1>
        <p className="text-lg text-on-surface-variant mb-8 max-w-2xl">
          익명으로 고민을 나누고 서로에게 위로가 되어주는 따뜻한 커뮤니티입니다. 어떤 이야기든 편하게 남겨주세요.
        </p>
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
          <div className="flex flex-col gap-4" role="status">
            <span className="sr-only">이야기를 불러오고 있어요.</span>
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant motion-safe:animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-surface-variant" />
                  <span className="h-3 w-24 rounded bg-surface-variant" />
                </div>
                <div className="h-4 w-2/3 rounded bg-surface-variant mb-3" />
                <div className="h-3 w-full rounded bg-surface-container mb-2" />
                <div className="h-3 w-5/6 rounded bg-surface-container" />
              </div>
            ))}
          </div>
          <div className="hidden lg:block bg-surface-container-lowest rounded-xl h-48 border border-outline-variant" />
        </div>
      </div>
    </div>
  );
}
