import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN } from '../../api';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import Button from '../../components/Button';
import { TextField, FormError } from '../../components/Form';
import { useFormik } from 'formik';
import { string, object } from 'yup';
import { LoginMutation, LoginMutationVariables } from '../../types/graphql';
import { FormTitle } from '../../components/Form/FormTitle';
import { FormBottomText } from '../../components/Form/FormBottomText';

export default function Login() {
  const history = useHistory();
  const { login } = useAuth();
  const [loginMutation, { loading, error }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN, { fetchPolicy: 'no-cache' });
  const {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: object({
      email: string()
        .email('Invalid email address')
        .required('Email is required'),
      password: string().required('Password is required'),
    }),
    onSubmit: (values) => {
      loginMutation({ variables: { ...values } })
        .then((res) => res.data && login(res.data.login))
        .then(() => history.push('/decks'))
        .catch(() => {
          // error handled via object provided by apollo mutation hook
        });
    },
  });

  let errorText;
  if (error?.graphQLErrors[0]?.extensions?.code === 'BAD_USER_INPUT') {
    errorText = error.graphQLErrors[0].message;
  } else {
    errorText = 'Something went wrong';
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormTitle>LOG IN</FormTitle>
        {error && <FormError>{errorText}. Please try again</FormError>}
        <TextField
          id="email"
          type="email"
          name="email"
          label="Email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && Boolean(errors.email)}
          errorText={errors.email}
        />
        <TextField
          id="password"
          type="password"
          name="password"
          label="Password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password && Boolean(errors.password)}
          errorText={errors.password}
        />
        <Button fullWidth type="submit" isLoading={loading}>
          Log in
        </Button>
      </form>
      <FormBottomText>
        Dont have an account? <Link to="/signup">Sign Up</Link>
      </FormBottomText>
    </>
  );
}
