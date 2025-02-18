import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      email?: string;
      username?: string;
      role?: string;
    };
  }

  interface User {
    username?: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    username?: string;
  }
}
