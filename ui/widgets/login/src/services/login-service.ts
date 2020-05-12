export const authorize = async ({
  authModule,
  logger,
  setJwtToken,
}: {
  authModule: any;
  logger: any;
  setJwtToken: any;
}) => {
  const { auth_service } = authModule;
  const call = auth_service.signIn(null);
  call.subscribe((data: any) => {
    logger.info('we should be signed in now', data);
    console.log(data, 'the data');
    setJwtToken(data);
  });
};

export const getJWT = async ({
  authModule,
  logger,
  setJwtToken,
}: {
  authModule: any;
  logger: any;
  setJwtToken: any;
}) => {
  const { auth_service } = authModule;
  const call = auth_service.getJWT(null);
  call.subscribe((data: any) => {
    logger.info('jwt token received', data);
    setJwtToken(data);
  });
};
