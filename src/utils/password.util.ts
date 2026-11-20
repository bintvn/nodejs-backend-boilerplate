import { hash, verify } from '@node-rs/argon2';

export default {
  hash: async (plainPassword: string) => {
    const passwordHash = await hash(plainPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    return passwordHash;
  },
  verify: async (storedHash: string, plainPassword: string) => {
    try {
      return await verify(storedHash, plainPassword);
    } catch (error: unknown) {
      console.log(error);

      return false;
    }
  },
};
