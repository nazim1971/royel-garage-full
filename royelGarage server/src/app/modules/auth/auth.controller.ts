import config from '../../config';
import { catchAsync } from '../../utilities/catchAsync';
import { sendResponse } from '../../utilities/sendResponse';
import { AuthService } from './auth.service';
import httpStatus from 'http-status';

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUserIntoDB(req.body);
  const { _id, name, email } = result;

  sendResponse(res, {
    success: true,
    message: 'User registered successfully',
    statusCode: httpStatus.CREATED,
    data: {
      _id,
      name,
      email,
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const tokens = await AuthService.loginUser(req.body);

  const { refreshToken, accessToken } = tokens;

  res.cookie('refreshToken', refreshToken, {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: {
      token: accessToken,
      RToken: refreshToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

const getSingleUserFromDB = catchAsync(async (req, res) => {
  const user = await AuthService.getSingleUser(req.params.email);

  const userResponse = {
    name: user.name,
    email: user.email,
  };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully!',
    data: userResponse,
  });
});

const updateUserNameFromDB = catchAsync(async (req, res) => {
  const { email } = req.params;  // Get email from request params
  const { newName } = req.body;  // Get newName from request body

  // Call the update service to update the user's name
  const user = await AuthService.updateUserName(email, newName);

  const userResponse = {
    name: user.name,
    email: user.email,
  };

  // Send success response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User name updated successfully!',
    data: userResponse,
  });
});


const resetPassword = catchAsync(async (req, res) => {
  const { currentPassword, email, newPassword } = req.body;
  const result = await AuthService.changePassword(email,currentPassword, newPassword);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
  getSingleUserFromDB,
  resetPassword,
  updateUserNameFromDB
};
