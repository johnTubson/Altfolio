export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "admin" | "viewer";
  };
}

export interface UserResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: "admin" | "viewer";
  };
}

export interface JwtPayload {
  userId: string;
  role: "admin" | "viewer";
}
