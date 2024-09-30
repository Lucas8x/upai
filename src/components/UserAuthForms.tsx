import Link from 'next/link';
import {
  TbBrandGithubFilled,
  TbBrandDiscordFilled,
  TbBrandGoogleFilled,
} from 'react-icons/tb';
import { signIn } from '../../auth';
import { CredentialsForm } from './CredentialsForm';
import { SocialButton } from './SocialButton';
import { Separator } from './ui/separator';

type Props = {
  formType?: 'login' | 'register';
};

export function UserAuthForms({ formType = 'login' }: Props) {
  const isSignUp = formType === 'register';

  return (
    <div className='mx-2 flex w-full max-w-72 flex-col items-center gap-4 rounded-md px-4 py-6 sm:max-w-xs'>
      <h1 className='text-2xl font-semibold'>Bem-vindo</h1>
      <p className='text-neutral-400'>Crie ou entre na sua conta</p>

      <div className='flex w-full flex-col gap-4'>
        {/* <Separator />

        <CredentialsForm isSignUp={isSignUp} />

        <div className='flex flex-col items-center'>
          <p className='text-center text-sm'>
            {isSignUp ? 'Ja possui uma conta?' : 'Não possui uma conta?'}
          </p>
          <Link href={isSignUp ? '/login' : '/signup'} className='underline'>
            Clique aqui para {isSignUp ? 'entrar' : 'criar uma conta'}
          </Link>
        </div> */}

        <Separator />

        <form
          action={async () => {
            'use server';
            await signIn('github');
          }}
        >
          <SocialButton
            className='flex w-full items-center justify-center gap-2 rounded-md bg-purple-700 py-3 transition-all duration-300 hover:bg-purple-500 active:scale-95'
            icon={<TbBrandGithubFilled size={24} />}
          >
            <span className='font-medium'>Entrar com GitHub</span>
          </SocialButton>
        </form>

        <form
          action={async () => {
            'use server';
            await signIn('discord');
          }}
        >
          <SocialButton
            className='flex w-full items-center justify-center gap-2 rounded-md bg-blue-700 py-3 transition-all duration-300 hover:bg-blue-500 active:scale-95'
            icon={<TbBrandDiscordFilled size={24} />}
          >
            <span className='font-medium'>Entrar com Discord</span>
          </SocialButton>
        </form>

        {/* <form
          action={async () => {
            'use server';
            await signIn('google');
          }}
        >
          <SocialButton
            className='flex w-full items-center justify-center gap-2 rounded-md bg-red-600 py-3 transition-all duration-300 hover:bg-red-500 active:scale-95'
            icon={<TbBrandGoogleFilled size={24} />}
          >
            <span className='font-medium'>Entrar com Google</span>
          </SocialButton>
        </form> */}
      </div>

      <span className='text-center text-xs text-neutral-400'>
        Seu nome e foto serão exibidos no site.
      </span>
    </div>
  );
}
