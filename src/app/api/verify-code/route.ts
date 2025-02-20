import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export const POST = async (request: Request) => {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = new Date() > user.verifyCodeExpiry;
    if (isCodeValid && !isCodeExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json({
        success: true,
        message: "User verified successfully",
      });
    } else if (isCodeExpired) {
      return Response.json(
        {
          success: false,
          message: "Code expired. Please sign up again to get new code",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error verifying code: ", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying code",
      },
      {
        status: 500,
      }
    );
  }
};
