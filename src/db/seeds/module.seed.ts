import { In, type DeepPartial } from 'typeorm';
import { ModuleEntity } from '../../common/modules/modules/module.entity.js';
import { dbVirtualOffice } from '../index.js';
import { readdir } from 'node:fs/promises';
import { kebabCaseToTitle } from '../../utils/helper.js';

const moduleSeed = async () => {
  const directory = new URL('../../modules', import.meta.url);
  const entries = await readdir(directory, { withFileTypes: true });

  const folderSlugs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const folderSlugsSet = new Set(folderSlugs);

  const moduleRepository = dbVirtualOffice.getRepository(ModuleEntity);

  const existingModules = await moduleRepository.find();
  const existingSlugsSet = new Set(existingModules.map((m) => m.slug));

  const modulesToInsert: DeepPartial<ModuleEntity>[] = folderSlugs
    .filter((slug) => !existingSlugsSet.has(slug))
    .map((slug) => ({
      name: kebabCaseToTitle(slug),
      slug,
    }));

  const slugsToDelete = existingModules
    .filter((m) => !folderSlugsSet.has(m.slug))
    .map((m) => m.slug);

  await Promise.all([
    modulesToInsert.length > 0
      ? moduleRepository.save(modulesToInsert)
      : Promise.resolve(),
    slugsToDelete.length > 0
      ? moduleRepository.delete({ slug: In(slugsToDelete) })
      : Promise.resolve(),
  ]);
};

export default moduleSeed;
