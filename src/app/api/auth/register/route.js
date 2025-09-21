import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { validateEmail } from '@/lib/emailValidation'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordErrors = [];
    if (password.length < 8) {
      passwordErrors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      passwordErrors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      passwordErrors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    if (passwordErrors.length > 0) {
      return NextResponse.json(
        { error: passwordErrors.join('. ') + '.' },
        { status: 400 }
      )
    }

    // Validate email
    console.log(`🔍 Validating email for registration: ${email}`);
    const emailValidation = await validateEmail(email.toLowerCase());
    
    if (!emailValidation.isValid) {
      console.log(`❌ Email validation failed: ${email} - ${emailValidation.reason}`);
      return NextResponse.json(
        { error: `Invalid email: ${emailValidation.reason}` },
        { status: 400 }
      )
    }
    
    console.log(`✅ Email validation passed: ${email}`);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase()
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'CUSTOMER', // Default role
        isActive: true
      }
    })
    
    console.log(`🎉 User registered successfully: ${email}`);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { user: userWithoutPassword, message: 'User created successfully' },
      { status: 201 }
    )

  } catch (error) {
  // Removed console.error for clean console
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}