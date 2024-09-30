import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { TbUserFilled } from 'react-icons/tb';
import { getProfilePageData } from '@/routes/get-profile-page-data';
import { MediaCard } from '@/components/MediaCard';
import { ProfileEditButton } from '@/components/ProfileEditButton';
import { auth } from '../../../../auth';
import { dayjs } from '@/utils/dayjs';
import countries from '@/data/countries.json';

type Props = {
  params: {
    slug: string[];
  };
};

export default async function ProfilePage({ params }: Props) {
  let id = params.slug?.[0];
  let isOwnerProfile = false;

  if (!id) {
    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return redirect('/404');
    }

    id = session.user.id;
    isOwnerProfile = true;
  }

  const data = await getProfilePageData(id);

  if (!data) {
    return redirect('/404');
  }

  const { name, image, posts, biography, birthdate, country, sex, _count } =
    data;

  return (
    <div className='flex h-full min-h-screen flex-col items-center gap-2 pb-10 pt-16'>
      <div className='mt-4 flex h-full w-full max-w-7xl flex-col gap-4 px-4'>
        <div className='flex flex-col items-center gap-2 sm:items-start'>
          {isOwnerProfile ? (
            <h1 className='font-semibold'>Seu perfil</h1>
          ) : (
            <h1 className=''>
              Perfil de <b className='font-semibold capitalize'>{name}</b>
            </h1>
          )}

          <div className='flex w-full flex-col items-center gap-4 sm:flex-row'>
            {image ? (
              <Image
                className='aspect-square size-32 rounded-full bg-neutral-900 md:size-52'
                src={image ?? ''}
                alt={name ?? ''}
                width={128}
                height={128}
              />
            ) : (
              <div className='flex aspect-square size-32 cursor-pointer items-center justify-center rounded-full bg-neutral-900 p-6 md:size-52 md:p-8'>
                <TbUserFilled className='h-full w-full' />
              </div>
            )}

            <div className='flex w-full flex-col gap-2 rounded bg-neutral-900 p-4 md:min-h-32'>
              <div className='grid grid-cols-2 gap-2'>
                <UserInfoItem
                  label='Pais'
                  value={countries.find((i) => i.iso3 === country)?.name}
                />
                <UserInfoItem
                  label='Idade'
                  value={birthdate && dayjs().diff(birthdate, 'years')}
                />
                <UserInfoItem label='Sexo' value={sex} />
                <UserInfoItem label='Comentários' value={_count.comments} />
                <UserInfoItem label='Favoritos' value={null} />
              </div>

              <div>
                <p className='text-neutral-200'>Sobre mim:</p>
                <span className='font-semibold'>{biography || '---'}</span>
              </div>
            </div>
          </div>

          <ProfileEditButton
            initialValues={{
              country: country ?? undefined,
              birthdate: birthdate ? dayjs(birthdate).toISOString() : undefined,
              biography: biography ?? '',
              sex: sex ?? undefined,
            }}
          />
        </div>

        <div className='flex h-full w-full flex-col gap-4'>
          <h2 className='font-medium'>Publicações ({posts.length})</h2>

          {posts.length > 0 ? (
            <div className='flex flex-wrap gap-4'>
              {posts.map((i) => (
                <MediaCard
                  key={i.id}
                  postID={i.id}
                  title={i.title}
                  files={i.files}
                  createdAt={i.createdAt}
                  isOwnerProfile={isOwnerProfile}
                />
              ))}
            </div>
          ) : (
            <div className='flex h-full flex-col items-center justify-center text-center text-2xl text-neutral-500 md:text-4xl'>
              <span>Sem publicações</span>
              <span>(◡︵◡)</span>
              {isOwnerProfile && (
                <Link
                  href='/upload'
                  className='mt-4 text-lg underline md:text-xl'
                >
                  <span>Clique aqui para fazer upload</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type UserInfoItemProps = {
  label: string;
  value?: string | number | null;
};

function UserInfoItem(props: UserInfoItemProps) {
  const { label, value } = props;
  return (
    <p className='h-min text-neutral-300'>
      {label}:{' '}
      <span className='font-semibold capitalize text-white'>
        {value ?? '---'}
      </span>
    </p>
  );
}
