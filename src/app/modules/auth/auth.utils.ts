import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { userId: string; role: string; email: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  } as SignOptions);
};

export const verifyToken = (token: string, secret: string) => {
  const newToken = token.includes('Bearer')
    ? (token.split(' ')[1] as string)
    : (token as string);
  return jwt.verify(newToken, secret) as JwtPayload;
};
