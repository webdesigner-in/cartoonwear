import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required', valid: false },
        { status: 400 }
      );
    }
    
    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });
    
    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid reset token', valid: false },
        { status: 400 }
      );
    }
    
    // Check if token has expired
    if (new Date() > resetToken.expires) {
      // Clean up expired token
      await prisma.passwordResetToken.delete({
        where: { token }
      });
      
      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new password reset.', valid: false },
        { status: 400 }
      );
    }
    
    // Check if token has already been used
    if (resetToken.used) {
      return NextResponse.json(
        { error: 'This reset token has already been used. Please request a new password reset.', valid: false },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Token is valid', valid: true },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error', valid: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}