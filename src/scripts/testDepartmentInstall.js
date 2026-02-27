import { installDepartment } from '../modules/departments/departmentInstaller.js';

// coloque um userId real que já exista no seu banco
const userId = 'user_dev_seed';

async function run() {
  console.log('Installing DEV...');
  const devResult = await installDepartment(userId, 'dev');
  console.log(devResult);

  console.log('Installing NARRATIVE...');
  const narrativeResult = await installDepartment(userId, 'narrative');
  console.log(narrativeResult);

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});