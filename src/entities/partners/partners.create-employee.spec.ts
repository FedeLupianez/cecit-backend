import { PartnersService } from './partners.service';
import { AccountRole } from '../accounts/accounts.dto';

describe('PartnersService.createEmployee', () => {
  const id_partner = 'P1';
  const callerId = 'A1';

  const build = (employees: { id_user: string }[] = []) => {
    const partner = { id_partner, employees };

    const partnersRepo = {
      findOne: jest.fn().mockResolvedValue(partner),
      createQueryBuilder: jest.fn(() => {
        const qb = {
          relation: jest.fn(() => qb),
          of: jest.fn(() => qb),
          add: jest.fn().mockResolvedValue(undefined),
          remove: jest.fn().mockResolvedValue(undefined),
        };
        return qb;
      }),
    };
    const usersRepo = { findOneBy: jest.fn() };
    const accountsRepo = { find: jest.fn().mockResolvedValue([]) };
    const accountsService = {
      get_by_id: jest
        .fn()
        .mockResolvedValue({ id_account: callerId, role: AccountRole.CECIT_ADMIN }),
    };
    const usersService = {
      create: jest.fn(),
      get_by_dni: jest.fn(),
    };
    const partnersAdminsService = { verify_admin: jest.fn() };
    const directionsService = {};

    const service = new PartnersService(
      partnersRepo as never,
      usersRepo as never,
      accountsRepo as never,
      directionsService as never,
      accountsService as never,
      usersService as never,
      partnersAdminsService as never,
    );

    return { service, partner, usersService, accountsService };
  };

  const dto = {
    id_partner,
    name: 'Juan',
    lastname: 'Perez',
    dni: '30111222',
  };

  it('crea el User y lo asocia al partner', async () => {
    const { service, usersService } = build([]);
    usersService.create.mockResolvedValue({ id_user: 'U9' });

    const result = await service.createEmployee(callerId, dto);

    expect(usersService.create).toHaveBeenCalledWith({
      name: 'Juan',
      lastname: 'Perez',
      dni: '30111222',
    });
    expect(result).toEqual([]);
  });

  it('reutiliza el User existente si el dni ya está registrado', async () => {
    const { service, usersService } = build([]);
    // usersService.create es create-or-reuse: devuelve el existente.
    usersService.create.mockResolvedValue({ id_user: 'U9' });

    await service.createEmployee(callerId, dto);

    // Solo una llamada al service: nunca se crea un segundo User para el dni.
    expect(usersService.create).toHaveBeenCalledTimes(1);
    expect(usersService.get_by_dni).not.toHaveBeenCalled();
  });

  it('rechaza si el User ya es empleado de este partner', async () => {
    const { service, usersService } = build([{ id_user: 'U9' }]);
    usersService.create.mockResolvedValue({ id_user: 'U9' });

    await expect(service.createEmployee(callerId, dto)).rejects.toThrow(
      'User is already an employee of this partner',
    );
  });

  it('no crea el User si el caller no es admin del partner', async () => {
    const { service, usersService, accountsService } = build([]);
    accountsService.get_by_id.mockResolvedValue({
      id_account: callerId,
      role: AccountRole.USER,
    });

    await expect(service.createEmployee(callerId, dto)).rejects.toThrow();
    // La validación de acceso ocurre antes de tocar la tabla Users.
    expect(usersService.create).not.toHaveBeenCalled();
  });

  it('exige dni', async () => {
    const { service, usersService } = build([]);

    await expect(
      service.createEmployee(callerId, { ...dto, dni: '' }),
    ).rejects.toThrow('dni is required');
    expect(usersService.create).not.toHaveBeenCalled();
  });
});