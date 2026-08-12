import { comparePassword, hashPassword } from '../../../src/utils/password';

describe('password utils', () => {
  it('hashes a password to a value different from the plaintext', async () => {
    const hash = await hashPassword('Str0ng!Passw0rd');
    expect(hash).not.toEqual('Str0ng!Passw0rd');
  });

  it('confirms a matching password against its hash', async () => {
    const hash = await hashPassword('Str0ng!Passw0rd');
    await expect(comparePassword('Str0ng!Passw0rd', hash)).resolves.toBe(true);
  });

  it('rejects a non-matching password', async () => {
    const hash = await hashPassword('Str0ng!Passw0rd');
    await expect(comparePassword('WrongPassword1', hash)).resolves.toBe(false);
  });
});
