import UserCard from "./UserCard";

export default function CardStack({ profiles, onDecision }) {
  return (
    <div className="px-8 pb-12 pt-16">
      <div className="relative isolate mx-auto w-full max-w-sm">
        {profiles.slice(1, 3).map((profile, index) => (
          <div
            key={profile._id}
            aria-hidden="true"
            className={`card pointer-events-none absolute inset-0 max-h-[28rem] overflow-hidden border border-base-content/20 bg-base-200 shadow-md ${index === 0
              ? "-z-10 -translate-x-2 -translate-y-3 -rotate-3"
              : "-z-20 translate-x-2 -translate-y-5 rotate-3"}`}
          >
            {profile.photoUrl && (
              <img src={profile.photoUrl} alt="" className="h-2/3 w-full object-cover opacity-60" />
            )}
          </div>
        ))}
        <UserCard key={profiles[0]._id} user={profiles[0]} onDecision={onDecision} />
      </div>
    </div>
  );
}
