import { In, type DeepPartial } from 'typeorm';
import { ModuleEntity } from '../../core/modules/modules/module.entity.js';
import { dbVirtualOffice } from '../index.js';
import { readdir } from 'node:fs/promises';
import { kebabCaseToTitle } from '../utils/helper.js';

const moduleSeed = async () => {
  const directory = new URL('../../modules', import.meta.url);
  const entries = await readdir(directory, { withFileTypes: true });

  const folderSlugs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const folderSlugsSet = new Set(folderSlugs);
  const moduleRepository = dbVirtualOffice.getRepository(ModuleEntity);
  const existingModules = await moduleRepository.find();
  const existingCodesSet = new Set(existingModules.map((m) => m.code));

  const modulesToInsert: DeepPartial<ModuleEntity>[] = folderSlugs
    .filter((code) => !existingCodesSet.has(code))
    .map((code) => ({
      name: kebabCaseToTitle(code),
      code,
    }));

  const codesToDelete = existingModules
    .filter((m) => !folderSlugsSet.has(m.code))
    .map((m) => m.code);

  await Promise.all([
    modulesToInsert.length > 0
      ? moduleRepository.save(modulesToInsert)
      : Promise.resolve(),
    codesToDelete.length > 0
      ? moduleRepository.delete({ code: In(codesToDelete) })
      : Promise.resolve(),
  ]);
};

export default moduleSeed;
