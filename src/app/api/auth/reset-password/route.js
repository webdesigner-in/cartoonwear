import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { sendPasswordResetEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    if (!user) {
      // Don't reveal if user doesn't exist for security
      return NextResponse.json(
        { message: 'If your email exists, a reset link has been sent to your inbox.' },
        { status: 200 }
      );
    }
    
    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: email.toLowerCase() }
    });
    
    // Generate reset token
    const resetToken = uuidv4();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    
    // Save reset token to database
    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token: resetToken,
        expires: expires,
        used: false
      }
    });
    
    // Send reset email
    try {
      const emailResult = await sendPasswordResetEmail(email.toLowerCase(), resetToken);
      
      if (!emailResult.success) {
        console.error('Failed to send reset email:', emailResult.error);
        // Clean up the token if email failed
        await prisma.passwordResetToken.delete({
          where: { token: resetToken }
        });
        
        return NextResponse.json(
          { error: 'Failed to send reset email. Please try again later.' },
          { status: 500 }
        );
      }
      
      console.log(`Password reset email sent successfully to ${email}`);
      
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Clean up the token if email failed
      await prisma.passwordResetToken.delete({
        where: { token: resetToken }
      });
      
      return NextResponse.json(
        { error: 'Failed to send reset email. Please check your email configuration.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'If your email exists, a reset link has been sent to your inbox.' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}