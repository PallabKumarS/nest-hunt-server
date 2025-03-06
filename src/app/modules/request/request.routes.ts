import { Router } from 'express';
import { RequestController } from './request.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.get('/', auth(USER_ROLE.admin), RequestController.getAllRequest);

router.get(
  '/personal',
  auth(USER_ROLE.tenant, USER_ROLE.landlord),
  RequestController.getPersonalRequest,
);

router.get(
  '/:requestId',
  auth(USER_ROLE.admin, USER_ROLE.tenant),
  RequestController.getSingleRequest,
);

router.post('/', auth(USER_ROLE.tenant), RequestController.createRequest);

router.patch(
  '/status/:requestId',
  auth(USER_ROLE.landlord),
  RequestController.changeRequestStatus,
);

router.patch(
  '/:requestId',
  auth(USER_ROLE.landlord, USER_ROLE.admin),
  RequestController.updateRequest,
);

router.patch(
  '/create-payment/:requestId',
  auth(USER_ROLE.tenant),
  RequestController.createPayment,
);

router.get(
  '/verify-payment/:paymentId',
  auth(USER_ROLE.tenant),
  RequestController.verifyPayment,
);

router.delete(
  '/:requestId',
  auth(USER_ROLE.admin, USER_ROLE.tenant),
  RequestController.deleteRequest,
);

export const RequestRoutes = router;
