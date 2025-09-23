import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

// Use service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_EMAILS = [
  'anandmani5596@gmail.com',
  'ramyaponni1661@gmail.com',
  'anandiasias@gmail.com',
  'arunveni16@gmail.com'
]

export async function POST() {
  try {
    const results = []

    for (const email of ADMIN_EMAILS) {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`Error checking profile for ${email}:`, fetchError)
        results.push({
          email,
          success: false,
          action: 'check_profile',
          error: fetchError.message
        })
        continue
      }

      if (existingProfile) {
        // Update existing profile to admin
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            user_type: 'admin',
            updated_at: new Date().toISOString()
          })
          .eq('email', email)

        if (updateError) {
          console.error(`Error updating profile for ${email}:`, updateError)
          results.push({
            email,
            success: false,
            action: 'update_existing',
            error: updateError.message
          })
        } else {
          results.push({
            email,
            success: true,
            action: 'updated_to_admin',
            message: 'Existing user updated to admin'
          })
        }
      } else {
        // First create auth user, then create profile
        const { data: newAuthUser, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          email_confirm: true,
          user_metadata: {
            full_name: email.split('@')[0],
            user_type: 'admin'
          }
        })

        if (createAuthError) {
          console.error(`Error creating auth user for ${email}:`, createAuthError)
          results.push({
            email,
            success: false,
            action: 'create_auth_user',
            error: createAuthError.message
          })
        } else {
          // Now create the profile with the auth user's ID
          const { error: insertError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: newAuthUser.user.id,
              email: email,
              full_name: email.split('@')[0],
              user_type: 'admin'
            })

          if (insertError) {
            // If profile already exists, update it to admin
            if (insertError.code === '23505') { // Unique constraint violation
              const { error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({
                  user_type: 'admin',
                  updated_at: new Date().toISOString()
                })
                .eq('email', email)

              if (updateError) {
                console.error(`Error updating existing profile for ${email}:`, updateError)
                results.push({
                  email,
                  success: false,
                  action: 'update_existing_profile',
                  error: updateError.message
                })
              } else {
                results.push({
                  email,
                  success: true,
                  action: 'updated_existing_to_admin',
                  message: 'Existing profile updated to admin'
                })
              }
            } else {
              console.error(`Error creating profile for ${email}:`, insertError)
              results.push({
                email,
                success: false,
                action: 'create_profile',
                error: insertError.message
              })
            }
          } else {
            results.push({
              email,
              success: true,
              action: 'created_as_admin',
              message: 'New admin user and profile created'
            })
          }
        }
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: failureCount === 0,
      message: `Admin setup complete: ${successCount} successful, ${failureCount} failed`,
      results: results,
      summary: {
        total: ADMIN_EMAILS.length,
        successful: successCount,
        failed: failureCount
      }
    })

  } catch (error) {
    console.error('Admin setup error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to setup admin users'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Check current admin status
    const { data: adminProfiles, error } = await supabaseAdmin
      .from('profiles')
      .select('email, user_type, created_at, updated_at')
      .in('email', ADMIN_EMAILS)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    const adminStatus = ADMIN_EMAILS.map(email => {
      const profile = adminProfiles?.find(p => p.email === email)
      return {
        email,
        exists: !!profile,
        isAdmin: profile?.user_type === 'admin',
        lastUpdated: profile?.updated_at
      }
    })

    return NextResponse.json({
      success: true,
      adminEmails: ADMIN_EMAILS,
      currentStatus: adminStatus,
      summary: {
        total: ADMIN_EMAILS.length,
        existing: adminProfiles?.length || 0,
        admins: adminProfiles?.filter(p => p.user_type === 'admin').length || 0
      }
    })

  } catch (error) {
    console.error('Admin status check error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}