import User from "@/models/user";
import User_Subscription from "@/models/user_subscription";
const { verify } = require("jsonwebtoken");

export const userAuthGuard = async (req) => {
  try {
    const headers = req.headers;
    const token = headers.get("authorization").split(" ")[1];
    const { id } = verify(token, process.env.JWT_SECRET);
    const data = await User.findById(id)
      .select("-password")
      .populate({ path: "companyId", select: ["_id", "subscriptionId", "adminId", "displayName"] });
    return { success: true, message: "Token verified", data };
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userAdminGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (authData?.data?.role === "admin") {
        return {
          success: true,
          message: "Token verified - User is Admin",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not an admin",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userEmployeeGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (
        authData?.data?.role === "employee" ||
        authData?.data?.role === "admin"
      ) {
        return {
          success: true,
          message: "Token verified - User is employee",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not an employee",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userSuperAdminGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);

    if (authData?.success) {
      if (authData?.data?.role === "super-admin") {
        return {
          success: true,
          message: "Token verified - User is Super Admin",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not a super admin",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const subscriptionCheckGuard = async (subscriptionId) => {
  try {
    let subscription = await User_Subscription.findById(subscriptionId);
    if (!subscription) {
      return {
        success: false,
        message: "Subscription was not found.",
      };
    }

    const gracePeriod = Number(process.env.NEXT_PUBLIC_GRACE_PERIOD) || 0;
    const currentDate = new Date();
    const endDate = new Date(subscription.endDate);
    const gracePeriodInMs = gracePeriod * 24 * 60 * 60 * 1000;
    const gracePeriodEndDate = new Date(endDate.getTime() + gracePeriodInMs);

    if (currentDate > endDate) {
      subscription.status = "expired";
      await subscription.save();
      if (currentDate <= gracePeriodEndDate) {
        const graceDateOnly = new Date(gracePeriodEndDate)
          .toISOString()
          .split("T")[0];
        return {
          success: true,
          message: `Subscription is expired, Your grace period will end on ${graceDateOnly}`,
        };
      } else {
        return {
          success: false,
          message: "Subscription is expired.",
        };
      }
    } else {
      return {
        success: true,
        message: "Subscription is active",
      };
    }
  } catch (error) {
    return { success: false, message: "Subscription Check Failed - Try Again" };
  }
};

export const userHRGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (authData?.data?.role === "hr" || authData?.data?.role === "admin") {
        return {
          success: true,
          message: "Token verified - User is HR",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not a HR",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userFinanceGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (
        authData?.data?.role === "finance" ||
        authData?.data?.role === "admin"
      ) {
        return {
          success: true,
          message: "Token verified - User is Finance Member",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not a Finance Member",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userSalesGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (
        authData?.data?.role === "sales" ||
        authData?.data?.role === "admin"
      ) {
        return {
          success: true,
          message: "Token verified - User is Sales Member",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not a Sales Member",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};
