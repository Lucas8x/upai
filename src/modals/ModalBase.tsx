type Props = {
  children: React.ReactNode;
};

export function ModalBase({ children }: Props) {
  return (
    <div className='fixed inset-0 z-[7] flex min-h-screen w-full items-center justify-center bg-zinc-950/60'>
      {children}
    </div>
  );
}
