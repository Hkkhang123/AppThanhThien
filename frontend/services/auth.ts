export async function loginApi(username: string, password: string) {
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại!');
  return data;
}

export async function registerApi(username: string, email: string, password: string) {
  const res = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại!');
  return data;
}