import { UserButton, useUser } from "@clerk/nextjs";

export const UserProfile = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{user.fullName}</span>
        <span className="text-xs text-gray-500">{user.primaryEmailAddress?.emailAddress}</span>
      </div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};
