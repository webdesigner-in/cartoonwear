import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import { validateEmail } from '@/lib/emailValidation'
import bcrypt from 'bcryptjs'

export const authOptions = {
  // Using manual user creation in signIn callback instead of PrismaAdapter
  // This gives us full control over user data and roles
  providers: [
    // Email and Password Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please provide both email and password');
          }

          // Validate password strength for new accounts
          if (credentials.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase()
            }
          })

          if (!user) {
            // User doesn't exist - validate email before creating account
            console.log(`🔍 Validating email for new account: ${credentials.email}`);
            
            const emailValidation = await validateEmail(credentials.email.toLowerCase());
            
            if (!emailValidation.isValid) {
              console.log(`❌ Invalid email rejected: ${credentials.email} - ${emailValidation.reason}`);
              throw new Error(`Invalid email: ${emailValidation.reason}`);
            }
            
            console.log(`✅ Email validation passed: ${credentials.email}`);
            
            // Create new account with validated email
            try {
              const hashedPassword = await bcrypt.hash(credentials.password, 12);
              
              const newUser = await prisma.user.create({
                data: {
                  email: credentials.email.toLowerCase(),
                  name: credentials.email.split('@')[0], // Use email prefix as name
                  password: hashedPassword,
                  role: 'CUSTOMER',
                  isActive: true,
                  // emailVerified: null (will be null until they verify)
                }
              });
              
              console.log(`🎉 New account created with validated email: ${credentials.email}`);
              
              return {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
              };
            } catch (createError) {
              console.error('❌ Error creating new account:', createError);
              if (createError.code === 'P2002') {
                throw new Error('An account with this email already exists.');
              }
              throw new Error('Failed to create account. Please try again.');
            }
          }
          
          // User exists - check if it's a social login account
          if (!user.password) {
            throw new Error('This account was created with social login. Please use Google to sign in or reset your password.');
          }

          // Validate password for existing user
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error('Incorrect password. Please try again.');
          }

          // Check if user is active
          if (!user.isActive) {
            throw new Error('Your account has been deactivated. Please contact support.');
          }

          console.log(`✅ User signed in: ${credentials.email}`);
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('❌ Credentials login error:', error.message);
          throw new Error(error.message);
        }
      }
    }),
    
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  
  session: {
    strategy: 'jwt',
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      // If this is a fresh login (user object exists), fetch latest data from database
      if (user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { 
              id: true, 
              role: true, 
              isActive: true,
              name: true,
              image: true 
            }
          })
          
          if (dbUser) {
            token.role = dbUser.role
            token.userId = dbUser.id
            token.isActive = dbUser.isActive
            token.name = dbUser.name
            token.picture = dbUser.image
          } else {
            // Fallback if user not found in DB
            token.role = 'CUSTOMER'
            token.isActive = true
          }
        } catch (error) {
          console.error('❌ Error fetching user data for JWT:', error)
          // Safe defaults
          token.role = 'CUSTOMER'
          token.isActive = true
        }
      }
      return token
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId || token.sub
        session.user.role = token.role
        session.user.isActive = token.isActive
        session.user.name = token.name
        session.user.image = token.picture
      }
      return session
    },
    
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })
          
          if (existingUser) {
            // If user exists, check if they're active
            if (!existingUser.isActive) {
              console.log(`🚫 Blocked inactive user login attempt: ${user.email}`)
              return false
            }
            
            // Update existing user's info if needed
            await prisma.user.update({
              where: { email: user.email },
              data: {
                name: profile.name || user.name,
                image: profile.picture || user.image,
                emailVerified: new Date() // Mark as verified for Google OAuth
              }
            })
            
            console.log(`✅ Existing user signed in: ${user.email}`)
            return true
          } else {
            // User doesn't exist, create new account automatically
            await prisma.user.create({
              data: {
                email: user.email,
                name: profile.name || user.name || user.email.split('@')[0],
                image: profile.picture || user.image,
                role: 'CUSTOMER',
                isActive: true,
                emailVerified: new Date()
              }
            })
            
            console.log(`🎉 New user created and signed in: ${user.email}`)
            return true
          }
        } catch (error) {
          console.error('❌ Google OAuth sign-in error:', error)
          return false
        }
      }
      return true
    }
  },
  
  // Note: User creation is now handled directly in signIn callback
  // This ensures we have full control over user data and roles
  
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }