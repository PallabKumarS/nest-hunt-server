import UserModel from "../modules/user/user.model";

// user id
export const generateUserId = async (userRole: string) => {
  const findLastUserId = async () => {
    const lastUser = await UserModel.findOne(
      { role: userRole },
      { userId: 1, _id: 0 },
    )
      .sort({ createdAt: -1 })
      .lean();
    return lastUser?.userId ? lastUser.userId : undefined;
  };

  let currentId = "0";
  const lastUserId = await findLastUserId();

  if (lastUserId) {
    currentId = lastUserId.split("-")[1];
  }

  let incrementId = "";

  if (userRole === "admin") {
    incrementId = `A-${(Number(currentId) + 1).toString().padStart(5, "0")}`;
  } else if (userRole === "landlord") {
    incrementId = `L-${(Number(currentId) + 1).toString().padStart(5, "0")}`;
  } else if (userRole === "tenant") {
    incrementId = `T-${(Number(currentId) + 1).toString().padStart(5, "0")}`;
  }

  return incrementId;
};
