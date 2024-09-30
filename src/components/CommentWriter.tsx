'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CommentSchema } from '@/lib/schemas';
import { Textarea } from './ui/textarea';
import { toast } from './ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { writeComment } from '@/actions/write-post-comment';

type Props = {
  postID: string;
};

export function CommentWriter({ postID }: Props) {
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
  });

  async function onSubmit(data: z.infer<typeof CommentSchema>) {
    const { success, error } = await writeComment(postID, data.comment);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Não foi possível enviar seu comentário. Tente novamente',
      });
      return;
    }

    if (success) {
      toast({
        title: 'Comentário enviado.',
      });
      form.reset({
        comment: '',
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-2 rounded-md bg-neutral-900 p-4'
      >
        <FormField
          control={form.control}
          name='comment'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Escreva seu comentário</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Conte-nos o que achou da publicação'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex w-full justify-end gap-2'>
          <button
            className='rounded bg-green-700 px-3 py-2 hover:bg-green-500'
            type='submit'
          >
            Enviar
          </button>
        </div>
      </form>
    </Form>
  );
}
