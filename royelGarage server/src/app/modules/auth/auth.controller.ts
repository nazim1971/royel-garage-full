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
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
};
