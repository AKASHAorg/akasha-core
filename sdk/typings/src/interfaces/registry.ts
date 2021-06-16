export interface AWF_IENS {
  registerName(name: string): Promise<unknown>;

  claimName(name: string): Promise<unknown>;

  userIsOwnerOf(name: string): Promise<boolean>;

  isAvailable(name: string): Promise<unknown>;

  resolveAddress(ethAddress: string): Promise<unknown>;

  resolveName(name: string): Promise<unknown>;
}
