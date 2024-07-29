import tables from './tables-setup.mjs';
import testdata from './testdata-setup.mjs';

async function run() {
  await tables();
  if (process.argv[2] == '-test') {
    await testdata();
  }
}

run().then(process.exit);
