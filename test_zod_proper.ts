import { adminLogin } from './src/api/auth.ts';

async function run() {
  try {
    const res = await adminLogin({ data: { email: 'invalid', password: '' } });
    console.log(res);
  } catch (e) {
    console.error("Caught error:", e);
  }
}
run();
