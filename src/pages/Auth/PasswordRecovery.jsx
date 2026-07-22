import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { forgotPasswordAPI, resetPasswordAPI } from '~/apis'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'

function PasswordRecovery() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const isReset = location.pathname.endsWith('/reset-password')
  const token = searchParams.get('token')
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm()

  const submit = async (data) => {
    if (isReset) {
      await resetPasswordAPI({ token, password: data.password })
      toast.success('Password reset successfully. You can now sign in.')
    } else {
      await forgotPasswordAPI({ email: data.email })
    }
    setSubmitted(true)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'background.default',
        px: 2
      }}
    >
      <Paper sx={{ width: '100%', maxWidth: 440, p: 4 }}>
        <Typography variant='h5' fontWeight='bold' mb={1}>
          {isReset ? 'Reset password' : 'Forgot password'}
        </Typography>

        {submitted ? (
          <>
            <Typography mb={3}>
              {isReset
                ? 'Your password has been changed.'
                : 'If the account exists, a reset link has been sent.'}
            </Typography>
            <Button component={Link} to='/login' variant='contained'>
              Back to sign in
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit(submit)}>
            {!isReset && (
              <TextField
                fullWidth
                margin='normal'
                label='Email'
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
                })}
              />
            )}

            {isReset && (
              <>
                {!token && (
                  <Typography color='error' my={2}>
                    The password reset link is invalid.
                  </Typography>
                )}
                <TextField
                  fullWidth
                  margin='normal'
                  type='password'
                  label='New password'
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  {...register('password', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: PASSWORD_RULE,
                      message: PASSWORD_RULE_MESSAGE
                    }
                  })}
                />
                <TextField
                  fullWidth
                  margin='normal'
                  type='password'
                  label='Confirm new password'
                  error={Boolean(errors.passwordConfirmation)}
                  helperText={errors.passwordConfirmation?.message}
                  {...register('passwordConfirmation', {
                    required: FIELD_REQUIRED_MESSAGE,
                    validate: (value) =>
                      value === watch('password') || 'Passwords do not match.'
                  })}
                />
              </>
            )}

            <Button
              fullWidth
              type='submit'
              variant='contained'
              disabled={isSubmitting || (isReset && !token)}
              sx={{ mt: 2 }}
            >
              {isReset ? 'Reset password' : 'Send reset link'}
            </Button>
            <Button fullWidth component={Link} to='/login' sx={{ mt: 1 }}>
              Back to sign in
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  )
}

export default PasswordRecovery
