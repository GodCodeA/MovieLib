import { httpClient } from "./http";
import { User } from "../types/user";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  surname: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>("/login", payload);
  return response.data;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<{ message: string }> {
  const response = await httpClient.post<{ message: string }>(
    "/register",
    payload,
  );
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await httpClient.get<User>("/me");
  return response.data;
}

export async function logoutUser(): Promise<void> {
  localStorage.removeItem("token");
}
