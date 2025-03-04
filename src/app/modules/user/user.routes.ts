import validateRequest from '../../middlewares/validateRequest';
import { Router } from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constants';

const router = Router();

router.get('/', auth(USER_ROLE.admin), UserController.getAllUsers);

router.post(
  '/create-user',
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser,
);

router.get(
  '/me',
  auth(USER_ROLE.tenant, USER_ROLE.admin, USER_ROLE.landlord),
  UserController.getMe,
);

router.patch(
  '/status/:userId',
  auth(USER_ROLE.admin),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUserStatus,
);

router.patch(
  '/role/:userId',
  auth(USER_ROLE.admin),
  UserController.updateUserRole,
);

router.patch(
  '/:userId',
  auth(USER_ROLE.admin, USER_ROLE.tenant, USER_ROLE.landlord),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser,
);

router.delete('/:userId', auth(USER_ROLE.admin), UserController.deleteUser);

export const UserRoutes = router;
