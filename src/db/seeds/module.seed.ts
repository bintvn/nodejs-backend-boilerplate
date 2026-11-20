import { In, type DeepPartial } from 'typeorm';
import { ModuleEntity } from '../entities/module.entity.js';
import { dbVirtualOffice } from '../index.js';
import { readdir } from 'node:fs/promises';
import { kebabCaseToTitle } from '../../utils/helper.js';

const moduleSeed = async () => {
  const directory = new URL('../../modules', import.meta.url);
  const entries = await readdir(directory, { withFileTypes: true });
  const moduleSlugs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const newModules: DeepPartial<ModuleEntity>[] = moduleSlugs.map((slug) => ({
    name: kebabCaseToTitle(slug),
    slug,
  }));
  const moduleRepository = dbVirtualOffice.getRepository(ModuleEntity);
  const existingModules = await moduleRepository.find({
    where: {
      slug: In(newModules.map((m) => m.slug)),
    },
  });
  const existingSlugs = new Set(existingModules.map((m) => m.slug));
  const modulesToInsert = newModules.filter(
    (m) => m.slug && !existingSlugs.has(m.slug),
  );

  if (modulesToInsert.length > 0) {
    await moduleRepository.save(modulesToInsert);
  }
};

export default moduleSeed;
