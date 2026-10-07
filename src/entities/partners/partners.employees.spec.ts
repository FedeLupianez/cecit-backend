import { PartnersService } from './partners.service';
import { AccountRole } from '../accounts/accounts.dto';

/**
 * El listado y la baja de empleados se apoyan en `Accounts`, que se enlaza con
 * `Users` por `id_account` == `id_user`. Estos tests fijan ese contrato: el
 * resolve de la cuenta tiene que funcionar por la relación y la baja solo
 * desactiva la cuenta cuando el socio no trabaja en ningún otro negocio.
 */
describe('PartnersService empleados', () => {
  const id_partner = 'P1';
  const callerId = 'A1';

  type EmployeeRow = { id_user: string; dni: string };

  const build = (
    employees: EmployeeRow[],
    options: {
      accounts?: unknown[];
      partnerOwner?: string;
      worksElsewhere?: boolean;
      hasAccount?: boolean;
    } = {},
  ) => {
    const partner = {
      id_partner,
      id_owner: options.partnerOwner ?? null,
      employees,
    };

    const relation = { of: jest.fn() };
    relation.of.mockReturnValue({
      relation: jest.fn(() => relation.of()),
      of: jest.fn(() => relation.of()),
      add: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    });
    const relationQueryBuilder = {
      relation: jest.fn(() => relationQueryBuilder),
      of: jest.fn(() => relationQueryBuilder),
      add: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const partnersRepo = {
      findOne: jest.fn().mockResolvedValue(partner),
      createQueryBuilder: jest.fn(() => relationQueryBuilder),
    };
    const usersRepo = {
      findOneBy: jest.fn().mockResolvedValue(employees[0]),
    };
    const accountsRepo = {
      find: jest.fn().mockResolvedValue(options.accounts ?? []),
      exists: jest
        .fn()
        .mockResolvedValue(options.hasAccount ?? true),
    };
    const accountsService = {
      get_by_id: jest
        .fn()
        .mockResolvedValue({ id_account: callerId, role: AccountRole.CECIT_ADMIN }),
      changeRole: jest.fn().mockResolvedValue(true),
      deactivate: jest.fn().mockResolvedValue(true),
    };
    const usersService = {
      create: jest.fn(),
      get_by_dni: jest.fn(),
      is_employee_of_other_partner: jest
        .fn()
        .mockResolvedValue(options.worksElsewhere ?? false),
    };
    const partnersAdminsService = { verify_admin: jest.fn() };

    const service = new PartnersService(
      partnersRepo as never,
      usersRepo as never,
      accountsRepo as never,
      {} as never,
      accountsService as never,
      usersService as never,
      partnersAdminsService as never,
    );

    return { service, partner, accountsRepo, accountsService, usersService };
  };

  describe('getEmployees', () => {
    const employees: EmployeeRow[] = [
      { id_user: 'U1', dni: '30111222' },
      { id_user: 'U2', dni: '40111222' },
    ];

    it('resuelve email y role de la cuenta de cada empleado', async () => {
      const { service, accountsRepo } = build(employees, {
        accounts: [
          { user: { id_user: 'U1' }, email: 'u1@cecit.edu.ar', role: 'USER', active: true },
        ],
      });

      const result = await service.getEmployees(id_partner);

      // El lookup va por la relación Accounts.user, no por una columna suelta.
      expect(accountsRepo.find).toHaveBeenCalledWith({
        where: { user: { id_user: expect.anything() } },
      });
      expect(result).toEqual([
        expect.objectContaining({ id_user: 'U1', email: 'u1@cecit.edu.ar', role: 'USER' }),
        expect.objectContaining({ id_user: 'U2', email: null, role: null }),
      ]);
    });

    it('expone active para distinguir una cuenta dada de baja', async () => {
      const { service } = build([employees[0]], {
        accounts: [
          { user: { id_user: 'U1' }, email: 'u1@cecit.edu.ar', role: 'USER', active: false },
        ],
      });

      const [employee] = await service.getEmployees(id_partner);

      expect(employee.active).toBe(false);
    });
  });

  describe('removeEmployee', () => {
    const employees = [{ id_user: 'U1', dni: '30111222' }];

    it('desactiva la cuenta si no es empleado de ningún otro negocio', async () => {
      const { service, accountsService, usersService } = build(employees, {
        worksElsewhere: false,
      });

      await service.removeEmployee(id_partner, callerId, '30111222');

      expect(usersService.is_employee_of_other_partner).toHaveBeenCalledWith(
        'U1',
        id_partner,
      );
      expect(accountsService.deactivate).toHaveBeenCalledWith('U1');
    });

    it('no desactiva la cuenta si sigue empleado en otro negocio', async () => {
      const { service, accountsService } = build(employees, {
        worksElsewhere: true,
      });

      await service.removeEmployee(id_partner, callerId, '30111222');

      expect(accountsService.deactivate).not.toHaveBeenCalled();
      // El rol igual se degrada a USER.
      expect(accountsService.changeRole).toHaveBeenCalledWith({
        id_partner,
        id_account: 'U1',
        newRole: AccountRole.USER,
      });
    });

    it('no falla si el empleado no tiene cuenta', async () => {
      const { service, accountsService } = build(employees, { hasAccount: false });

      // La baja responde el listado re-leído; lo que importa es que no lanza
      // `404 User has not account` como sí lo hacía `changeRole`.
      await expect(
        service.removeEmployee(id_partner, callerId, '30111222'),
      ).resolves.toBeDefined();

      expect(accountsService.changeRole).not.toHaveBeenCalled();
      expect(accountsService.deactivate).not.toHaveBeenCalled();
    });

    it('no desactiva la cuenta del dueño del negocio', async () => {
      const { service } = build(employees, { partnerOwner: 'U1' });

      await expect(
        service.removeEmployee(id_partner, callerId, '30111222'),
      ).rejects.toThrow('User is owner, can not delete him');
    });
  });
});