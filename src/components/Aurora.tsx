/** Ambient animated background: drifting colour blobs, grain and a vignette. */
export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -top-[18%] -left-[15%] size-[78vmax] rounded-full bg-[radial-gradient(circle,rgba(247,201,72,0.22),transparent_62%)] blur-[44px] [animation:drift-a_24s_ease-in-out_infinite]" />
      <div className="absolute -right-[22%] top-[12%] size-[62vmax] rounded-full bg-[radial-gradient(circle,rgba(255,69,58,0.14),transparent_62%)] blur-[44px] [animation:drift-b_28s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-24%] left-[8%] size-[68vmax] rounded-full bg-[radial-gradient(circle,rgba(47,158,255,0.16),transparent_62%)] blur-[44px] [animation:drift-a_32s_ease-in-out_infinite_reverse]" />
      <div className="grain absolute inset-0 opacity-[0.35] mix-blend-soft-light" />
      <div className="absolute inset-0 bg-[radial-gradient(125%_85%_at_50%_-12%,transparent_30%,rgba(7,7,8,0.55)_72%,#070708_100%)]" />
    </div>
  );
}
