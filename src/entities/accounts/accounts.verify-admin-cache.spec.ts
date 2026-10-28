import { AccountsService } from './accounts.service';
import { AccountRole } from './accounts.dto';

describe('AccountsService.verify_admin cache', () => {
  const build = () => {
    const accountsRepo = {
      findOneBy: jest.fn(),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const partnersAdminsRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      exists: jest.fn(),
    };
    const cache = {
      // Store en memoria para que el segundo hit lea lo que se escribió.
      store: new Map<string, unknown>(),
      get: jest.fn(async function (this: { store: Map<string, unknown> }, key: string) {
        return this.store.get(key);
      }),
      set: jest.fn(async function (this: { store: Map<string, unknown> }, key: string, value: unknown) {
        this.store.set(key, value);
      }),
      mdel: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    };
    const service = new AccountsService(
      accountsRepo as never,
      partnersAdminsRepo as never,
      cache as never,
    );
    return { service, accountsRepo, partnersAdminsRepo, cache };
  };

  it('cachea el acierto y no vuelve a consultar en el segundo hit', async () => {
    const { service, accountsRepo, partnersAdminsRepo, cache } = build();
    accountsRepo.findOneBy.mockResolvedValue({
      id_account: 'A1',
      role: AccountRole.PARTNER_ADMIN,
    });
    partnersAdminsRepo.findOne.mockResolvedValue({ id_account: 'A1' });

    expect(await service.verify_admin('A1', 'P1')).toBe(true);
    expect(await service.verify_admin('A1', 'P1')).toBe(true);

    expect(accountsRepo.findOneBy).toHaveBeenCalledTimes(1);
    expect(partnersAdminsRepo.findOne).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith('admin-partner:A1_P1', true);
  });

  it('no cachea rechazos: un alta de permisos aplica en la llamada siguiente', async () => {
    const { service, accountsRepo, partnersAdminsRepo, cache } = build();
    accountsRepo.findOneBy.mockResolvedValue({
      id_account: 'A1',
      role: AccountRole.USER,
    });

    await expect(service.verify_admin('A1', 'P1')).rejects.toThrow(
      'User is not admin',
    );
    expect(cache.set).not.toHaveBeenCalled();
    expect(partnersAdminsRepo.findOne).not.toHaveBeenCalled();
  });

  it('degrada a USER e invalida el acierto cacheado de todas sus relaciones', async () => {
    const { service, accountsRepo, partnersAdminsRepo, cache } = build();
    accountsRepo.findOneBy.mockResolvedValue({
      id_account: 'A1',
      role: AccountRole.PARTNER_ADMIN,
    });
    partnersAdminsRepo.find.mockResolvedValue([
      { id_account: 'A1', id_partner: 'P1' },
      { id_account: 'A1', id_partner: 'P2' },
    ]);

    await service.changeRole({
      id_account: 'A1',
      newRole: AccountRole.USER,
      id_partner: 'P1',
    });

    expect(cache.mdel).toHaveBeenCalledWith([
      'admin-partner:A1_P1',
      'admin-partner:A1_P2',
    ]);
  });
});