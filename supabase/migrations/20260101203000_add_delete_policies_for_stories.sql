-- Adds DELETE policies for stories so users can remove their own story.
-- Does not change RLS enabled/disabled state; policies only take effect when RLS is enabled.

-- Stories: allow story owner (or admin) to delete.
drop policy if exists "Stories delete own" on public.stories;
create policy "Stories delete own"
  on public.stories
  for delete
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

-- Story comments: allow comment owner, story owner, or admin to delete.
drop policy if exists "Story comments delete own or story owner" on public.story_comments;
create policy "Story comments delete own or story owner"
  on public.story_comments
  for delete
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1
      from public.stories s
      where s.id = story_comments.story_id
        and s.user_id = auth.uid()
    )
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

-- Story likes: allow like owner, story owner, or admin to delete.
drop policy if exists "Story likes delete own or story owner" on public.story_likes;
create policy "Story likes delete own or story owner"
  on public.story_likes
  for delete
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1
      from public.stories s
      where s.id = story_likes.story_id
        and s.user_id = auth.uid()
    )
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );
