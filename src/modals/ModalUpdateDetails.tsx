'use client';

import { createPortal, useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TbCalendarFilled } from 'react-icons/tb';
import { ptBR } from 'date-fns/locale';
import { ModalBase } from './ModalBase';
import { UserProfileDetailsSchema } from '@/lib/schemas';
import countries from '@/data/countries.json';
import { updateProfileDetails } from '@/actions/update-profile-details';
import { dayjs } from '@/utils/dayjs';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
//import 'react-day-picker/dist/style.css';

type Props = {
  initialValues: z.infer<typeof UserProfileDetailsSchema>;
  isOpen: boolean;
  onClose: () => void;
};

type DetailsForm = z.infer<typeof UserProfileDetailsSchema>;

function normalizeInitialValues(data: DetailsForm) {
  return {
    sex: data.sex ?? 'none',
    country: data.country,
    birthdate: data.birthdate ? dayjs(data.birthdate).toISOString() : undefined,
    biography: data.biography,
  };
}

export function ModalUpdateDetails({ initialValues, isOpen, onClose }: Props) {
  const [date, setDate] = useState<Date | undefined | null>(undefined);

  const form = useForm<DetailsForm>({
    mode: 'all',
    resolver: zodResolver(UserProfileDetailsSchema),
    defaultValues: normalizeInitialValues(initialValues),
  });

  const { toast } = useToast();
  if (!isOpen) return null;

  async function onSubmit(formData: FormData) {
    if (date) {
      formData.set('birthdate', date.toISOString());
    }

    const { success, error, data } = await updateProfileDetails(formData);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Não foi possível atualizar seu perfil. Tente novamente',
      });
      return;
    }

    if (success) {
      toast({
        title: 'Perfil atualizado com sucesso',
      });
      // @ts-ignore-next-line
      form.reset(data && normalizeInitialValues(data));
      onClose();
    }
  }

  return createPortal(
    <ModalBase>
      <Form {...form}>
        <form
          className='col-span-2 mx-4 grid w-full max-w-96 gap-2 rounded bg-zinc-900 p-6'
          action={onSubmit}
        >
          <FormField
            control={form.control}
            name='sex'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gênero</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...field}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione seu gênero' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='none'>Não informar</SelectItem>
                    <SelectItem value='male'>Masculino</SelectItem>
                    <SelectItem value='female'>Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='country'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pais</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...field}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione seu pais' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='none'>Não informar</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country.iso3} value={country.iso3}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='birthdate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Data de nascimento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          dayjs(field.value).format('DD/MM/YYYY')
                        ) : (
                          <span>Selecione a data</span>
                        )}
                        <TbCalendarFilled className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={dayjs(field.value).toDate()}
                      onSelect={(e) => {
                        //field.onChange(e);
                        field.onChange(dayjs(e).toISOString());
                        setDate(e);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      captionLayout='dropdown'
                      fromYear={new Date().getFullYear() - 100}
                      toYear={new Date().getFullYear()}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='biography'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobre</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Escrava um pouco sobre você'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ActionButtons onClose={onClose} disabled={!form.formState.isValid} />
        </form>
      </Form>
    </ModalBase>,
    document.body,
  );
}

type ActionButtonsProps = {
  onClose: () => void;
  disabled: boolean;
};

function ActionButtons(props: ActionButtonsProps) {
  const { onClose, disabled } = props;
  const { pending } = useFormStatus();

  return (
    <div className='flex w-full justify-between'>
      <Button variant='outline' onClick={onClose} disabled={pending}>
        Cancelar
      </Button>
      <Button type='submit' disabled={pending || disabled}>
        {pending ? 'Atualizando...' : 'Atualizar'}
      </Button>
    </div>
  );
}
