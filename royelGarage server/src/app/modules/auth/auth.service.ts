import config from '../../config';
import { AppError } from '../../error/AppError';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TLogin } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';

const registerUserIntoDB = async (payload: TUser) => {
  const user = await User.isUserExists(payload?.email);
  if (user) {
    throw new AppError(httpStatus.CONFLICT, 'Customer Already Exist');
  }
  const data = await User.create(payload);

  const { _id, name, email } = data;

  const result = { _id, name, email };

  return result;
};

const loginUser = async (payload: TLogin) => {
  // checking if the user is exist
  const user = await User.validateUser(payload.email);

  // Check if the password matches
  const isPasswordMatch = await User.isPasswordMatched(
    payload?.password,
    user?.password,
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  //create token and send to the client
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt, { expiresIn: '30d' });
  const refreshToken = jwt.sign(jwtPayload, config.jwtRef, {
    expiresIn: '365d',
  });

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<{ token: string }> => {
  // * Verify and decode token
  const decoded = jwt.verify(token, config.jwtRef) as JwtPayload;

  // * Validate and extract user from DB.
  const user = await User.validateUser(decoded.email);

  // * Create token and send to the  client.
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt, { expiresIn: '30d' });

  return { token: accessToken };
};

export const AuthService = { registerUserIntoDB, loginUser, refreshToken };
