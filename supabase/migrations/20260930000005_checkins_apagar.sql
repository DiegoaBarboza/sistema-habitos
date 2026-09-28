-- Marco 6: tocar num check-in "feito" volta para pendente, o que apaga o registro.

create policy "Apaga os próprios check-ins" on public.checkins
  for delete to authenticated using ((select auth.uid()) = user_id);
