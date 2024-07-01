# Novelize 📖

Repository README
Environment Variables
Create a .env file in the root directory of your project and add the following environment variables:

```
EXPO_USE_FAST_RESOLVER=1
EXPO_UNSTABLE_ATLAS=1
EXPO_GOOGLE_BOOKS_API_KEY=your_google_books_api_key
EXPO_OPENAI_API_KEY=your_openai_api_key
EXPO_REACT_NATIVE_SUPABASE_URL=your_supabase_url
EXPO_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Supabase Configuration
Add an "audios" bucket in your Supabase storage and grant it full access to ensure that your application can read from and write to this bucket without any restrictions.

Steps to Add "audios" Bucket in Supabase:
1. Log in to your Supabase account and navigate to your project.
2. Go to the `"Storage"` section in the left sidebar.
3. Click on `"Create a new bucket"`.
4. Name the bucket `"audios"`.
5. Ensure the bucket has full access permissions for reading and writing.

Getting the project up and running:

1. `yarn`
2. `npx expo start --go`
3. Click `w` to enter into website, or click `i` for iOS and `a` for android



