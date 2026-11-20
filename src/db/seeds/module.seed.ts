import { In, type DeepPartial } from 'typeorm';
import { ModuleEntity } from '../entities/module.entity.js';
import { dbVirtualOffice } from '../index.js';
import { readdir } from 'node:fs/promises';
import { kebabCaseToTitle } from '../../utils/helper.js';

const moduleDetection = async (relativePath: string) => {
  const targetUrl = new URL(relativePath, import.meta.url);

  try {
    const entries = await readdir(targetUrl, { withFileTypes: true });
    const folders = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    return folders;
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error(
        `Gagal membaca direktori "${targetUrl.toString()}":`,
        error.message,
      );
    return [];
  }
};

const moduleSeed = async () => {
  const moduleSlugs = await moduleDetection('../../modules');
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
