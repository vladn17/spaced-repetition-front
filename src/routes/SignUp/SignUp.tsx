import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { SIGNUP } from '../../api';
import { Link, useHistory } from 'react-router-dom';
import Button from '../../components/Button';
import { TextField, FormError } from '../../components/Form';
import { SignUpMutation, SignUpMutationVariables } from '../../types/graphql';
import { useFormik } from 'formik';
import { string, object } from 'yup';
import { FormTitle } from '../../components/Form/FormTitle';
import { FormBottomText } from '../../components/Form/FormBottomText';

export default function SignUp() {
  const history = useHistory();
  const [signUpMutation, { loading, error }] = useMutation<
    SignUpMutation,
    SignUpMutationVariables
  >(SIGNUP, { fetchPolicy: 'no-cache' });
  const {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: { email: '', newPassword: '' },
    validationSchema: object({
      email: string()
        .email('Invalid email address')
        .required('Email is required'),
      newPassword: string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: (values) => {
      signUpMutation({
        variables: { email: values.email, password: values.newPassword },
      })
        .then((res) => {
          if (res?.data?.signUp) history.push('/');
        })
        .catch(() => {
          // error handled via object provided by apollo mutation hook
        });
    },
  });

  let errorText: string;
  if (error?.graphQLErrors[0].extensions?.code === 'BAD_USER_INPUT') {
    errorText = error.graphQLErrors[0].message;
  } else {
    errorText = 'Something went wrong. Please try again';
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormTitle>SIGN UP</FormTitle>
        {error && <FormError>{errorText}</FormError>}
        <TextField
          id="email"
          name="email"
          label="Email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && Boolean(errors.email)}
          errorText={errors.email}
          disabled={loading}
        />
        <TextField
          id="newPassword"
          type="password"
          name="newPassword"
          label="Password"
          autoComplete="new-password"
          value={values.newPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.newPassword && Boolean(errors.newPassword)}
          errorText={errors.newPassword}
          disabled={loading}
        />
        <Button fullWidth type="submit" isLoading={loading}>
          Sign Up
        </Button>
      </form>
      <FormBottomText>
        Already have an account? <Link to="/">Log in</Link>
      </FormBottomText>
    </>
  );
}
