'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  LoginCredentialsFormSchema,
  SignUpCredentialsFormSchema,
} from '@/lib/schemas';
import { SocialButton } from './SocialButton';
import { toast } from './ui/use-toast';

type Props = {
  isSignUp?: boolean;
};

export function CredentialsForm({ isSignUp }: Props) {
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(
      isSignUp ? SignUpCredentialsFormSchema : LoginCredentialsFormSchema,
    ),
    defaultValues: {
      username: '',
      password: '',
      ...(isSignUp && {
        confirmPassword: '',
      }),
    },
  });

  async function login(data: z.infer<typeof LoginCredentialsFormSchema>) {
    try {
      const { username, password } = data;

      const response = await signIn('credentials', {
        username,
        password,
        redirect: true,
        callbackUrl: '/',
      });

      if (!response?.ok) {
        throw new Error('');
      }

      //toast({ title: 'Logado com sucesso.' });
    } catch (error) {
      toast({
        title: 'Não foi possível logar. Tente novamente',
        //description: error.message,
      });
    }
  }

  /* async function signUp(data: z.infer<typeof SignUpCredentialsFormSchema>) {
    try {
      const { username, password } = data;

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast({ title: 'Cadastrado com sucesso.' });

      await signIn('credentials', {
        username,
        password,
        redirect: true,
        callbackUrl: '/',
      });
    } catch (error: any) {
      toast({ title: 'Falha ao cadastrar.', description: error.message });
    }
  } */

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(login)} className='flex flex-col gap-1'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-neutral-200'>Usuário</FormLabel>
              <FormControl>
                <Input
                  className='text-white'
                  placeholder='Insira seu usuário'
                  {...field}
                  type='text'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-neutral-200'>Senha</FormLabel>
              <FormControl>
                <Input
                  className='text-white'
                  placeholder='Insira sua senha'
                  {...field}
                  type='password'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isSignUp && (
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-neutral-200'>
                  Confirmar senha
                </FormLabel>
                <FormControl>
                  <Input
                    className='text-white'
                    placeholder='Insira a mesma senha'
                    {...field}
                    type='password'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <SocialButton
          className='mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-100 py-3 text-neutral-900 transition-all duration-300 hover:bg-neutral-100/60 active:scale-95'
          type='submit'
        >
          <span className='font-medium'>
            {isSignUp ? 'Cadastrar' : 'Entrar'}
          </span>
        </SocialButton>
      </form>
    </Form>
  );
}
