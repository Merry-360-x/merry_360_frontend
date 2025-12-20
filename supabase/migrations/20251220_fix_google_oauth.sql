-- Fix handle_new_user function to properly extract Google OAuth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, phone, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        -- Try multiple metadata fields for first name (email signup vs Google OAuth)
        COALESCE(
            NEW.raw_user_meta_data->>'firstName',
            NEW.raw_user_meta_data->>'first_name', 
            NEW.raw_user_meta_data->>'given_name',
            split_part(NEW.email, '@', 1) -- Fallback to email prefix
        ),
        -- Try multiple metadata fields for last name
        COALESCE(
            NEW.raw_user_meta_data->>'lastName',
            NEW.raw_user_meta_data->>'last_name',
            NEW.raw_user_meta_data->>'family_name',
            '' -- Empty string fallback
        ),
        COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone, ''),
        -- Extract avatar from Google OAuth
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            NEW.raw_user_meta_data->>'picture',
            ''
        )
    )
    ON CONFLICT (id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
