import { instance } from "../../api/instance";
import type { LoginResponse } from "../../types";

export async function register(
  email: string,
  password: string,
  name: string,
): Promise<LoginResponse> {
  const response = await instance.post<LoginResponse>("auth/register", {
    email,
    password,
    name,
  });

  return response.data;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await instance.post<LoginResponse>("auth/login", {
    email,
    password,
  });

  return response.data;
}
