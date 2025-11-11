#!/usr/bin/env node

/**
 * Script para compilar automáticamente todos los archivos -tailwind.css
 * desde assets/tailwind/ a sus ubicaciones de salida correspondientes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TAILWIND_DIR = path.join(__dirname, '../assets/tailwind');
const ASSETS_DIR = path.join(__dirname, '../assets');

// Mapeo de rutas especiales (archivos que compilan a subcarpetas)
const PATH_MAP = {
  'banners-container-slider-tailwind.css':
    'components/banners-container-slider.css',
  'mega-menu-search-tailwind.css': 'components/mega-menu-search.css',
  'predictive-search-mega-menu-tailwind.css':
    'components/predictive-search-mega-menu.css',
};

let enableSourceMaps = false;

function getOutputPath(inputFile) {
  const basename = path.basename(inputFile);

  // Si hay un mapeo específico, usarlo
  if (PATH_MAP[basename]) {
    return path.join(ASSETS_DIR, PATH_MAP[basename]);
  }

  // Caso general: remover -tailwind y mantener en assets/
  const outputName = basename.replace('-tailwind.css', '.css');
  return path.join(ASSETS_DIR, outputName);
}

function findTailwindFiles() {
  if (!fs.existsSync(TAILWIND_DIR)) {
    console.error(`❌ Directorio ${TAILWIND_DIR} no existe`);
    process.exit(1);
  }

  const files = fs.readdirSync(TAILWIND_DIR);
  return files
    .filter((file) => file.endsWith('-tailwind.css'))
    .map((file) => path.join(TAILWIND_DIR, file));
}

function buildCommand(inputFile, outputFile, watch = false) {
  const inputPath = path.relative(process.cwd(), inputFile);
  const outputPath = path.relative(process.cwd(), outputFile);

  // Asegurar que el directorio de salida existe
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const watchFlag = watch ? '--watch' : '';
  const mapFlag = enableSourceMaps ? '--map' : '';
  const envFlag = watch ? '' : 'NODE_ENV=production';

  return `${envFlag} postcss ${inputPath} -o ${outputPath} ${watchFlag} ${mapFlag}`
    .trim()
    .replace(/\s+/g, ' ');
}

function main() {
  const args = process.argv.slice(2);
  const isWatch = args.includes('--watch') || args.includes('-w');
  const isDev = args.includes('--dev');
  enableSourceMaps = args.includes('--map') || args.includes('-m');

  const tailwindFiles = findTailwindFiles();

  if (tailwindFiles.length === 0) {
    console.log(
      '⚠️  No se encontraron archivos -tailwind.css en assets/tailwind/',
    );
    return;
  }

  console.log(
    `📦 Encontrados ${tailwindFiles.length} archivo(s) para compilar:\n`,
  );

  const fileMappings = tailwindFiles.map((inputFile) => {
    const outputFile = getOutputPath(inputFile);
    const basename = path.basename(inputFile);
    const outputBasename = path.basename(outputFile);
    const outputRelative = path.relative(process.cwd(), outputFile);

    console.log(`  ✓ ${basename} → ${outputRelative}`);

    return { inputFile, outputFile, basename, outputBasename };
  });

  console.log('\n🚀 Compilando...\n');
  console.log(
    `ℹ️  Source maps ${enableSourceMaps ? 'activados' : 'desactivados'}\n`,
  );

  if (isWatch || isDev) {
    // En modo watch, ejecutar todos en paralelo usando spawn
    const { spawn } = require('child_process');
    const processes = [];

    fileMappings.forEach(({ inputFile, outputFile }) => {
      const inputPath = path.relative(process.cwd(), inputFile);
      const outputPath = path.relative(process.cwd(), outputFile);

      // Asegurar que el directorio de salida existe
      const outputDir = path.dirname(outputFile);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const postcssBin = path.join(__dirname, '../node_modules/.bin/postcss');
      const spawnArgs = [inputPath, '-o', outputPath, '--watch'];
      if (enableSourceMaps) {
        spawnArgs.push('--map');
      }
      const proc = spawn(postcssBin, spawnArgs, {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd(),
      });

      processes.push(proc);

      proc.on('error', (error) => {
        console.error(
          `❌ Error iniciando proceso para ${path.basename(inputFile)}:`,
          error.message,
        );
      });
    });

    // Manejar Ctrl+C
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Deteniendo procesos...');
      processes.forEach((proc) => proc.kill('SIGINT'));
      process.exit(0);
    });

    // Esperar a que todos los procesos terminen
    Promise.all(
      processes.map(
        (proc) =>
          new Promise((resolve) => {
            proc.on('exit', resolve);
          }),
      ),
    ).catch(() => {
      // Ignorar errores de salida
    });
  } else {
    // En modo build, ejecutar secuencialmente
    fileMappings.forEach(({ inputFile, outputFile, basename }, index) => {
      console.log(
        `[${index + 1}/${fileMappings.length}] Compilando ${basename}...`,
      );

      const inputPath = path.relative(process.cwd(), inputFile);
      const outputPath = path.relative(process.cwd(), outputFile);

      // Asegurar que el directorio de salida existe
      const outputDir = path.dirname(outputFile);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      try {
        const postcssBin = path.join(__dirname, '../node_modules/.bin/postcss');
        const commandParts = [
          'NODE_ENV=production',
          postcssBin,
          inputPath,
          '-o',
          outputPath,
        ];
        if (enableSourceMaps) {
          commandParts.push('--map');
        }
        execSync(commandParts.join(' '), {
          stdio: 'inherit',
          cwd: process.cwd(),
        });
      } catch (error) {
        console.error(`❌ Error compilando ${basename}`);
        process.exit(1);
      }
    });
    console.log('\n✅ Compilación completada');
  }
}

main();
