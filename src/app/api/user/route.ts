import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/user';
import { Prisma } from '@prisma/client';

const userService = new UserService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = ['email', 'senha', 'name', 'nodeId'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const userData = {
      email: body.email,
      senha: body.senha,
      name: body.name,
      nodeId: body.nodeId,
    };

    const user = await userService.createUser(userData);

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      nodeId: user.nodeId,
      totalPaid: user.totalPaid,
      averageRating: user.averageRating,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userResponse 
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    // Verificação de tipo para erro do Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const user = await userService.getUserByEmail(email);
    
    return NextResponse.json({ 
      exists: !!user 
    });

  } catch (error: unknown) {
    console.error('Error checking email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}