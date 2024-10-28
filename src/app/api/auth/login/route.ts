import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/user';

const userService = new UserService();

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json();

    const user = await userService.getUserByEmail(email);

    if (!user || user.senha !== senha) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: user
    });

  } catch (error) {
		console.error("Error logging in:", error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}